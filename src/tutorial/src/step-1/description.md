# 开始使用 {#getting-started}

欢迎来到 Vue 教程！

本教程的目标是让你在浏览器中快速体验使用 Vue 的感觉。它并不追求全面覆盖，你也不需要在继续之前理解所有内容。不过，在完成之后，也请务必阅读 <a target="_blank" href="/guide/introduction.html">指南</a>，其中会更详细地介绍每个主题。

## 前置条件 {#prerequisites}

本教程默认你已经对 HTML、CSS 和 JavaScript 有基本了解。如果你对前端开发完全陌生，可能不太适合把框架作为第一步直接上手——先掌握基础，再回来继续学习！如果你有其他框架的使用经验会有帮助，但这不是必需的。

## 如何使用本教程 {#how-to-use-this-tutorial}

你可以编辑 <span class="wide">右侧</span><span class="narrow">下方</span>的代码，并立即看到结果更新。每一步都会介绍 Vue 的一个核心功能，而你需要完成相应代码来让演示运行起来。如果你遇到困难，可以点击“Show me!”按钮查看可工作的代码。尽量不要过度依赖它——自己动手思考会学得更快。

如果你是从 Vue 2 或其他框架转来的有经验开发者，这里有一些设置可以调整，以便更好地使用本教程。如果你是初学者，建议保持默认设置。

<details>
<summary>教程设置详情</summary>

- Vue 提供两种 API 风格：Options API 和 Composition API。本教程针对两种风格都进行了设计——你可以使用顶部的 **API Preference** 开关来选择你偏好的风格。<a target="_blank" href="/guide/introduction.html#api-styles">了解更多关于 API 风格的信息</a>。

- 你也可以在 SFC 模式和 HTML 模式之间切换。前者会以 <a target="_blank" href="/guide/introduction.html#single-file-components">单文件组件</a>（SFC）格式展示代码示例，这是大多数开发者在使用带构建步骤的 Vue 时会采用的方式。HTML 模式则展示不使用构建步骤的用法。

<div class="html">

:::tip
如果你打算在自己的应用中不使用构建步骤而直接采用 HTML 模式，请确保你要么将导入改为：

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

要么在你的脚本中，或者配置你的构建工具以相应地解析 `vue`。以下是 [Vite](https://vite.dev/) 的示例配置：

```js [vite.config.js]
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

更多信息请参阅 [工具指南中的相关部分](/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation)。
:::

</div>

</details>

准备好了吗？点击“Next”开始吧。
