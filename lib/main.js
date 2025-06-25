import App from '../src/App.vue'
import 'splitpanes/dist/splitpanes.css'
import 'virtual:windi.css'
import '../src/styles/main.css'
import {addFile,setActiveFile,addPackage} from '../src/orchestrator'
import { build } from '../src/build/esbuild.js'

export {
    App as Playground,
    addFile,
    setActiveFile,
    addPackage,
    build
}
