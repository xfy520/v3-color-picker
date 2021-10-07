<template>
  <Teleport to="body">
    <transition name="color-fade">
      <div v-if="open" class="color-picker" :style="{ ZIndex: zIndex }"></div>
    </transition>
  </Teleport>
</template>

<script>
import {
  defineComponent,
} from "vue";

export default defineComponent({
  name: "Vue3ColorPicker",
  props: {
    modelValue: {
      type: String,
      default: "#000000"
    },
    open: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 2
    },
    position: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'update:open'],
  setup(props) {
    return {};
  },
});
</script>

<style>
.color-picker {
  padding: 0.6rem;
  background: #1d2024;
  border-radius: 0.3rem;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
}

.color-fade-enter-active,
.color-fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.color-fade-enter-from,
.color-fade-leave-to {
  opacity: 0;
}
</style>
