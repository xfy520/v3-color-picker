<template>
  <div
    class="color-preview"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @mouseup="onMouseup"
  >
    <div :style="{ background }">
      <svg width="25" height="25" v-show="copy" viewBox="0 0 1024 1024">
        <path
          fill="#f8f8f8"
          d="M679.827 780.524h-402.786v-469.916h402.786v469.916zM646.261 344.173h-335.655v402.786h335.655v-402.786zM411.304 243.476h-33.564v67.131h33.564v-67.131zM579.131 444.869h-201.394v33.564h201.394v-33.564zM579.131 545.564h-201.394v33.564h201.394v-33.564zM579.131 646.261h-201.394v33.564h201.394v-33.564zM746.959 243.476h-335.655v33.564h335.655v-33.564zM746.959 277.041h-33.564v402.786h33.564v-402.786zM713.394 646.261h-33.564v33.564h33.564v-33.564z"
        />
      </svg>
      <svg width="20" height="20" v-show="success" viewBox="0 0 1024 1024">
        <path
          fill="#f8f8f8"
          d="M870.4 332.8l-89.6-89.6L416 601.6 243.2 435.2l-89.6 89.6 262.4 256z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
export default defineComponent({
  name: "ColorPreview",
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const copy = ref(false);
    const success = ref(false);
    const background = computed(() => `rgba(${props.value.rgba.r},${props.value.rgba.g},${props.value.rgba.b},${props.value.rgba.a})`);
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
      copy,
      background,
    }
  }
})
</script>

<style>
.color-preview {
  width: 32px;
  height: 32px;
  margin-right: 9px;
  border-radius: 50%;
  box-sizing: border-box;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
  cursor: pointer;
}

.color-preview:hover {
  background: transparent;
}

.color-preview > div {
  position: relative;
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
}

.color-preview > div:hover {
  background: rgba(0, 0, 0, 0.3) !important;
}
</style>
