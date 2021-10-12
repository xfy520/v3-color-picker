import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pluginVue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'
import clear from 'rollup-plugin-clear'

module.exports = {
  input: path.resolve(__dirname, './src/index.js'),
  output: [
    {
      file: path.resolve(__dirname, './dist/v3-color-picker.js'),
      format: 'umd',
      name: 'V3ColorPicker',
      globals: {
        vue: 'Vue'
      }
    },
    {
      file: path.resolve(__dirname, './dist/v3-color-picker.min.js'),
      format: 'umd',
      name: 'V3ColorPicker',
      globals: {
        vue: 'Vue'
      },
      plugins: [
        uglify(),
        terser()
      ]
    },
    {
      file: path.resolve(__dirname, './dist/v3-color-picker.es.js'),
      format: 'es',
      globals: {
        vue: 'Vue'
      }
    },
    {
      file: path.resolve(__dirname, './dist/v3-color-picker.es.min.js'),
      format: 'es',
      globals: {
        vue: 'Vue'
      },
      plugins: [
        uglify(),
        terser()
      ]
    }
  ],
  plugins: [
    resolve(),
    pluginVue(),
    commonjs(),
    postcss(),
    clear({
      targets: ['./dist'],
      watch: true,
    })
  ],
  external: [
    'vue'
  ]
}
