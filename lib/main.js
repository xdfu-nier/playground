import App from '../src/App.vue'
import 'splitpanes/dist/splitpanes.css'
import 'virtual:windi.css'
import '../src/styles/main.css'
import {addFile,setActiveFile,addPackage} from '../src/orchestrator'
import { build } from '../src/build/esbuild.js'
// export * from "../src/components/playground/Preview.vue";
// export * from "../src/components/playground/Console.vue";
// export * from "../src/components/playground/Editor.vue";
// export * from "../src/components/playground/Message.vue";
// export * from "../src/components/playground/Tab.vue";
// export * from "../src/components/playground/TabBar.vue";
// export * from "../src/components/settings/EditorSettings.vue";
// export * from "../src/components/settings/InstallSettings.vue";
// export * from "../src/components/settings/ManuallyInstallPackage.vue";
// export * from "../src/components/settings/PackageItem.vue";
// export * from "../src/components/settings/PackageVersion.vue";
// export * from "../src/components/settings/PackagesSettings.vue";
// export * from "../src/components/settings/Settings.vue";
// export * from "../src/components/settings/SettingsTab.vue";
// export * from "../src/components/settings/WindiCSSSettings.vue";
// export * from "../src/components/ui/Button.vue";
// export * from "../src/components/ui/Container.vue";
// export * from "../src/components/ui/Navigation.vue";
// export * from "../src/components/ui/Select.vue";
// export * from "../src/components/ui/SelectItem.vue";
// export * from "../src/components/ui/Textfield.vue";
export {
    App as Playground,
    addFile,
    setActiveFile,
    addPackage,
    build
}
