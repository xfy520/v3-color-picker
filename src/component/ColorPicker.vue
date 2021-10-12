<template>
  <div
    ref="colorRef"
    class="color-picker"
    :class="`color-picker-${theme}`"
    :style="{ width: `${width}px`, zIndex, top: `${style.top}px`, left: `${style.left}px` }"
    @click.stop
    @contextmenu.prevent.stop
  >
    <ColorPanel v-model:value="color" :height="height" :width="width" />
    <div class="color-tool">
      <!-- <ColorStraw /> -->
      <ColorPreview v-model:value="color" />
      <div>
        <ColorHue :width="hueWidth" v-model:value="color" />
        <ColorAlpha :width="hueWidth" v-model:value="color" />
      </div>
    </div>
    <ColorValue v-model:value="color" :width="width" />
    <ColorList :colors="colors" v-model:value="color" />
    <div v-if="btn" class="color-btns">
      <button class="color-btn" @click="clear">
        <span>Clear</span>
      </button>
      <button class="color-btn" @click="confirm">
        <span>OK</span>
      </button>
    </div>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  watch,
  ref,
  nextTick
} from "vue";

import ColorPanel from "./ColorPanel.vue";
// import ColorStraw from "./ColorStraw.vue";
import ColorPreview from "./ColorPreview.vue";
import ColorHue from "./ColorHue.vue";
import ColorAlpha from "./ColorAlpha.vue";
import ColorValue from "./ColorValue.vue";
import ColorList from "./ColorList.vue";
import Color from "../color";

const windowWidth = globalThis.document.documentElement.clientWidth;
const windowHeight = globalThis.document.documentElement.clientHeight;

export default defineComponent({
  name: "ColorPicker",
  components: {
    ColorPanel,
    // ColorStraw,
    ColorPreview,
    ColorHue,
    ColorAlpha,
    ColorValue,
    ColorList
  },
  props: {
    value: {
      type: [String, null],
      default: "#fff"
    },
    zIndex: {
      type: Number,
      default: 2
    },
    position: {
      type: Object,
      required: true
    },
    theme: {
      type: String,
      default: "dark"
    },
    height: {
      type: Number,
      default: 150,
    },
    width: {
      type: Number,
      default: 233,
    },
    colors: {
      type: Array,
      default: ["#ff4500", "#ff8c00", "#ffd700", "#90ee9003", "#00ced1", "#1e90ff", "#c71585",
        "#ff4500ad", "#ff7800", "#fad400", "#90f09080", "#00babd", "#1f93ffba", "#c7158575"],
    },
    btn: {
      type: Boolean,
      default: false
    },
    change: {
      type: Function
    },
    confirm: {
      type: Function,
    },
    clear: {
      type: Function,
    }
  },
  emits: ["update:value", "confirm", "clear"],
  setup(props, { emit }) {
    const colorRef = ref(null);
    const style = ref({
      left: props.position.x || 0,
      top: props.position.y || 0
    });
    const color = reactive(new Color(props.value));
    watch(() => props.value, (newVal) => {
      if (newVal && newVal !== color.v) {
        color.format(newVal);
      }
    });
    const hueWidth = computed(() => props.width - 40);
    watch(
      () => color.v,
      () => {
        emit("update:value", color.v);
        props.change && props.change(color.v);
      }
    )
    function confirm() {
      emit("confirm");
      props.confirm && props.confirm(color.v);
    }
    function clear() {
      emit("clear");
      props.clear && props.clear();
    }
    onMounted(() => {
      nextTick(() => {
        const colorWidth = colorRef.value.offsetWidth;
        const colorHeight = colorRef.value.offsetHeight;
        if (style.value.left + colorWidth > windowWidth) {
          style.value.left = windowWidth - colorWidth;
        }
        if (style.value.top + colorHeight > windowHeight) {
          style.value.top = style.value.top - colorHeight;
        }
      })
    })

    return {
      colorRef,
      style,
      color,
      hueWidth,
      clear,
      confirm
    };
  },
});
</script>

<style>
.color-picker {
  position: fixed;
  border-radius: 5px;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.16);
  user-select: none;
  padding: 9px;
}

.color-tool {
  height: 50px;
  display: flex;
  align-items: center;
}

.color-picker-dark {
  background: #2e333a;
}

.color-picker-light {
  background: #f9f9f9;
  box-shadow: 1px #f9f9f9;
}

.color-btns {
  display: flex;
  justify-content: space-around;
}

.color-btn {
  display: inline-block;
  line-height: 1;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  transition: 0.1s;
  border-color: transparent;
  color: #409eff;
  background: transparent;
  font-size: 12px;
}
</style>
