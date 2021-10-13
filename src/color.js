export default class Color {
  _h = 0;
  _s = 100;
  _v = 100;
  _a = 100;
  _f = "hex";
  v = "#fff";
  s = false;

  constructor (color) {
    if (color) {
      this._f = checkIsColor(wordToRgb(color));
      this.format(color);
    }
  }

  format(color, _f) {
    if (!color) {
      this._h = 0
      this._s = 100
      this._v = 100
      this.update();
    } else {
      const fromHsv = (h, s, v) => {
        this._h = Math.max(0, Math.min(360, h));
        this._s = Math.max(0, Math.min(100, s));
        this._v = Math.max(0, Math.min(100, v));
        this.update();
      }
      switch (checkIsColor(wordToRgb(color))) {
        case "hex":
          this._hex(color, fromHsv);
          break;
        case "rgb":
          this._rgba(color, fromHsv);
          break;
        case "hsl":
          this._hsla(color, fromHsv);
          break;
        default:
          throw Error(`非法颜色值--->${color}`);
      }
    }
  }

  _hsla(hsla, fromHsv) {
    hsla = strToArry(hsla, /hsla|hsl|\(|\)/gm);
    if (hsla.length === 4) {
      this._a = Math.floor(parseFloat(hsla[3]) * 100);
    } else if (hsla.length === 3) {
      this._a = 100;
    }
    if (hsla.length >= 3) {
      const { h, s, v } = hslToHsv(hsla[0], hsla[1], hsla[2]);
      fromHsv(h, s, v);
    }
  }

  _rgba(rgba, fromHsv) {
    rgba = strToArry(rgba, /rgba|rgb|\(|\)/gm);
    if (rgba.length === 4) {
      this._a = Math.floor(parseFloat(rgba[3]) * 100);
    } else if (rgba.length === 3) {
      this._a = 100;
    }
    if (rgba.length >= 3) {
      const { h, s, v } = rgbToHsv(rgba[0], rgba[1], rgba[2]);
      fromHsv(h, s, v);
    }
  }

  _hex(hex, fromHsv) {
    hex = hex.replace("#", "").trim();
    let { r, g, b } = hexToRgb(hex);
    if (hex.length === 8) {
      this._a = Math.floor(parseInt(hex.substring(6), 16) / 255 * 100);
    } else if (hex.length === 3 || hex.length === 6) {
      this._a = 100;
    }
    const { h, s, v } = rgbToHsv(r, g, b);
    fromHsv(h, s, v);
  }

  set(k, v) {
    this[`_${k}`] = v;
    this.update();
  }

  get(k) {
    return this[`_${k}`];
  }

  update() {
    const { _h, _s, _v, _a, _f } = this;
    switch (_f) {
      case "rgb": {
        const { r, g, b } = hsvToRgb(_h, _s, _v);
        this.v = _a === 100 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${_a / 100})`;
        break;
      }
      case "hsl": {
        const hsl = hsvToHsl(_h, _s / 100, _v / 100);
        this.v = _a === 100 ? `hsl(${Math.round(_h)}, ${Math.round(hsl[0] * 100)}%, ${Math.round(hsl[1] * 100)}%)` :
          `hsla(${Math.round(_h)}, ${Math.round(hsl[0] * 100)}%, ${Math.round(hsl[1] * 100)}%, ${_a / 100})`;
        break;
      }
      default: {
        const hex = rgbToHex(hsvToRgb(_h, _s, _v));
        const alpha = Math.round(this._a / 100 * 255);
        this.v = _a === 100 ? hex : `${hex}${alpha <= 16 ? "0" : ""}${alpha.toString(16)}`;
        break;
      }
    }
  }

  get hsla() {
    const { _h, _s, _v, _a } = this;
    const hsl = hsvToHsl(_h, _s / 100, _v / 100);
    return {
      h: Math.round(_h), s: Math.round(hsl[0] * 100), l: Math.round(hsl[1] * 100), a: _a / 100
    }
  }

  get rgba() {
    const { _h, _s, _v, _a } = this;
    const { r, g, b } = hsvToRgb(_h, _s, _v);
    return {
      r, g, b, a: _a / 100
    };
  }

  get hex() {
    const { _h, _s, _v, _a } = this;
    const hex = rgbToHex(hsvToRgb(_h, _s, _v));
    const alpha = Math.round(this._a / 100 * 255);
    return _a === 100 ? hex : `${hex}${alpha <= 16 ? "0" : ""}${alpha.toString(16)}`;
  }
}

function strToArry(color, reg) {
  return color
    .replace(reg, "")
    .split(/\s|,/g)
    .filter((v) => v !== "")
    .map((v, i) => (i > 2 ? parseFloat(v) : parseInt(v, 10)))
}

const hsvToHsl = function (h, s, v) {
  return [(s * v) / ((h = (2 - s) * v) < 1 ? h : 2 - h) || 0, h / 2];
}

function hslToHsv(h, s, l) {
  s = s / 100;
  l = l / 100;
  let smin = s;
  const lmin = Math.max(l, 0.01);
  l *= 2;
  s *= l <= 1 ? l : 2 - l
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  const v = (l + s) / 2;
  const sv = s === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);
  return {
    h,
    s: sv * 100,
    v: v * 100,
  }
}

function hsvToRgb(h, s, v) {
  h = limit(h, 360) * 6;
  s = limit(s, 100);
  v = limit(v, 100);
  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

function rgbToHsv(r, g, b) {
  r = limit(r, 255);
  g = limit(g, 255);
  b = limit(b, 255);
  const v = Math.max(r, g, b);
  let h, s;
  const diff = v - Math.min(r, g, b);
  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;
    const diffc = function (c) {
      return (v - c) / 6 / diff + 1 / 2;
    };
    switch (v) {
      case r: {
        h = diffc(b) - diffc(g);
        break
      }
      case g: {
        h = (1 / 3) + diffc(r) - diffc(b);
        break
      }
      case b: {
        h = (2 / 3) + diffc(g) - diffc(r);
        break
      }
    }
    h < 0 ? h += 1 : h > 1 ? h -= 1 : h;
  }
  return { h: h * 360, s: s * 100, v: v * 100 }
}

function limit(v, max) {
  v = typeof v === "string" && v.indexOf('.') !== -1 && parseFloat(v) === 1 ? "100%" : v;
  v = Math.min(max, Math.max(0, parseFloat(`${v}`)))
  v = typeof n === "string" && n.indexOf('%') !== -1 ? parseInt(`${v * (max)}`, 10) / 100 : v;
  return Math.abs(v - (max)) < 0.000001 ? 1 : (v % (max)) / parseFloat(max);
}

function hexToRgb(hex) {
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hex)) {
    throw Error(`非法颜色值--->${hex}`);
  }
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  return {
    r, g, b
  };
}

function rgbToHex({ r, g, b }) {
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return (isNaN(r) || isNaN(g) || isNaN(b)) ? "" : `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
}

function checkIsColor(color) {
  if (/^#/.test(color)) {
    return "hex";
  } else if (/^rgb\(/.test(color) || /^rgba\(/.test(color)) {
    return "rgb";
  } else if (/^hsl\(/.test(color) || /^hsla\(/.test(color)) {
    return "hsl";
  }
  throw Error(`错误的颜色参数--->${color}`);
}

function wordToRgb(color) {
  const colors = {
    red: "rgba(255, 0, 0, 1)",
    green: "rgba(0, 128, 0, 1)",
    blue: "rgba(0, 0, 255, 1)",
    magenta: "rgba(255, 0, 255, 1)",
    yellow: "rgba(255, 255, 0, 1)",
    chocolate: "rgba(210, 105, 30, 1)",
    black: "rgba(0, 0, 0, 1)",
    aquamarine: "rgba(127, 255, 212, 1)",
    lime: "rgba(0, 255, 0, 1)",
    fuchsia: "rgba(255, 0, 255, 1)",
    brass: "rgba(176, 160, 0, 1)",
    azure: "rgba(240, 255, 255, 1)",
    brown: "rgba(255, 127, 80, 1)",
    bronze: "rgba(254, 208, 160, 1)",
    deeppink: "rgba(255, 20, 147, 1)",
    aliceblue: "rgba(240, 248, 255, 1)",
    gray: "rgba(128, 128, 128, 1)",
    copper: "rgba(192, 0, 224, 1)",
    coral: "rgba(255, 127, 80, 1)",
    feldspar: "rgba(254, 208, 160, 1)",
    orange: "rgba(255, 165, 0, 1)",
    orchid: "rgba(255, 165, 0, 1)",
    pink: "rgba(255, 165, 0, 1)",
    plum: "rgba(221, 160, 221, 1)",
    quartz: "rgba(0, 160, 0, 1)",
    purple: "rgba(128, 0, 128, 1)",
    aliceblue: "rgba(240, 248, 255, 1)",
    antiquewith: "rgba(160, 0, 0, 1)",
    blanchedalmond: "rgba(255, 235, 205, 1)",
    blueviolet: "rgba(138, 43, 226, 1)",
    beige: "rgba(245, 245, 220, 1)",
    burlywood: "rgba(222, 184, 135, 1)",
    bisque: "rgba(255, 228, 196, 1)",
    cadetblue: "rgba(95, 158, 160, 1)",
    pink: "rgba(255, 192, 203, 1)",
    saddlebrown: "rgba(139, 69, 19, 1)",
    royalblue: "rgba(65, 105, 225, 1)",
    rosybrown: "rgba(188, 143, 143, 1)",
    purple: "rgba(128, 0, 128, 1)",
    orengered: "rgba(14, 14, 237, 1)",
    olivedrab: "rgba(107, 142, 35, 1)",
    powderblue: "rgba(176, 224, 230, 1)",
    peachpuff: "rgba(255, 218, 185, 1)",
    papayawhip: "rgba(255, 239, 213, 1)",
    paleturquoise: "rgba(175, 238, 238, 1)",
    palevioletred: "rgba(219, 112, 147, 1)",
    palegreen: "rgba(152, 251, 152, 1)",
    navyblue: "rgba(160, 176, 224, 1)",
    navajowhite: "rgba(255, 222, 173, 1)",
    palegodenrod: "rgba(160, 13, 0, 1)",
    violetred: "rgba(0, 224, 237, 1)",
    yellowgreen: "rgba(154, 205, 50, 1)",
    tomato: "rgba(255, 99, 71, 1)",
    turquoise: "rgba(64, 224, 208, 1)",
    thistle: "rgba(216, 191, 216, 1)",
    springgreen: "rgba(0, 255, 127, 1)",
    steelblue: "rgba(70, 130, 180, 1)",
    salmon: "rgba(250, 128, 114, 1)",
    scarlet: "rgba(202, 14, 0, 1)",
    sienna: "rgba(160, 82, 45, 1)",
    silver: "rgba(192, 192, 192, 1)",
    tan: "rgba(210, 180, 140, 1)",
    thistle: "rgba(216, 191, 216, 1)",
    turquoise: "rgba(64, 224, 208, 1)",
    violet: "rgba(238, 130, 238, 1)",
    snow: "rgba(255, 250, 250, 1)",
    salmon: "rgba(250, 128, 114, 1)",
    scarlet: "rgba(202, 14, 0, 1)",
    sienna: "rgba(160, 82, 45, 1)",
    silver: "rgba(192, 192, 192, 1)",
    thistle: "rgba(216, 191, 216, 1)",
    turquoise: "rgba(64, 224, 208, 1)",
    violet: "rgba(238, 130, 238, 1)",
    chartreuse: "rgba(127, 255, 0, 1)",
    firebrick: "rgba(178, 34, 34, 1)",
    gold: "rgba(255, 215, 0, 1)",
    khaki: "rgba(240, 230, 140, 1)",
    mediumslateblue: "rgba(123, 104, 238, 1)",
    mediumvioletred: "rgba(199, 21, 133, 1)",
    oldlace: "rgba(253, 245, 230, 1)",
    maroom: "rgba(10, 0, 0, 1)",
    goldenrod: "rgba(218, 165, 32, 1)",
    wheat: "rgba(245, 222, 179, 1)",
    whitesmoke: "rgba(245, 245, 245, 1)",
    orange: "rgba(255, 165, 0, 1)",
    moccasin: "rgba(255, 228, 181, 1)",
    mistyrose: "rgba(255, 228, 225, 1)",
    mintcream: "rgba(245, 255, 250, 1)",
    midnightblue: "rgba(25, 25, 112, 1)",
    dimgray: "rgba(105, 105, 105, 1)",
    darksalmon: "rgba(233, 150, 122, 1)",
    slategray: "rgba(112, 128, 144, 1)",
    skyblue: "rgba(135, 206, 235, 1)",
    sienna: "rgba(160, 82, 45, 1)",
    seashell: "rgba(255, 245, 238, 1)",
    salmon: "rgba(250, 128, 114, 1)",
    seagreen: "rgba(46, 139, 87, 1)",
    sandybrown: "rgba(244, 164, 96, 1)",
    firebrick: "rgba(178, 34, 34, 1)",
    gold: "rgba(255, 215, 0, 1)",
    khaki: "rgba(240, 230, 140, 1)",
    maroom: "rgba(10, 0, 0, 1)",
    goldenrod: "rgba(218, 165, 32, 1)",
    wheat: "rgba(245, 222, 179, 1)",
    whitesmoke: "rgba(245, 245, 245, 1)",
    mediumturquoise: "rgba(72, 209, 204, 1)",
    navy: "rgba(0, 0, 128, 1)",
    mediumspringgreen: "rgba(0, 250, 154, 1)",
    mediumseagreen: "rgba(60, 179, 113, 1)",
    mediumpurpul: "rgba(237, 0, 0, 1)",
    peru: "rgba(205, 133, 63, 1)",
    mediumorchid: "rgba(186, 85, 211, 1)",
    mediumblue: "rgba(0, 0, 205, 1)",
    mediumaquamarine: "rgba(102, 205, 170, 1)",
    maroon: "rgba(128, 0, 0, 1)",
    limegreen: "rgba(50, 205, 50, 1)",
    lightyellow: "rgba(255, 255, 224, 1)",
    lightsteelblue: "rgba(176, 196, 222, 1)",
    magenta: "rgba(255, 0, 255, 1)",
    lightslateblue: "rgba(0, 0, 176, 1)",
    lightslategray: "rgba(119, 136, 153, 1)",
    lightskyblue: "rgba(135, 206, 250, 1)",
    inen: "rgba(0, 224, 0, 1)",
    lightseagreen: "rgba(32, 178, 170, 1)",
    lightsalmon: "rgba(255, 160, 122, 1)",
    lightpink: "rgba(255, 182, 193, 1)",
    plum: "rgba(221, 160, 221, 1)",
    lightgray: "rgba(0, 0, 160, 1)",
    lightgreen: "rgba(144, 238, 144, 1)",
    lightgodenrodyellow: "rgba(0, 222, 224, 1)",
    indianred: "rgba(205, 92, 92, 1)",
    lavender: "rgba(230, 230, 250, 1)",
    lightblue: "rgba(173, 216, 230, 1)",
    lavenderblush: "rgba(255, 240, 245, 1)",
    lightcoral: "rgba(240, 128, 128, 1)",
    lightcyan: "rgba(224, 255, 255, 1)",
    lightgodenrod: "rgba(0, 222, 208, 1)",
    hotpink: "rgba(255, 105, 180, 1)",
    greenyellow: "rgba(173, 255, 47, 1)",
    lemonchiffon: "rgba(255, 250, 205, 1)",
    lawngreen: "rgba(124, 252, 0, 1)",
    khaki: "rgba(240, 230, 140, 1)",
    deepskyblue: "rgba(0, 191, 255, 1)",
    honeydew: "rgba(240, 255, 240, 1)",
    golenrod: "rgba(0, 224, 13, 1)",
    forestgreen: "rgba(34, 139, 34, 1)",
    gostwhite: "rgba(0, 0, 14, 1)",
    greenyellow: "rgba(173, 255, 47, 1)",
    gainsboro: "rgba(220, 220, 220, 1)",
    firebrick: "rgba(178, 34, 34, 1)",
    dodgerblue: "rgba(30, 144, 255, 1)",
    darkturquoise: "rgba(0, 206, 209, 1)",
    darkslateblue: "rgba(72, 61, 139, 1)",
    darkslategray: "rgba(47, 79, 79, 1)",
    darkseagreen: "rgba(143, 188, 143, 1)",
    darkred: "rgba(139, 0, 0, 1)",
    darkorchid: "rgba(153, 50, 204, 1)",
    darkorenge: "rgba(218, 0, 14, 1)",
    darkslateblue: "rgba(72, 61, 139, 1)",
    darkviolet: "rgba(148, 0, 211, 1)",
    floralwhite: "rgba(255, 250, 240, 1)",
    cyan: "rgba(0, 255, 255, 1)",
    'bisque darkgray': "rgba(255, 228, 196, 1)",
    cornsilk: "rgba(255, 248, 220, 1)",
    darkolivegreen: "rgba(255, 248, 220, 1)",
    darkgoldenrod: "rgba(184, 134, 11, 1)",
    darkblue: "rgba(0, 0, 139, 1)",
    darkcyan: "rgba(0, 139, 139, 1)",
    darkgreen: "rgba(0, 100, 0, 1)",
    darkhaki: "rgba(218, 0, 0, 1)",
    ivory: "rgba(255, 255, 240, 1)",
    darkmagenta: "rgba(139, 0, 139, 1)",
    darkgray: "rgba(169, 169, 169, 1)",
    cornfloewrblue: "rgba(192, 0, 176, 1)",
    cornfloewrblue: "rgba(192, 0, 176, 1)",
    darkviolet: "rgba(148, 0, 211, 1)",
    floralwhite: "rgba(255, 250, 240, 1)",
    darkslategray: "rgba(47, 79, 79, 1)",
    darkseagreen: "rgba(143, 188, 143, 1)",
    darkred: "rgba(139, 0, 0, 1)",
    darkorchid: "rgba(153, 50, 204, 1)",
    darkorenge: "rgba(218, 0, 14, 1)",
    darkslateblue: "rgba(72, 61, 139, 1)",
  }
  if (colors[color]) {
    color = colors[color];
  }
  return color;
}
