<template>
  <Teleport to="body">
    <transition name="color-fade">
      <div
        v-if="open"
        class="color-picker"
        :class="`color-picker-${theme}`"
        :style="{ zIndex, top: `${top}px`, left: `${left}px` }"
      >
        <ColorPanel v-model:value="color" :hue="hue" :height="height" :width="width" />
        <div class="color-tool">
          <ColorStraw />
          <ColorPreview v-model:value="color" />
          <div>
            <ColorHue :width="hueWidth" v-model:hue="hue" v-model:value="color" />
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
  ref
} from "vue";

import ColorPanel from "./ColorPanel.vue";
import ColorStraw from "./ColorStraw.vue";
import ColorPreview from "./ColorPreview.vue";
import ColorHue from "./ColorHue.vue";
import ColorAlpha from "./ColorAlpha.vue";
import { StrToHex, getRgb } from "./utils";

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
      type: [String, Object],
      default: {
        r: 255,
        g: 255,
        b: 255,
        a: 1
      }
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









    const hue = ref(0);
    const color = computed({
      get: () => getRgb(StrToHex(props.value)),
      set: (val) => emit('update:value', `rgba(${val.r},${val.g},${val.b},${val.a})`)
    });
    const left = computed(() => {
      return props.event.clientX;
    });
    const top = computed(() => {
      return props.event.clientY;
    });
    const hueWidth = computed(() => props.width - 90)
    return {
      left,
      top,
      color,
      hueWidth,
      hue
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
