<template>
  <div class="v3-c-p" :class="size ? `v3-c-p-${size}` : null" @click="onClick">
    <div class="c-p-t">
      <span class="c-p-c">
        <span class="c-p-c-i" :style="{ backgroundColor: color.v }"></span>
      </span>
      <span class="c-p-i">
        <svg class="icon" viewBox="0 0 1024 1024">
          <path
            d="M511.711 671.589l-270.188-270.23c-0.287-0.264-0.573-0.531-0.851-0.809-10.935-10.935-10.935-28.663 0-39.598 10.935-10.935 28.663-10.935 39.598 0 0.278 0.278 0.545 0.564 0.809 0.851l0.021-0.021 230.691 230.69 231.94-231.94c10.935-10.935 28.663-10.935 39.598 0s10.935 28.663 0 39.598l-271.617 271.459z"
          />
        </svg>
      </span>
    </div>
  </div>
  <Teleport to="body">
    <transition name="color-fade">
      <div
        v-if="open"
        class="color-picker"
        :class="`color-picker-${theme}`"
        :style="{ width: `${width}px`, zIndex, top: `${top}px`, left: `${left}px` }"
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
        <ColorValue v-model:value="color" :width="width" />
        <ColorList :colors="colors" v-model:value="color" />
      </div>
    </transition>
  </Teleport>
</template>

<script>
import {
  computed,
  defineComponent,
  reactive,
  watch,
  ref
} from "vue";

import ColorPanel from "./component/ColorPanel.vue";
import ColorStraw from "./component/ColorStraw.vue";
import ColorPreview from "./component/ColorPreview.vue";
import ColorHue from "./component/ColorHue.vue";
import ColorAlpha from "./component/ColorAlpha.vue";
import ColorValue from "./component/ColorValue.vue";
import ColorList from "./component/ColorList.vue";
import Color from "./color";

export default defineComponent({
  name: "Vue3ColorPicker",
  components: {
    ColorPanel,
    ColorStraw,
    ColorPreview,
    ColorHue,
    ColorAlpha,
    ColorValue,
    ColorList
  },
  props: {
    value: {
      type: String,
      default: "#fff"
    },
    size: {
      type: String,
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
    }
  },
  emits: ["update:value", "update:open"],
  setup(props, { emit }) {
    const event = ref(props.event || {});
    const open = ref(props.open);
    const left = computed(() => {
      return event.value.clientX || 0;
    });
    const top = computed(() => {
      return event.value.clientY || 0;
    });

    const color = reactive(new Color(props.value));

    watch(() => props.value, (newVal) => {
      if (newVal && newVal !== color.v) {
        color.format(newVal);
      }
    })

    function onClick(event) {
      console.log(event)
      event.value = event;
      open.value = true;
    }

    watch(
      () => color.v,
      () => { emit("update:value", color.v); }
    )
    const hueWidth = computed(() => props.width - 70);
    return {
      left,
      top,
      color,
      hueWidth,
      onClick,
      open
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
}

.v3-c-p-medium {
  height: 35px;
}

.v3-c-p.v3-c-p-medium .c-p-t {
  height: 35px;
  width: 35px;
}

.v3-c-p.v3-c-p-small {
  height: 30px;
}

.v3-c-p.v3-c-p-small .c-p-t {
  height: 30px;
  width: 30px;
}

.v3-c-p.v3-c-p-mini {
  height: 26px;
}

.v3-c-p.v3-c-p-mini .c-p-t {
  height: 26px;
  width: 26px;
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
}

.v3-c-p .c-p-c {
  position: relative;
  display: block;
  box-sizing: border-box;
  border: 1px solid #909399;
  border-radius: 3px;
  width: 100%;
  height: 100%;
  text-align: center;
}

.v3-c-p .c-p-c-i {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.v3-c-p .c-p-i {
  display: inline-block;
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.c-p-i .icon {
  fill: #fff;
  width: 22px;
  height: 22px;
}

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
