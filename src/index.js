import Vue3ColorPicker from './Vue3ColorPicker.vue'

export default function (app) {
  app.component(options.name || Vue3ColorPicker.name, Vue3ColorPicker);
}

export {
  Vue3ColorPicker
}


function HsvToRgb(h, s, v) {
  h = bound01(h, 360) * 6
  s = bound01(s, 100)
  v = bound01(v, 100)

  const i = Math.floor(h)
  const f = h - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  const mod = i % 6
  const r = [v, q, p, p, t, v][mod]
  const g = [t, v, v, q, p, p][mod]
  const b = [p, p, t, v, v, q][mod]

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

function rgbToHsv(r, g, b) {
  r = bound01(r, 255)
  g = bound01(g, 255)
  b = bound01(b, 255)

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  const v = max

  const d = max - min
  const s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      }
      case g: {
        h = (b - r) / d + 2
        break
      }
      case b: {
        h = (r - g) / d + 4
        break
      }
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, v: v * 100 }
}

const isOnePointZero = function (n) {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1
}

const isPercentage = function (n) {
  return typeof n === 'string' && n.indexOf('%') !== -1
}

// Take input from [0, n] and return it as [0, 1]
const bound01 = function (value, max) {
  if (isOnePointZero(value)) value = '100%'

  const processPercent = isPercentage(value)
  value = Math.min(max, Math.max(0, parseFloat(`${value}`)))

  // Automatically convert percentage into number
  if (processPercent) {
    value = parseInt(`${value * (max)}`, 10) / 100
  }

  // Handle floating point rounding errors
  if (Math.abs(value - (max)) < 0.000001) {
    return 1
  }

  // Convert into [0, 1] range if it isn't already
  return (value % (max)) / parseFloat(max)
}
