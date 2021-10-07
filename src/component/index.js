import Vue3ColorPicker from './Vue3ColorPicker.vue';

const install = function (app, options = {}) {
  app.component(options.name || Vue3ColorPicker.name, Vue3ColorPicker);
}

export {
  install,
  Vue3ColorPicker,
}
