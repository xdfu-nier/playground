import * as esbuild from 'esbuild-wasm'
import { externalGlobalPlugin } from "esbuild-plugin-external-global";
import { orchestrator } from '~/orchestrator'


var files = {}
var importMap = {}
const plugin = {
  name: 'virtual-fs',
  setup(build) {
    // 拦截文件加载
    build.onResolve({ filter: /.*/ }, args => {
      // 👇 排除 Vue 和 Vue 子模块
      if (args.path === 'vue' || args.path.startsWith('vue/') || importMap.imports[args.path]) {
        return { path: args.path, external: true }
      }
      const path = new URL(args.path, 'file://' + args.resolveDir + '/').pathname
      return { path, namespace: 'virtual' }
    })

    build.onLoad({ filter: /.*/, namespace: 'virtual' }, args => {
      const contents = files[args.path]
      if (!contents) throw new Error(`File not found: ${args.path}`)
      return {
        contents,
        loader: 'js'
      }
    })
  }
}
const bootstrapScript = `
const importMap = <!--IMPORT_MAP-->;\n
const head = document.querySelector('head');\n
const importMapScript = head.querySelector('[type="importMap"]');\n
if (importMapScript) {\n
  let text = importMapScript.text;\n
  if(text){\n
    let currentImportMap = JSON.parse(text);\n
    Object.assign(currentImportMap.imports, importMap.imports);\n
    importMapScript.text = JSON.stringify(currentImportMap);\n
  }
} else {\n
  let script = document.createElement('script');\n
  script.type = 'importMap';\n
  script.text = JSON.stringify(importMap);\n
  head.appendChild(script);\n
  script = null;\n
};\n
`
export async function build() {
  if(!orchestrator.files) return Promise.inject();
  //清空files
  files = {}
  Object.keys(orchestrator.files).forEach(key => {
    const filePath = `/${key}`
    files[filePath] = orchestrator.files[key].compiled.js
  })
  if(orchestrator.importMap) {
    importMap = JSON.parse(orchestrator.importMap)
  }
  const bootstrap = bootstrapScript.replace('<!--IMPORT_MAP-->', JSON.stringify(importMap))
  await esbuild.initialize({
    wasmURL: './node_modules/esbuild-wasm/esbuild.wasm'
  })
  const result = await esbuild.build({
    entryPoints: ['App.vue'],
    bundle: true,
    write: false,
    format: 'esm',
    external: ['vue'],
    plugins: [externalGlobalPlugin({
      vue: 'window.Vue'
    }),plugin
    ],
  })
  await esbuild.stop()
  return Promise.resolve(bootstrap+"\n"+result.outputFiles[0].text)
}



