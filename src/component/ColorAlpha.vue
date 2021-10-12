<template>
  <div
    ref="alphaRef"
    class="color-alpha"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
  >
    <div ref="barRef" :style="{
      height: `${height}px`,
      background,
    }"></div>
    <div
      ref="thumbRef"
      :style="{
        width: `${height}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      }"
    ></div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted, nextTick } from "vue";
import draggable from "../draggable";

const height = 12;

export default defineComponent({
  name: "ColorAlpha",
  props: {
    value: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 100
    }
  },
  setup(props) {
    const alphaRef = ref(null);
    const barRef = ref(null);
    const thumbRef = ref(null);
    const top = ref(0);
    const left = ref(0);

    const background = computed(() => {
      if (props.value && props.value.v) {
        const { r, g, b } = props.value.rgba;
        return `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`
      }
      return null
    })

    function update() {
      const a = props.value.get("a");
      if (!alphaRef.value) {
        left.value = 0;
        return 0;
      }
      left.value = Math.round((a * (alphaRef.value.offsetWidth - thumbRef.value.offsetWidth / 2)) / 100);
    }

    watch(
      () => props.value.get("a"),
      () => update()
    )

    function onMousedown(event) {
      const rect = alphaRef.value.getBoundingClientRect();
      let _left = event.clientX - rect.left
      _left = Math.max(thumbRef.value.offsetWidth / 2, _left);
      _left = Math.min(_left, rect.width - thumbRef.value.offsetWidth / 2);
      props.value.set("a",
        Math.round(
          ((_left - thumbRef.value.offsetWidth / 2) /
            (rect.width - thumbRef.value.offsetWidth)) *
          100
        )
      )
    }

    onMounted(() => {
      nextTick(() => {
        const dragConfig = {
          drag: (event) => {
            onMousedown(event);
          },
          end: (event) => {
            onMousedown(event);
          },
        }
        draggable(barRef.value, dragConfig);
        draggable(thumbRef.value, dragConfig);
        update();
      })
    });

    return {
      alphaRef,
      barRef,
      thumbRef,
      height,
      onMousedown,
      top,
      left,
      background
    }
  },
})
</script>

<style>
.color-alpha {
  position: relative;
  margin-top: 3px;
  box-sizing: border-box;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}

.color-alpha > div:first-child {
  position: relative;
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, white 100%);
  width: 100%;
}

.color-alpha > div:last-child {
  position: absolute;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 1px 1px rgb(255, 255, 255) inset, 0 1px 0 rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.color-picker-light .color-alpha > div:last-child {
  background-color: #ddd;
  box-shadow: 0 0 1px 1px #ddd inset, 0 1px 0 rgba(0, 0, 0, 0.5);
}
</style>

