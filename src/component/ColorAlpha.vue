<!-- <template>
  <div class="color-alpha">
    <div
      :style="{
        width: `${width}px`,
        height: `${height}px`,
      }"
      @mousedown.prevent.stop="onMousedown"
      ref="colorAlphaRef"
    >
      <div
        :style="{
          width: `${width}px`,
          height: `${height}px`,
          background: `linear-gradient(to right, rgba(${value.r}, ${value.g}, ${value.b}, 0) 0%, rgb(${value.r}, ${value.g}, ${value.b}) 100%)`
        }"
      ></div>
      <div
        class="slider"
        :style="{
          width: `${height}px`,
          height: `${height}px`,
          left: `${left}px`,
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

import { getRgb } from "../script/utils";

const height = 11;

export default defineComponent({
  name: "ColorAlpha",
  props: {
    value: {
      type: Object,
      default: {
        r: 255,
        g: 255,
        b: 255
      }
    },
    width: {
      type: Number,
      default: 100
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const colorAlphaRef = ref(null);
    const left = ref(props.width - height);
    function onMousedown(event) {
      const Left = colorAlphaRef.value.getBoundingClientRect().left;

      const mousemove = (event) => {
        let x = event.clientX - Left;
        x = x < 0 ? 0 : x;
        x = x + height > props.width ? props.width - height : x;
        left.value = x;

        emit('update:value', {
          ...props.value,
          a: Math.floor(x / (props.width - height) * 100) / 100
        });
      }

      mousemove(event);

      const mouseup = () => {
        globalThis.document.removeEventListener("mousemove", mousemove);
        globalThis.document.removeEventListener("mouseup", mouseup);
      }

      globalThis.document.addEventListener("mousemove", mousemove);
      globalThis.document.addEventListener("mouseup", mouseup);
    }
    return {
      colorAlphaRef,
      height,
      onMousedown,
      left
    }
  },
})
</script>

<style>
.color-alpha {
  height: 16px;
  display: flex;
  align-items: center;
}

.color-alpha > div {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
  position: relative;
}

.color-alpha .slider {
  position: absolute;
  top: -0.3px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #ffffff;
  box-shadow: 0 0 1px 1px rgb(255, 255, 255) inset, 0 1px 0 rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
</style> -->





<template>
  <div
    ref="alphaRef"
    class="color-alpha"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      padding: `0 ${height / 2}px`
    }"
  >
    <div
      ref="barRef"
      :style="{
        width: `${width}px`,
        height: `${height}px`,
        background,
      }"
      @mousedown.prevent.stop="onMousedown"
    ></div>
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
import { defineComponent, ref, computed, watch, onMounted } from "vue";

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
    console.log(props.value)
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
      }
      // top.value = Math.round((a * (alphaRef.value.offsetHeight - thumbRef.value.offsetHeight / 2)) / 100);
      left.value = Math.round((a * (alphaRef.value.offsetWidth - thumbRef.value.offsetWidth / 2)) / 100);
    }

    watch(
      [() => props.value.get("a"), () => props.value.v],
      () => update()
    )

    onMounted(() => update());

    function onMousedown(event) {
      const recat = alphaRef.value.getBoundingClientRect();

      const mousemove = (event) => {

      }

      mousemove(event);

      const mouseup = () => {
        globalThis.document.removeEventListener("mousemove", mousemove);
        globalThis.document.removeEventListener("mouseup", mouseup);
      }

      globalThis.document.addEventListener("mousemove", mousemove);
      globalThis.document.addEventListener("mouseup", mouseup);
    }
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
</style>

