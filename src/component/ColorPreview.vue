<template>
  <div
    class="color-preview"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @mouseup="onMouseup"
    :style="{ backgroundColor: `rgb(${value.r},${value.g},${value.b})`, border: `1px solid rgb(${value.r},${value.g},${value.b})` }"
  >
    <svg width="25" height="25" v-show="copy" viewBox="0 0 1024 1024">
      <path
        fill="#f8f8f8"
        d="M679.827 780.524h-402.786v-469.916h402.786v469.916zM646.261 344.173h-335.655v402.786h335.655v-402.786zM411.304 243.476h-33.564v67.131h33.564v-67.131zM579.131 444.869h-201.394v33.564h201.394v-33.564zM579.131 545.564h-201.394v33.564h201.394v-33.564zM579.131 646.261h-201.394v33.564h201.394v-33.564zM746.959 243.476h-335.655v33.564h335.655v-33.564zM746.959 277.041h-33.564v402.786h33.564v-402.786zM713.394 646.261h-33.564v33.564h33.564v-33.564z"
      />
    </svg>
    <svg width="20" height="20" v-show="success" viewBox="0 0 1024 1024">
      <path fill="#f8f8f8" d="M870.4 332.8l-89.6-89.6L416 601.6 243.2 435.2l-89.6 89.6 262.4 256z" />
    </svg>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "ColorPreview",
  props: {
    value: {
      type: Object,
      default: {
        r: 255,
        g: 255,
        b: 255
      }
    }
  },
  setup() {
    const copy = ref(false);
    const success = ref(false);
    function onMouseenter() {
      copy.value = true;
    }
    function onMouseleave() {
      copy.value = false;
      success.value = false;
    }
    function onMouseup() {
      copy.value = false;
      success.value = true;
    }

    return {
      onMouseenter,
      onMouseleave,
      onMouseup,
      success,
      copy
    }
  }
})
</script>

<style>
.color-preview {
  display: flex;
  width: 32px;
  height: 32px;
  margin: 0 9px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.color-preview:hover {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(0, 0, 0, 0.3) !important;
}
</style>
