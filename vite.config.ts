import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import ViteComponents, { HeadlessUiResolver } from 'vite-plugin-components'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import { copyVuePlugin } from './plugins/copy-vue'
import { resolve } from 'path';

const prefix = 'monaco-editor/esm/vs'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001
  },
  base: '/playground/',
  build: {
   lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'playground',
      // the proper extensions will be added
      fileName: 'playground',
      formats: ['es', 'umd'],
    },
    outDir: './dist/playground',
    rollupOptions: {
      external: ['vue'], 
      output: {
        inlineDynamicImports: true,
         globals: {
          vue: 'Vue' // 设置全局变量名，以便在 UMD 构建中使用
        },
        // manualChunks: {
        //   htmlWorker: ['./src/monaco/languages/html/html.worker'],
        //   tsWorker: [`${prefix}/language/typescript/ts.worker`],
        //   editorWorker: [`${prefix}/editor/editor.worker`],
        // },
      },
    },
  },
  plugins: [
    vue(),
    copyVuePlugin(),
    WindiCSS({
      scan: {
        include: ['src/**/*.{vue,html,jsx,tsx}', 'index.html'],
      },
    }),
    ViteComponents({
      globalComponentsDeclaration: true,
      customComponentResolvers: [
        ViteIconsResolver({
          componentPrefix: '',
        }),
        HeadlessUiResolver(),
      ],
    }),
    Icons(),
    // VitePWA({
    //   base: '/',
    // }),
  ],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@vue/compiler-sfc': '@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js',
    },
  },
  optimizeDeps: {
    exclude: ['consolidate', 'velocityjs', 'dustjs-linkedin', 'atpl', 'liquor', 'twig', 'ejs', 'eco', 'jazz', 'hamljs', 'hamlet', 'jqtpl', 'whiskers', 'haml-coffee', 'hogan.js', 'templayed', 'handlebars', 'underscore', 'lodash', 'walrus', 'mustache', 'just', 'ect', 'mote', 'toffee', 'dot', 'bracket-template', 'ractive', 'htmling', 'babel-core', 'plates', 'react-dom/server', 'react', 'vash', 'slm', 'marko', 'teacup/lib/express', 'coffee-script', 'squirrelly', 'twing'],
  },
})
