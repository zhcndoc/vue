# 生产部署 {#production-deployment}

## 开发版与生产版 {#development-vs-production}

在开发过程中，Vue 提供了许多功能来改善开发体验：

- 常见错误和陷阱的警告
- Props / events 校验
- [响应式调试钩子](/guide/extras/reactivity-in-depth#reactivity-debugging)
- Devtools 集成

然而，这些功能在生产环境中就变得无用了。其中一些警告检查还会带来少量性能开销。部署到生产环境时，我们应该去掉所有未使用的、仅用于开发的代码分支，以减小包体积并提升性能。

## 不使用构建工具 {#without-build-tools}

如果你在不使用构建工具的情况下使用 Vue，例如通过 CDN 或自托管脚本加载它，那么在部署到生产环境时，请务必使用生产构建版本（以 `.prod.js` 结尾的 dist 文件）。生产构建版本会预先压缩，并移除所有仅用于开发的代码分支。

- 如果使用全局构建版本（通过 `Vue` 全局对象访问）：使用 `vue.global.prod.js`。
- 如果使用 ESM 构建版本（通过原生 ESM 导入访问）：使用 `vue.esm-browser.prod.js`。

更多详情请参阅 [dist 文件指南](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use)。

## 使用构建工具 {#with-build-tools}

通过 `create-vue`（基于 Vite）或 Vue CLI（基于 webpack）搭建的项目，已经预先配置好用于生产构建。

如果使用自定义设置，请确保：

1. `vue` 解析到 `vue.runtime.esm-bundler.js`。
2. [编译时特性标志](/api/compile-time-flags) 已正确配置。
3. 构建期间将 <code>process.env<wbr>.NODE_ENV</code> 替换为 `"production"`。

其他参考：

- [Vite 生产构建指南](https://vite.dev/guide/build.html)
- [Vite 部署指南](https://vite.dev/guide/static-deploy.html)
- [Vue CLI 部署指南](https://cli.vuejs.org/guide/deployment.html)

## 跟踪运行时错误 {#tracking-runtime-errors}

可以使用 [应用级错误处理器](/api/application#app-config-errorhandler) 将错误上报到跟踪服务：

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // 将错误上报到跟踪服务
}
```

像 [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) 和 [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) 这样的服务也为 Vue 提供了官方集成。
