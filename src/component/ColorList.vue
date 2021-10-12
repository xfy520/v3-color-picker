<template>
  <div class="color-list">
    <div
      class="color"
      :style="{ width: `${height}px`, height: `${height}px` }"
      v-for="(color, index) in rgbaColors"
      :key="index"
      @click="handleSelect(index)"
    >
      <div :class="{ 'is-selected': color.s, 'is-alpha': color._a < 100 }">
        <div :style="{ width: `${height}px`, height: `${height}px`, backgroundColor: color.v }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";
import Color from "../color";

const height = 18;

export default defineComponent({
  name: "ColorList",
  props: {
    value: {
      type: Object,
      required: true
    },
    colors: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const rgbaColors = computed(() => {
      return props.colors.map((v) => {
        const c = new Color(v);
        c.s = c.hex === props.value.hex;
        return c;
      });
    });
    function handleSelect(index) {
      props.value.format(props.colors[index]);
    }
    return {
      rgbaColors,
      height,
      handleSelect
    }
  }
})
</script>

<style>
.color-list {
  margin: 9px 0;
  padding: 0 9px;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  justify-content: space-around;
}

.color-list .color {
  padding: 5px;
  border-radius: 10px;
  cursor: pointer;
}

.color-list .color:hover {
  transform: scale(1.2);
}

.color-list .color .is-alpha {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}

.color-list .color .is-selected {
  box-shadow: 0 0 3px 2px #409eff;
}
</style>
