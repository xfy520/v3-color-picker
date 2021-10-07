declare module 'vue3-color-picker' {
  export const Vue3Menus: import('vue').DefineComponent<menusType & {
    open: boolean
  }>;

  const install: (app: import('vue').App, options: {
    name: string
  }) => unknown;

  export default install;
}
