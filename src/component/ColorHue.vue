<template>
  <div
    ref="hueRef"
    :style="{ width: `${width}px`, height: `${height}px`, padding: `0 ${height / 2}px` }"
    class="color-hue"
  >
    <div :style="{ height: `${height}px` }" @mousedown.prevent.stop="onMousedown"></div>
    <div
      ref="thumbRef"
      :style="{
        width: `${height}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      }"
      @mousedown.prevent.stop="onMousedown"
    ></div>
  </div>
</template>

<script>
import { defineComponent, watch, ref, onMounted } from "vue";

const height = 12;

export default defineComponent({
  name: "ColorHue",
  props: {
    value: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const hueRef = ref(null);
    const thumbRef = ref(null);
    const top = ref(0);
    const left = ref(0);

    function onMousedown(event) {
      const rect = hueRef.value.getBoundingClientRect();
      const mousemove = (event) => {
        let _left = event.clientX - rect.left
        _left = Math.min(_left, rect.width - thumbRef.value.offsetWidth / 2)
        _left = Math.max(thumbRef.value.offsetWidth / 2, _left);
        const h = Math.round(
          ((_left - thumbRef.value.offsetWidth / 2) /
            (rect.width - thumbRef.value.offsetWidth)) *
          360
        );
        props.value.set("h", h);
      }

      mousemove(event);

      const mouseup = () => {
        globalThis.document.removeEventListener("mousemove", mousemove);
        globalThis.document.removeEventListener("mouseup", mouseup);
      }

      globalThis.document.addEventListener("mousemove", mousemove);
      globalThis.document.addEventListener("mouseup", mouseup);
    }

    function update() {
      const h = props.value.get("h");
      if (!hueRef.value) {
        left.value = 0;
      }
      left.value = Math.round((h * (hueRef.value.offsetWidth - thumbRef.value.offsetWidth / 2)) / 360);
    }

    watch(
      () => props.value.get("h"),
      () => update()
    )

    onMounted(() => update());

    return {
      hueRef,
      thumbRef,
      onMousedown,
      left,
      top,
      height
    }
  },
})
</script>

<style>
.color-hue {
  position: relative;
  margin-bottom: 3px;
  box-sizing: border-box;
  background-color: red;
}

.color-hue > div:first-child {
  position: relative;
  background: linear-gradient(
    to right,
    #f00 0%,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    #f00 100%
  );
  width: 100%;
}

.color-hue > div:last-child {
  position: absolute;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 1px 1px rgb(255, 255, 255) inset, 0 1px 0 rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
</style>
