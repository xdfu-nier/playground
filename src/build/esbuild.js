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
      if (args.path === 'vue' || args.path.startsWith('vue/')) {
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
// const bootstrapScript = `
// const importMap = <!--IMPORT_MAP-->;\n
// const head = document.querySelector('head');\n
// const importMapScript = head.querySelector('[type="importMap"]');\n
// if (importMapScript) {\n
//   let text = importMapScript.text;\n
//   if(text){\n
//     let currentImportMap = JSON.parse(text);\n
//     Object.assign(currentImportMap.imports, importMap.imports);\n
//     importMapScript.text = JSON.stringify(currentImportMap);\n
//   }
// } else {\n
//   let script = document.createElement('script');\n
//   script.type = 'importMap';\n
//   script.text = JSON.stringify(importMap);\n
//   head.appendChild(script);\n
//   script = null;\n
// };\n
// `
export function build() {
  return new Promise((resolve, reject) => {
    if (!orchestrator.files) return inject();
    //清空files
    files = {}
    Object.keys(orchestrator.files).forEach(key => {
      const filePath = `/${key}`
      files[filePath] = orchestrator.files[key].compiled.js
    })
    if (orchestrator.importMap) {
      importMap = JSON.parse(orchestrator.importMap)
    }

    const imports = Object.keys(importMap.imports)
    if(imports.length === 0){
      buildCallback(resolve, reject)
      return;
    }
    let getFilesCount = imports.length
    imports.forEach(key => {
      const filePath = `/${key}`
      fetch(importMap.imports[key]).then(res => res.text()).then(text => {
        files[filePath] = text
        getFilesCount--
        if (getFilesCount === 0) {
          buildCallback(resolve, reject)
        }
      })
    })
    
  })

}

async function buildCallback(resolve, reject) {
  // const bootstrap = bootstrapScript.replace('<!--IMPORT_MAP-->', JSON.stringify(importMap))
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
      }), plugin
      ],
    })
    await esbuild.stop()
    //console.log(result.outputFiles[0].text)
    // resolve(bootstrap + "\n" + result.outputFiles[0].text)
    resolve(result.outputFiles[0].text)
}



