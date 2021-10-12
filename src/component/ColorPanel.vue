<template>
  <div
    class="color-panel"
    ref="colorPanelRef"
    :style="{
      backgroundColor: background,
      width: `${width}px`,
      height: `${height}px`
    }"
    @mousedown="onMousedown"
  >
    <div class="color-panel-white"></div>
    <div class="color-panel-black"></div>
    <div :style="{ left: `${left}px`, top: `${top}px` }" class="color-slider">
      <div></div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, nextTick, onMounted, ref, watch } from "vue";
import draggable from "../draggable";

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

    watch(
      [() => props.value.get("h"), () => props.value.get("v")],
      () => update()
    )

    onMounted(() => {
      nextTick(() => {
        draggable(colorPanelRef.value, {
          drag: (event) => {
            onMousedown(event)
          },
          end: (event) => {
            onMousedown(event)
          },
        })
        update();
      })
    })

    return {
      colorPanelRef,
      background,
      onMousedown,
      left,
      top
    }
  }
})
</script>

<style>
.color-panel {
  position: relative;
  box-sizing: border-box;
}

.color-panel-white,
.color-panel-black {
  position: absolute;
  box-sizing: border-box;
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

.color-panel .color-slider {
  position: absolute;
  cursor: pointer;
}

.color-panel .color-slider > div {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px #0000004d, 0 0 1px 2px #0006;
  transform: translate(-3px, -3px);
}
</style>

