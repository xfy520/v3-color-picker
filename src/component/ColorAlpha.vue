<template>
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

import { getRgb } from "./utils";

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
</style>
