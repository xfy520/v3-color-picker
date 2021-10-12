<template>
  <div class="color-value">
    <div :style="{ width: `${valueWidth}px` }">
      <div v-if="format === 'hex'">
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onHexInput"
          v-model="hexValue"
        />
      </div>
      <div v-else-if="format === 'rgb'">
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onRgbaInput"
          v-model="rgbaValue.r"
        />
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onRgbaInput"
          v-model="rgbaValue.g"
        />
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onRgbaInput"
          v-model="rgbaValue.b"
        />
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onRgbaInput"
          v-model="rgbaValue.a"
        />
      </div>
      <div v-else>
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onHslaInput"
          v-model="hslaValue.h"
        />
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onHslaInput"
          v-model="hslaValue.s"
        />
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onHslaInput"
          v-model="hslaValue.l"
        />
        <input
          type="text"
          :style="{ width: `${inputWidth}px` }"
          @input="onHslaInput"
          v-model="hslaValue.a"
        />
      </div>
      <div v-if="format === 'hex'">
        <span>十六进制</span>
      </div>
      <div v-else>
        <span>{{ format === "rgb" ? "R" : "H" }}</span>
        <span>{{ format === "rgb" ? "G" : "S %" }}</span>
        <span>{{ format === "rgb" ? "B" : "L %" }}</span>
        <span>A</span>
      </div>
    </div>
    <svg class="icon" viewBox="0 0 1024 1024" @click.stop="onClick">
      <path
        d="M718.73545078 589.39849389H305.26454922c-20.36802471 0-32.58883953 13.23921607-22.40482717 23.42322842 15.27601854 16.29441978 197.56983966 206.73545078 206.73545077 215.90106188 11.20241359 12.22081482 35.64404324 10.18401235 45.8280556 0C542.55203706 821.59397555 729.93786436 624.02413589 741.14027795 612.82172231c10.18401235-11.20241359-3.05520371-22.40482718-22.40482718-23.42322842zM305.26454922 434.60150611h413.47090156c19.34962348 0 32.58883953-12.22081482 22.40482717-23.42322842-11.20241359-11.20241359-198.5882409-208.77225325-206.73545077-216.91946312-9.16561112-10.18401235-33.60724077-11.20241359-45.8280556 0C480.42956171 204.44282693 298.13574057 394.88385793 282.85972205 411.17827769c-10.18401235 10.18401235 2.03680247 23.42322842 22.40482718 23.42322842z"
      />
    </svg>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";

const formatList = ["hex", "rgb", "hsl"];

export default defineComponent({
  name: "ColorValue",
  props: {
    value: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 230,
    },
  },
  setup(props) {
    const format = computed(() => props.value.get("f"));
    const formatIndex = ref(formatList.indexOf(format.value));
    const valueWidth = computed(() => props.width - 21);
    const inputWidth = computed(() => (format.value === "hex" ? valueWidth.value - 15 : valueWidth.value / 4) - 15);

    const hexValue = ref(props.value.hex);
    const rgbaValue = ref(props.value.rgba);
    const hslaValue = ref(props.value.hsla);
    function onClick() {
      formatIndex.value = (formatIndex.value + 1) % 3;
      props.value.set("f", formatList[formatIndex.value]);
    }

    function onHexInput() {
      if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hexValue.value.replace("#", "").trim())) {
        return;
      }
      props.value.format(hexValue.value);
    }

    function onRgbaInput() {
      const n = rgbaValue.value;
      const isNull = n.r === "" || n.g === "" || n.b === "" || n.a === "";
      const isNumber = !isNaN(n.r) && !isNaN(n.g) && !isNaN(n.b) && !isNaN(n.a);
      if (isNull || !isNumber) {
        return;
      }
      let r = Math.max(parseInt(n.r), 0);
      r = Math.min(r, 255);
      let g = Math.max(parseInt(n.g), 0);
      g = Math.min(g, 255);
      let b = Math.max(parseInt(n.b), 0);
      b = Math.min(b, 255);
      let a = Math.max(parseFloat(n.a), 0);
      a = Math.min(a, 1);
      props.value.format(`rgba(${r},${g},${b},${a})`);
    }

    function onHslaInput() {
      const n = hslaValue.value;
      const isNull = n.h === "" || n.s === "" || n.l === "" || n.a === "";
      const isNumber = !isNaN(n.h) && !isNaN(n.s) && !isNaN(n.l) && !isNaN(n.a);
      if (isNull || !isNumber) {
        return;
      }
      let h = Math.max(parseInt(n.h), 0);
      h = Math.min(h, 360);
      let s = Math.max(parseInt(n.s), 0);
      s = Math.min(s, 100);
      let l = Math.max(parseInt(n.l), 0);
      l = Math.min(l, 100);
      let a = Math.max(parseFloat(n.a), 0);
      a = Math.min(a, 1);
      props.value.format(`hsla(${h},${s},${l},${a})`)
    }

    watch(() => props.value.v, () => {
      if (format.value === "hex") {
        hexValue.value = props.value.hex;
      }
      if (format.value === "rgb") {
        rgbaValue.value = props.value.rgba;
      }
      if (format.value === "hsl") {
        hslaValue.value = props.value.hsla;
      }
    })

    return {
      format,
      valueWidth,
      inputWidth,
      hexValue,
      onHexInput,
      rgbaValue,
      onRgbaInput,
      hslaValue,
      onHslaInput,
      onClick
    }
  }
})
</script>

<style>
.color-value {
  padding: 3px 0;
  display: flex;
}

.color-value > div > div:first-child,
.color-value > div > div:last-child {
  display: flex;
  justify-content: space-around;
}

.color-value > div input {
  font-size: 12px;
  height: 15px;
  line-height: 15px;
  text-align: center;
}

.color-value > div > div:last-child > span {
  margin-top: 3px;
  font-size: 12px;
  color: #fff;
}

.color-value .icon {
  margin-top: -2px;
  fill: #eee;
  width: 21px;
  height: 21px;
  cursor: pointer;
}

.color-value .icon:hover {
  fill: #1593ff;
}

.color-value > div input:focus {
  outline: none;
}

.color-picker-light .color-value .icon {
  fill: #555;
}

.color-picker-light .color-value > div > div:last-child > span {
  color: #555;
}
</style>
