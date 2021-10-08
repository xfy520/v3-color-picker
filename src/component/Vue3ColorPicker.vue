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
          <Straw />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import {
  computed,
  defineComponent,
} from "vue";

import ColorPanel from "./ColorPanel.vue";
import Straw from "./Straw.vue";
import { StrToHex } from "./utils";

export default defineComponent({
  name: "Vue3ColorPicker",
  components: {
    ColorPanel,
    Straw
  },
  props: {
    value: {
      type: String,
      default: "rgb(255,255,255)"
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
      default: 210,
    },
  },
  emits: ["update:value", "update:open"],
  setup(props, { emit }) {
    const color = computed({
      get: () => StrToHex(props.value),
      set: (val) => emit('update:value', val)
    });
    const left = computed(() => {
      return props.event.clientX;
    });
    const top = computed(() => {
      return props.event.clientY;
    });
    return {
      left,
      top,
      color
    };
  },
});
</script>

<style>
.color-picker {
  position: fixed;
  border-radius: 0.3rem;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.16);
}

.color-tool {
  height: 3.9rem;
  background-color: red;
  line-height: 3.9rem;
}

.color-picker-dark {
  background: #1d1d25;
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
