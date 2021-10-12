import { createVNode, render, watch, createApp } from 'vue';

import V3ColorPicker from "./V3ColorPicker.vue";
import ColorPicker from "./component/ColorPicker.vue";

function _colorEvent(options, event) {
  const temp = options || {};
  const change = temp.change && typeof temp.change === "function" ? temp.change : (_v) => { };
  const props = {
    position: {
      x: event.clientX,
      y: event.clientY
    },
    ...temp,
    value: temp.value || "#fff",
    confirm: (v) => {
      change(v);
      options.color = v;
      close();
    },
    clear: () => {
      change(null);
      options.color = null;
      close();
    },
  }
  const container = document.createElement("div");
  const vNode = createVNode(ColorPicker, props);
  render(vNode, container);
  if (container.firstElementChild) {
    document.body.appendChild(container.firstElementChild);
  }
  watch(options, (opts) => {
    if (opts.value) {
      vNode.component.props.value = opts.value;
    }
  })
  if (!temp.change) {
    watch(vNode.component.ctx.color, (color) => {
      options.value = color.v;
    })
  }
  function close() {
    vNode && vNode.el && document.body.removeChild(vNode.el);
    globalThis.document.removeEventListener("click", close);
    globalThis.document.removeEventListener("contextmenu", close);
  }
  setTimeout(() => {
    globalThis.document.addEventListener("click", close);
    globalThis.document.addEventListener("contextmenu", close);
  }, 0);
  return {
    close
  }
}

const directive = {
  mounted(el, { value, instance }) {
    el.addEventListener("click", _colorEvent.bind(instance, value));
  },
  unmounted(el) {
    el.removeEventListener("click", _colorEvent);
  }
}

const colorEvent = (event, options) => _colorEvent(options, event);

const install = function (app) {
  app.component(V3ColorPicker.name, V3ColorPicker);
  app.directive("color", directive);
  app.config.globalProperties.colorEvent = (event, options) => _colorEvent(options, event);
}


export default function (app) {
  app.use(install)
}

export {
  V3ColorPicker,
  directive,
  colorEvent
}
