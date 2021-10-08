<template>
  <Teleport to="body">
    <transition name="color-fade">
      <div
        v-if="open"
        class="color-picker"
        :class="`color-picker-${theme}`"
        :style="{ zIndex, top: `${top}px`, left: `${left}px` }"
      >
        <ColorPanel />
      </div>
    </transition>
  </Teleport>
</template>

<script>
import {
  computed,
  defineComponent,
} from "vue";

import ColorPanel from './ColorPanel.vue'

export default defineComponent({
  name: "Vue3ColorPicker",
  components: {
    ColorPanel
  },
  props: {
    value: {
      type: String,
      default: "#ffffff"
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
    }
  },
  emits: ["update:value", "update:open"],
  setup(props) {
    const left = computed(() => {
      return props.event.clientX;
    });
    const top = computed(() => {
      return props.event.clientY;
    });
    return {
      left,
      top
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
