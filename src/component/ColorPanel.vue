<template>
  <div class="color-panel" ref="colorPanelRef" @mousedown.prevent.stop="onMousedown">
    <canvas ref="canvasRef" />
    <div :style="{ left, top }" class="slider" />
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { createLinearGradient, RgbToHsv } from "./utils";

export default defineComponent({
  name: "ColorPanel",
  props: {
    value: {
      type: String,
      default: "rgb(255,255,255)",
    },
    height: {
      type: Number,
      default: 150,
    },
    width: {
      type: Number,
      default: 210,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const canvasRef = ref(null);
    const colorPanelRef = ref(null);

    const hsv = computed(() => RgbToHsv(props.value));

    const left = ref(`${(hsv.value.s / 100) * props.width - 5}px`);
    const top = ref(`${(1 - (hsv.value.v / 100)) * props.height - 5}px`);

    function onMousedown(event) {
      const { top: Top, left: Left, } = colorPanelRef.value.getBoundingClientRect();
      const ctx = canvasRef.value.getContext("2d");

      const mousemove = (event) => {
        let x = event.clientX - Left;
        let y = event.clientY - Top;
        left.value = `${(x < 0 ? 0 : x > props.width ? props.width : x) - 5}px`;
        top.value = `${(y < 0 ? 0 : y > props.height ? props.height : y) - 5}px`;
        const canvasData = ctx.getImageData(Math.min(x, props.width - 1), Math.min(y, props.height - 1), 1, 1)
        const [r, g, b] = canvasData.data;
        emit('update:value', `rgb(${r},${g},${b})`);
      }
      mousemove(event);
      const mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      }
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }


    onMounted(() => {
      const ctx = canvasRef.value.getContext("2d");
      canvasRef.value.width = props.width;
      canvasRef.value.height = props.height;
      ctx.fillStyle = props.value;
      ctx.fillRect(0, 0, props.width, props.height);

      createLinearGradient(ctx, 'h', props.width, props.height, "#fff", "#fff0");
      createLinearGradient(ctx, 'v', props.width, props.height, "#0000", "#000");
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
