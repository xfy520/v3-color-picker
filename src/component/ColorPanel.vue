<!-- <template>
  <div class="color-panel" ref="colorPanelRef" @mousedown.prevent.stop="onMousedown">
    <canvas ref="canvasRef" />
    <div :style="{ left: `${left}px`, top: `${top}px` }" class="slider" />
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { createLinearGradient, RgbToHsv } from "../script/utils";

export default defineComponent({
  name: "ColorPanel",
  props: {
    value: {
      type: Object,
      default: {
        r: 255,
        g: 255,
        b: 255
      }
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

    const left = ref((hsv.value.s / 100) * props.width - 5);
    const top = ref((1 - (hsv.value.v / 100)) * props.height - 5);

    function onMousedown(event) {
      const { top: Top, left: Left, } = colorPanelRef.value.getBoundingClientRect();
      const ctx = canvasRef.value.getContext("2d");

      const mousemove = (event) => {
        let x = event.clientX - Left;
        let y = event.clientY - Top;

        x = x < 0 ? 0 : x;
        x = x > props.width ? props.width : x;

        y = y < 0 ? 0 : y;
        y = y > props.height ? props.height : y;

        left.value = x - 5;
        top.value = y - 5;


        const canvasData = ctx.getImageData(Math.min(x, props.width - 1), Math.min(y, props.height - 1), 1, 1)
        const [r, g, b] = canvasData.data;
        emit('update:value', {
          r, g, b
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


    onMounted(() => {
      const ctx = canvasRef.value.getContext("2d");
      canvasRef.value.width = props.width;
      canvasRef.value.height = props.height;
      ctx.fillStyle = `rgb(${props.value.r},${props.value.g},${props.value.b})`;
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style> -->


<template>
  <div
    class="color-panel"
    ref="colorPanelRef"
    :style="{
      backgroundColor: background,
      width: `${width}px`,
      height: `${height}px`
    }"
    @mousedown.prevent.stop="onMousedown"
  >
    <div class="color-panel-white"></div>
    <div class="color-panel-black"></div>
    <div :style="{ left: `${left}px`, top: `${top}px` }" class="slider">
      <div></div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";

export default defineComponent({
  name: "ColorPanel",
  props: {
    value: {
      type: Object,
      required: true
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
  setup(props) {
    const colorPanelRef = ref(null);
    const left = ref(0);
    const top = ref(0);

    const background = computed(() => `hsl(${props.value.get('h')}, 100%, 50%)`);

    function update() {
      const s = props.value.get("s");
      const v = props.value.get("v");
      const { clientWidth, clientHeight } = colorPanelRef.value;
      left.value = (s * clientWidth) / 100;
      top.value = ((100 - v) * clientHeight) / 100;
    }

    function onMousedown(event) {
      let rect = colorPanelRef.value.getBoundingClientRect();

      const mousemove = (event) => {
        let _left = event.clientX - rect.left;
        let _top = event.clientY - rect.top;
        _left = Math.max(0, _left);
        _left = Math.min(_left, rect.width);

        _top = Math.max(0, _top);
        _top = Math.min(_top, rect.height);

        left.value = _left;
        top.value = top;
        props.value.set("s", (_left / rect.width) * 100);
        props.value.set("v", 100 - (_top / rect.height) * 100);
      }
      mousemove(event);
      const mouseup = () => {
        globalThis.document.removeEventListener("mousemove", mousemove);
        globalThis.document.removeEventListener("mouseup", mouseup);
      }
      globalThis.document.addEventListener("mousemove", mousemove);
      globalThis.document.addEventListener("mouseup", mouseup);
    }

    watch(
      [() => props.value.get("h"), () => props.value.get("v")],
      () => update()
    )

    onMounted(() => update())

    return {
      background,
      onMousedown,
      colorPanelRef,
      left,
      top
    }
  }
})
</script>

<style>
.color-panel {
  position: relative;
  overflow: hidden;
}

.color-panel-white,
.color-panel-black {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.color-panel-white {
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}

.color-panel-black {
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}

.color-panel .slider {
  position: absolute;
  cursor: pointer;
}

.color-panel .slider > div {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px #0000004d, 0 0 1px 2px #0006;
  transform: translate(-5px, -5px);
}
</style>

