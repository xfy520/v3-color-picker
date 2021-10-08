<template>
  <div class="color-panel" ref="colorPanelRef" @mousedown.prevent.stop="onMousedown">
    <canvas ref="canvasRef" />
    <div :style="{ left, top }" class="slider" />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { createLinearGradient } from './utils'

export default defineComponent({
  name: "ColorPanel",
  props: {
    value: {
      type: String,
      default: '#fff',
    },
    hsv: {
      type: Object,
      default: {
        h: 0,
        s: 0,
        v: 0
      },
    },
    size: {
      type: Number,
      default: 160,
    },
  },
  emits: ['update:value'],
  setup(props) {
    const canvasRef = ref(null);
    const colorPanelRef = ref(null);

    const left = ref(`${props.hsv.s * props.size - 5}px`);
    const top = ref(`${(1 - props.hsv.v) * props.size - 5}px`);

    function onMousedown(event) {
      const { top: Top, left: Left, } = colorPanelRef.value.getBoundingClientRect();
      const ctx = canvasRef.value.getContext("2d");

      const mousemove = () => {
        let x = event.clientX - Left;
        let y = event.clientY - Top;
        left.value = `${(x < 0 ? 0 : x > props.size ? props.size : x) - 5}px`;
        top.value = `${(y < 0 ? 0 : y > props.size ? props.size : y) - 5}px`;

        const canvasData = ctx.getImageData(Math.min(x, props.size - 1), Math.min(y, props.size - 1), 1, 1)
        const [r, g, b, a] = canvasData.data;
        console.log({
          r,
          g,
          b,
          a
        })
      }
      mousemove();
      const mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      }
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }


    onMounted(() => {
      const ctx = canvasRef.value.getContext("2d");
      canvasRef.value.width = props.size;
      canvasRef.value.height = props.size;
      ctx.fillStyle = props.value;
      ctx.fillRect(0, 0, props.size, props.size);

      createLinearGradient(ctx, props.size, 0, "#fff", "#fff0");
      createLinearGradient(ctx, 0, props.size, "#0000", "#000");
    });

    return {
      colorPanelRef,
      canvasRef,
      left,
      top,
      onMousedown,
    }
  }
})
</script>

<style>
.color-panel {
  position: relative;
  overflow: hidden;
}

.color-panel .slider {
  position: absolute;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>
