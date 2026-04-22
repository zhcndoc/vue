---
outline: deep
---

# 编译时标志 {#compile-time-flags}

:::tip
编译时标志仅在使用 Vue 的 `esm-bundler` 构建版本时生效（即 `vue/dist/vue.esm-bundler.js`）。
:::

当将 Vue 与构建步骤一起使用时，可以配置若干编译时标志来启用 / 禁用某些功能。使用编译时标志的好处是，通过这种方式禁用的功能可以通过 tree-shaking 从最终 bundle 中移除。

即使没有显式配置这些标志，Vue 也可以正常工作。不过，建议始终配置它们，以便在可能的情况下正确移除相关功能。

请参阅 [配置指南](#configuration-guides)，了解如何根据你的构建工具进行配置。

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **默认值：** `true`

  启用 / 禁用 Options API 支持。禁用后会使 bundle 更小，但如果某些第三方库依赖 Options API，则可能影响兼容性。

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **默认值：** `false`

  启用 / 禁用生产构建中的 devtools 支持。这会使 bundle 中包含更多代码，因此建议仅在调试目的下启用。

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **默认值：** `false`

  启用/禁用生产构建中 hydration 不匹配的详细警告。这会使 bundle 中包含更多代码，因此建议仅在调试目的下启用。

- 仅在 3.4+ 中可用

## 配置指南 {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` 会自动为这些标志提供默认值。要更改默认值，请使用 Vite 的 [`define` 配置选项](https://vite.dev/config/shared-options.html#define)：

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // 在生产构建中启用 hydration 不匹配详细信息
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` 会自动为其中一些标志提供默认值。要配置 / 更改这些值：

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

应使用 webpack 的 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 来定义这些标志：

```js [webpack.config.js]
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

应使用 [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) 来定义这些标志：

```js [rollup.config.js]
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```
