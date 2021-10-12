type colorType = {
  value?: string | null;
  zIndex?: number;
  theme?: "dark" | "light";
  height?: number;
  width?: number;
  colors?: Array<string>;
  btn?: boolean;
}

declare module 'v3-color-picker' {
  export const V3ColorPicker: import('vue').DefineComponent<colorType & {
    size: undefined | "medium" | "small" | "mini"
  }>;

  export const colorEvent: (event: MouseEvent, options: colorType & {
    change?: (v: string) => void;
  }) => {
    close: () => void
  };

  export const directive: import('vue').Directive;

  const install: (app: import('vue').App, options: {
    name: string
  }) => unknown;
  export default install;
}
