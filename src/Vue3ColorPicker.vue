<template>
  <Teleport to="body">
    <transition name="color-fade">
      <div
        v-if="open"
        class="color-picker"
        :class="`color-picker-${theme}`"
        :style="{ zIndex, top: `${top}px`, left: `${left}px` }"
      >
        <ColorPanel v-model:value="color" :height="height" :width="width" />
        <div class="color-tool">
          <ColorStraw />
          <ColorPreview v-model:value="color" />
          <div>
            <ColorHue :width="hueWidth" v-model:value="color" />
            <ColorAlpha :width="hueWidth" v-model:value="color" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import {
  computed,
  defineComponent,
  reactive,
  watch
} from "vue";

import ColorPanel from "./component/ColorPanel.vue";
import ColorStraw from "./component/ColorStraw.vue";
import ColorPreview from "./component/ColorPreview.vue";
import ColorHue from "./component/ColorHue.vue";
import ColorAlpha from "./component/ColorAlpha.vue";
import Color from "./color";

export default defineComponent({
  name: "Vue3ColorPicker",
  components: {
    ColorPanel,
    ColorStraw,
    ColorPreview,
    ColorHue,
    ColorAlpha
  },
  props: {
    value: {
      type: String,
      default: "#fff"
    },
    open: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 2
    },
    event: {
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
      default: 230,
    },
  },
  emits: ["update:value", "update:open"],
  setup(props, { emit }) {
    const color = reactive(new Color(props.value));
    const left = computed(() => {
      return props.event.clientX;
    });
    const top = computed(() => {
      return props.event.clientY;
    });
    watch(() => props.value, (newVal) => {
      if (newVal && newVal !== color.v) {
        color.format(newVal);
      }
    })
    watch(
      () => color.v,
      () => { emit("update:value", color.v); }
    )
    const hueWidth = computed(() => props.width - 90);
    return {
      left,
      top,
      color,
      hueWidth,
    };
  },
});
</script>

<style>
.color-picker {
  position: fixed;
  border-radius: 5px;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.16);
}

.color-tool {
  height: 50px;
  display: flex;
  padding: 0 9px;
  align-items: center;
}

.color-picker-dark {
  background: #2e333a;
}

.color-picker-light {
  background: #f8f8f8;
}

.color-fade-enter-active,
.color-fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.color-fade-enter-from,
.color-fade-leave-to {
  opacity: 0;
}
</style>
