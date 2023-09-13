import { defineAsyncComponent } from "vue";
// const components = import.meta.glob("./*.vue");
// console.log("components", components);

// export default function install(app) {
//   for (const [key, value] of Object.entries(components)) {
//     const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
//     console.log("name", name);
//     app.component(name, value);
//   }
// }

export default {
  install(app) {
    const ctx = require.context("./", false, /\.vue$/);
    console.log("ctx", ctx.keys());
    ctx.keys().forEach((item) => {
      const name = item.slice(item.lastIndexOf("/") + 1, item.lastIndexOf("."));
      const component = ctx(item).default;
      console.log("component", name, component);
      app.component(name, component);
    });
  },
};
