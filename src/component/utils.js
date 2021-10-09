export function createLinearGradient(ctx, layout, width, height, color1, color2) {
  const grd = ctx.createLinearGradient(0, 0, layout === 'h' ? width : 0, layout === 'h' ? 0 : height);
  grd.addColorStop(0.01, color1);
  grd.addColorStop(0.99, color2);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);
}

export function HsvToRgb(h, s, v) {
  let i, f, p1, p2, p3;
  let r = 0, g = 0, b = 0;
  if (s < 0) s = 0;
  if (s > 1) s = 1;
  if (v < 0) v = 0;
  if (v > 1) v = 1;
  h %= 360;
  if (h < 0) h += 360;
  h /= 60;
  i = Math.floor(h);
  f = h - i;
  p1 = v * (1 - s);
  p2 = v * (1 - s * f);
  p3 = v * (1 - s * (1 - f));
  switch (i) {
    case 0: r = v; g = p3; b = p1; break;
    case 1: r = p2; g = v; b = p1; break;
    case 2: r = p1; g = v; b = p3; break;
    case 3: r = p1; g = p2; b = v; break;
    case 4: r = p3; g = p1; b = v; break;
    case 5: r = v; g = p1; b = p2; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

export function RgbToHsv({ r, g, b }) {
  let rr, gg, bb;
  r = parseInt(r) / 255;
  g = parseInt(g) / 255;
  b = parseInt(b) / 255;
  let h, s,
    v = Math.max(r, g, b),
    diff = v - Math.min(r, g, b),
    diffc = function (c) {
      return (v - c) / 6 / diff + 1 / 2;
    };
  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v; rr = diffc(r); gg = diffc(g); bb = diffc(b);
    if (r === v) {
      h = bb - gg;
    } else if (g === v) {
      h = (1 / 3) + rr - bb;
    } else if (b === v) {
      h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

export function RgbToHex(rgb) {
  if (rgb.indexOf("#") != -1) {
    return rgb;
  }
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  let hex = (1 << 24) + r * (1 << 16) + g * (1 << 8) + b;
  hex = hex.toString(16);
  return '#' + hex.slice(1);
}

export function HexToRgb(hex) {
  let hexNum = hex.substring(1);
  hexNum = '0x' + (hexNum.length < 6 ? repeatLetter(hexNum, 2) : hexNum);
  let r = hexNum >> 16;
  let g = hexNum >> 8 & '0xff';
  let b = hexNum & '0xff';
  return {
    r, g, b
  };

  function repeatWord(word, num) {
    let result = '';
    for (let i = 0; i < num; i++) {
      result += word;
    }
    return result;
  }
  function repeatLetter(word, num) {
    let result = '';
    for (let letter of word) {
      result += repeatWord(letter, num);
    }
    return result;
  }
}

export function getRgb(val) {
  if (typeof val === 'string') {
    if (val.indexOf('#') !== -1) {
      return HexToRgb(val);
    }
    let arr = val.split(',');
    return {
      r: +arr[0].split('(')[1],
      g: +arr[1],
      b: +arr[2].split(')')[0],
    }
  }
  return val;
}

export function StrToHex(key) {
  const colors = {
    red: 'rgb(255, 0, 0)',
    green: 'rgb(0, 128, 0)',
    blue: 'rgb(0, 0, 255)',
    magenta: 'rgb(255, 0, 255)',
    yellow: 'rgb(255, 255, 0)',
    chocolate: 'rgb(210, 105, 30)',
    black: 'rgb(0, 0, 0)',
    aquamarine: 'rgb(127, 255, 212)',
    lime: 'rgb(0, 255, 0)',
    fuchsia: 'rgb(255, 0, 255)',
    brass: 'rgb(176, 160, 0)',
    azure: 'rgb(240, 255, 255)',
    brown: 'rgb(255, 127, 80)',
    bronze: 'rgb(254, 208, 160)',
    deeppink: 'rgb(255, 20, 147)',
    aliceblue: 'rgb(240, 248, 255)',
    gray: 'rgb(128, 128, 128)',
    copper: 'rgb(192, 0, 224)',
    coral: 'rgb(255, 127, 80)',
    feldspar: 'rgb(254, 208, 160)',
    orange: 'rgb(255, 165, 0)',
    orchid: 'rgb(255, 165, 0)',
    pink: 'rgb(255, 165, 0)',
    plum: 'rgb(221, 160, 221)',
    quartz: 'rgb(0, 160, 0)',
    purple: 'rgb(128, 0, 128)',
    aliceblue: 'rgb(240, 248, 255)',
    antiquewith: 'rgb(160, 0, 0)',
    blanchedalmond: 'rgb(255, 235, 205)',
    blueviolet: 'rgb(138, 43, 226)',
    beige: 'rgb(245, 245, 220)',
    burlywood: 'rgb(222, 184, 135)',
    bisque: 'rgb(255, 228, 196)',
    cadetblue: 'rgb(95, 158, 160)',
    pink: 'rgb(255, 192, 203)',
    saddlebrown: 'rgb(139, 69, 19)',
    royalblue: 'rgb(65, 105, 225)',
    rosybrown: 'rgb(188, 143, 143)',
    purple: 'rgb(128, 0, 128)',
    orengered: 'rgb(14, 14, 237)',
    olivedrab: 'rgb(107, 142, 35)',
    powderblue: 'rgb(176, 224, 230)',
    peachpuff: 'rgb(255, 218, 185)',
    papayawhip: 'rgb(255, 239, 213)',
    paleturquoise: 'rgb(175, 238, 238)',
    palevioletred: 'rgb(219, 112, 147)',
    palegreen: 'rgb(152, 251, 152)',
    navyblue: 'rgb(160, 176, 224)',
    navajowhite: 'rgb(255, 222, 173)',
    palegodenrod: 'rgb(160, 13, 0)',
    violetred: 'rgb(0, 224, 237)',
    yellowgreen: 'rgb(154, 205, 50)',
    tomato: 'rgb(255, 99, 71)',
    turquoise: 'rgb(64, 224, 208)',
    thistle: 'rgb(216, 191, 216)',
    springgreen: 'rgb(0, 255, 127)',
    steelblue: 'rgb(70, 130, 180)',
    salmon: 'rgb(250, 128, 114)',
    scarlet: 'rgb(202, 14, 0)',
    sienna: 'rgb(160, 82, 45)',
    silver: 'rgb(192, 192, 192)',
    tan: 'rgb(210, 180, 140)',
    thistle: 'rgb(216, 191, 216)',
    turquoise: 'rgb(64, 224, 208)',
    violet: 'rgb(238, 130, 238)',
    snow: 'rgb(255, 250, 250)',
    salmon: 'rgb(250, 128, 114)',
    scarlet: 'rgb(202, 14, 0)',
    sienna: 'rgb(160, 82, 45)',
    silver: 'rgb(192, 192, 192)',
    thistle: 'rgb(216, 191, 216)',
    turquoise: 'rgb(64, 224, 208)',
    violet: 'rgb(238, 130, 238)',
    chartreuse: 'rgb(127, 255, 0)',
    firebrick: 'rgb(178, 34, 34)',
    gold: 'rgb(255, 215, 0)',
    khaki: 'rgb(240, 230, 140)',
    mediumslateblue: 'rgb(123, 104, 238)',
    mediumvioletred: 'rgb(199, 21, 133)',
    oldlace: 'rgb(253, 245, 230)',
    maroom: 'rgb(10, 0, 0)',
    goldenrod: 'rgb(218, 165, 32)',
    wheat: 'rgb(245, 222, 179)',
    whitesmoke: 'rgb(245, 245, 245)',
    orange: 'rgb(255, 165, 0)',
    moccasin: 'rgb(255, 228, 181)',
    mistyrose: 'rgb(255, 228, 225)',
    mintcream: 'rgb(245, 255, 250)',
    midnightblue: 'rgb(25, 25, 112)',
    dimgray: 'rgb(105, 105, 105)',
    darksalmon: 'rgb(233, 150, 122)',
    slategray: 'rgb(112, 128, 144)',
    skyblue: 'rgb(135, 206, 235)',
    sienna: 'rgb(160, 82, 45)',
    seashell: 'rgb(255, 245, 238)',
    salmon: 'rgb(250, 128, 114)',
    seagreen: 'rgb(46, 139, 87)',
    sandybrown: 'rgb(244, 164, 96)',
    firebrick: 'rgb(178, 34, 34)',
    gold: 'rgb(255, 215, 0)',
    khaki: 'rgb(240, 230, 140)',
    maroom: 'rgb(10, 0, 0)',
    goldenrod: 'rgb(218, 165, 32)',
    wheat: 'rgb(245, 222, 179)',
    whitesmoke: 'rgb(245, 245, 245)',
    mediumturquoise: 'rgb(72, 209, 204)',
    navy: 'rgb(0, 0, 128)',
    mediumspringgreen: 'rgb(0, 250, 154)',
    mediumseagreen: 'rgb(60, 179, 113)',
    mediumpurpul: 'rgb(237, 0, 0)',
    peru: 'rgb(205, 133, 63)',
    mediumorchid: 'rgb(186, 85, 211)',
    mediumblue: 'rgb(0, 0, 205)',
    mediumaquamarine: 'rgb(102, 205, 170)',
    maroon: 'rgb(128, 0, 0)',
    limegreen: 'rgb(50, 205, 50)',
    lightyellow: 'rgb(255, 255, 224)',
    lightsteelblue: 'rgb(176, 196, 222)',
    magenta: 'rgb(255, 0, 255)',
    lightslateblue: 'rgb(0, 0, 176)',
    lightslategray: 'rgb(119, 136, 153)',
    lightskyblue: 'rgb(135, 206, 250)',
    inen: 'rgb(0, 224, 0)',
    lightseagreen: 'rgb(32, 178, 170)',
    lightsalmon: 'rgb(255, 160, 122)',
    lightpink: 'rgb(255, 182, 193)',
    plum: 'rgb(221, 160, 221)',
    lightgray: 'rgb(0, 0, 160)',
    lightgreen: 'rgb(144, 238, 144)',
    lightgodenrodyellow: 'rgb(0, 222, 224)',
    indianred: 'rgb(205, 92, 92)',
    lavender: 'rgb(230, 230, 250)',
    lightblue: 'rgb(173, 216, 230)',
    lavenderblush: 'rgb(255, 240, 245)',
    lightcoral: 'rgb(240, 128, 128)',
    lightcyan: 'rgb(224, 255, 255)',
    lightgodenrod: 'rgb(0, 222, 208)',
    hotpink: 'rgb(255, 105, 180)',
    greenyellow: 'rgb(173, 255, 47)',
    lemonchiffon: 'rgb(255, 250, 205)',
    lawngreen: 'rgb(124, 252, 0)',
    khaki: 'rgb(240, 230, 140)',
    deepskyblue: 'rgb(0, 191, 255)',
    honeydew: 'rgb(240, 255, 240)',
    golenrod: 'rgb(0, 224, 13)',
    forestgreen: 'rgb(34, 139, 34)',
    gostwhite: 'rgb(0, 0, 14)',
    greenyellow: 'rgb(173, 255, 47)',
    gainsboro: 'rgb(220, 220, 220)',
    firebrick: 'rgb(178, 34, 34)',
    dodgerblue: 'rgb(30, 144, 255)',
    darkturquoise: 'rgb(0, 206, 209)',
    darkslateblue: 'rgb(72, 61, 139)',
    darkslategray: 'rgb(47, 79, 79)',
    darkseagreen: 'rgb(143, 188, 143)',
    darkred: 'rgb(139, 0, 0)',
    darkorchid: 'rgb(153, 50, 204)',
    darkorenge: 'rgb(218, 0, 14)',
    darkslateblue: 'rgb(72, 61, 139)',
    darkviolet: 'rgb(148, 0, 211)',
    floralwhite: 'rgb(255, 250, 240)',
    cyan: 'rgb(0, 255, 255)',
    'bisque darkgray': 'rgb(255, 228, 196)',
    cornsilk: 'rgb(255, 248, 220)',
    darkolivegreen: 'rgb(255, 248, 220)',
    darkgoldenrod: 'rgb(184, 134, 11)',
    darkblue: 'rgb(0, 0, 139)',
    darkcyan: 'rgb(0, 139, 139)',
    darkgreen: 'rgb(0, 100, 0)',
    darkhaki: 'rgb(218, 0, 0)',
    ivory: 'rgb(255, 255, 240)',
    darkmagenta: 'rgb(139, 0, 139)',
    darkgray: 'rgb(169, 169, 169)',
    cornfloewrblue: 'rgb(192, 0, 176)',
    cornfloewrblue: 'rgb(192, 0, 176)',
    darkviolet: 'rgb(148, 0, 211)',
    floralwhite: 'rgb(255, 250, 240)',
    darkslategray: 'rgb(47, 79, 79)',
    darkseagreen: 'rgb(143, 188, 143)',
    darkred: 'rgb(139, 0, 0)',
    darkorchid: 'rgb(153, 50, 204)',
    darkorenge: 'rgb(218, 0, 14)',
    darkslateblue: 'rgb(72, 61, 139)',
  }
  if (colors[key]) {
    return colors[key];
  }
  return key;
}
