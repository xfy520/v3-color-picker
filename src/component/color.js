import { hasOwn } from "@vue/shared";

import { HsvToRgb } from "./utils";

export default class Color {
  _h = 0;
  _s = 100;
  _v = 100;
  _a = 1;
  enableAlpha = true;
  color = {
    r: 255,
    g: 255,
    b: 255,
    a: 1
  };

  constructor(opts) {
    opts = opts || {};
    for (const opt in opts) {
      if (hasOwn(opts, opt)) {
        this[opt] = opts[opt]
      }
    }
    this.update();
  }

  set(k, v) {
    this[`_${k}`] = v;
    this.update()
  }

  get(k) {
    return this[`_${k}`]
  }

  update() {
    const { _h, _s, _v, _a } = this;
    const { r, g, b } = HsvToRgb(_h, _s, _v);
    this.value = {
      r, g, b, a: _a
    }
  }
}
