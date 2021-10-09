<template>
  <div class="color-hue" ref="colorHueRef" @mousedown.prevent.stop="onMousedown">
    <canvas ref="canvasRef" />
    <div
      :style="{
        width: `${height}px`,
        height: `${height}px`,
        left: `${left < 0 ? 0 : (left + height) > width ? (width - height) : left}px`,
      }"
      class="slider"
    ></div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onMounted, watch } from "vue";
import { RgbToHsv } from "./utils";

const height = 12;

export default defineComponent({
  name: "ColorHue",
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
  emits: ["update:value", "update:hue"],
  setup(props, { emit }) {
    const colorHueRef = ref(null);
    const canvasRef = ref(null);

    const left = computed(() => (((1 - RgbToHsv(props.value).h / 360)) * props.width - 2));

    function onMousedown(event) {
      const Left = colorHueRef.value.getBoundingClientRect().left;
      const ctx = canvasRef.value.getContext("2d");

      const mousemove = (event) => {
        let x = event.clientX - Left;
        const canvasData = ctx.getImageData(Math.min(x < 0 ? 0 : x, props.width - 1), 1, 1, 1);
        const [r, g, b] = canvasData.data;
        emit("update:value", {
          r, g, b
        });
        emit("update:hue", RgbToHsv({
          r, g, b
        }).h)
      }

      mousemove(event);

      const mouseup = () => {
        globalThis.document.removeEventListener("mousemove", mousemove);
        globalThis.document.removeEventListener("mouseup", mouseup);
      }

      globalThis.document.addEventListener("mousemove", mousemove);
      globalThis.document.addEventListener("mouseup", mouseup);
    }

    onMounted(() => {
      const ctx = canvasRef.value.getContext("2d");
      canvasRef.value.height = height;
      canvasRef.value.width = props.width;
      const grd = ctx.createLinearGradient(0, 0, props.width, 0);
      grd.addColorStop(0, '#F00');
      grd.addColorStop(0.17 * 5, '#FF0');
      grd.addColorStop(0.17 * 4, '#0F0');
      grd.addColorStop(0.17 * 3, '#0FF');
      grd.addColorStop(0.17 * 2, '#00F');
      grd.addColorStop(0.17 * 1, '#F0F');
      grd.addColorStop(1, '#F00');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, props.width, height);
    })

    return {
      colorHueRef,
      canvasRef,
      height,
      left,
      onMousedown
    }
  },
})
</script>

<style>
.color-hue {
  height: 16px;
  display: flex;
  align-items: center;
  position: relative;
}

.color-hue .slider {
  position: absolute;
  top: 0.2px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 0 1px 1px rgb(255, 255, 255) inset, 0 1px 0 rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
</style>
