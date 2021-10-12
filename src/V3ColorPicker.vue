<template>
  <div ref="colorRef" class="v3-c-p" :class="size ? `v3-c-p-${size}` : null" @click="onClick">
    <div class="c-p-t">
      <span class="c-p-c">
        <span class="c-p-c-i" :style="{ backgroundColor: isClear ? 'transparent' : color }"></span>
      </span>
      <span class="c-p-i">
        <svg v-if="!isClear" class="icon" viewBox="0 0 1024 1024">
          <path
            d="M511.711 671.589l-270.188-270.23c-0.287-0.264-0.573-0.531-0.851-0.809-10.935-10.935-10.935-28.663 0-39.598 10.935-10.935 28.663-10.935 39.598 0 0.278 0.278 0.545 0.564 0.809 0.851l0.021-0.021 230.691 230.69 231.94-231.94c10.935-10.935 28.663-10.935 39.598 0s10.935 28.663 0 39.598l-271.617 271.459z"
          />
        </svg>
        <svg v-else class="icon" viewBox="0 0 1024 1024">
          <path
            d="M704.28672 309.20704l28.95872 28.9792L334.6432 736.78848l-28.95872-28.9792z"
            fill="#999"
          />
          <path
            d="M341.03296 315.5968l398.60224 398.60224-28.95872 28.95872-398.60224-398.60224z"
            fill="#999"
          />
        </svg>
      </span>
    </div>
  </div>
  <Teleport to="body">
    <transition name="color-fade">
      <ColorPicker
        v-if="open"
        v-model:value="color"
        :zIndex="zIndex"
        :position="position"
        :theme="theme"
        :width="width"
        :height="height"
        :colors="colors"
        :btn="btn"
        @confirm="confirm"
        @clear="clear"
      />
    </transition>
  </Teleport>
</template>

<script>
import {
  nextTick,
  defineComponent,
  ref,
  watch
} from "vue";
import ColorPicker from "./component/ColorPicker.vue";

export default defineComponent({
  name: "V3ColorPicker",
  components: {
    ColorPicker
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
    size: {
      type: String,
    },
    btn: {
      type: Boolean,
      default: false
    },
  },
  emits: ["update:value", "change"],
  setup(props, { emit }) {
    const colorRef = ref(null);
    const position = ref({
      x: 0,
      y: 0
    });
    const isClear = ref(false);
    const color = ref(props.value);
    watch(color, (newVal) => {
      isClear.value = false;
      !props.btn && emit("update:value", newVal);
      emit("change", newVal);
    });
    watch(() => props.value, (newVal) => {
      if (newVal !== null || !props.btn) {
        isClear.value = false;
        color.value = props.value;
      }
      if (newVal === null) {
        isClear.value = true;
      }
    })
    const open = ref(false);
    function onClick(e) {
      open.value = false;
      nextTick(() => {
        position.value = {
          x: e.clientX,
          y: e.clientY
        };
        open.value = true;
      });
    }
    function close(event) {
      if (colorRef.value !== event.target) {
        open.value = false;
      }
    }
    function confirm() {
      emit("update:value", color.value);
      emit("change", color.value);
      open.value = false;
    }
    function clear() {
      emit("update:value", null);
      emit("change", null);
      isClear.value = true;
      open.value = false;
    }
    watch(open, (newVal) => {
      if (newVal) {
        globalThis.document.addEventListener("click", close);
        globalThis.document.addEventListener("contextmenu", close);
      } else {
        globalThis.document.removeEventListener("click", close);
        globalThis.document.removeEventListener("contextmenu", close);
      }
    })
    return {
      onClick,
      position,
      open,
      color,
      confirm,
      clear,
      isClear,
      colorRef
    };
  },
});
</script>

<style>
.v3-c-p {
  display: inline-block;
  position: relative;
  height: 40px;
  line-height: normal;
  cursor: pointer;
}

.v3-c-p-medium {
  height: 35px;
}

.v3-c-p.v3-c-p-medium .c-p-t {
  height: 35px;
  width: 35px;
  pointer-events: none;
}

.v3-c-p.v3-c-p-small {
  height: 30px;
}

.v3-c-p.v3-c-p-small .c-p-t {
  height: 30px;
  width: 30px;
  pointer-events: none;
}

.v3-c-p.v3-c-p-mini {
  height: 26px;
}

.v3-c-p.v3-c-p-mini .c-p-t {
  height: 26px;
  width: 26px;
  pointer-events: none;
}

.v3-c-p .c-p-t {
  display: inline-block;
  box-sizing: border-box;
  height: 40px;
  width: 40px;
  padding: 5px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  font-size: 0;
  position: relative;
  cursor: pointer;
  pointer-events: none;
}

.v3-c-p .c-p-c {
  position: relative;
  display: block;
  box-sizing: border-box;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
  border: 1px solid #909399;
  border-radius: 3px;
  width: 100%;
  height: 100%;
  text-align: center;
  pointer-events: none;
}

.v3-c-p .c-p-c-i {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.v3-c-p .c-p-i {
  display: inline-block;
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.c-p-i .icon {
  fill: #fff;
  width: 22px;
  height: 22px;
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
