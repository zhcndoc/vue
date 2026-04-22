---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# 快速开始 {#quick-start}

## 在线体验 Vue {#try-vue-online}

- 要快速了解 Vue，你可以直接在我们的 [Playground](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==) 中试用。

- 如果你更喜欢不包含任何构建步骤的纯 HTML 设置，可以将这个 [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) 作为起点。

- 如果你已经熟悉 Node.js 和构建工具的概念，也可以直接在浏览器中通过 [StackBlitz](https://vite.new/vue) 尝试完整的构建环境。

- 若想了解推荐配置的完整演示，请观看这个交互式 [Scrimba](http://scrimba.com/links/vue-quickstart) 教程，其中会展示如何运行、编辑并部署你的第一个 Vue 应用。

## 创建一个 Vue 应用 {#creating-a-vue-application}

:::tip 前置条件

- 熟悉命令行
- 安装 [Node.js](https://nodejs.org/) 版本 `^20.19.0 || >=22.12.0`
  :::

本节将介绍如何在本地机器上搭建一个 Vue [单页应用](/guide/extras/ways-of-using-vue#single-page-application-spa)。创建出的项目将使用基于 [Vite](https://vite.dev/) 的构建配置，并允许我们使用 Vue [单文件组件](/guide/scaling-up/sfc)（SFC）。

请确保你已安装最新版本的 [Node.js](https://nodejs.org/)，并且当前工作目录就是你打算创建项目的目录。在命令行中运行以下命令（不要带 `$` 符号）：

::: code-group

```sh [npm]
$ npm create vue@latest
```

```sh [pnpm]
$ pnpm create vue@latest
```

```sh [yarn]
# 对于 Yarn (v1+)
$ yarn create vue

# 对于 Yarn Modern (v2+)
$ yarn create vue@latest
  
# 对于 Yarn ^v4.11
$ yarn dlx create-vue@latest
```

```sh [bun]
$ bun create vue@latest
```
:::

该命令将安装并执行 [create-vue](https://github.com/vuejs/create-vue)，这是 Vue 官方的项目脚手架工具。随后你会看到一些可选功能的提示，例如 TypeScript 和测试支持：

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">项目名称：<span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">添加 TypeScript？<span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">添加 JSX 支持？<span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">为单页应用开发添加 Vue Router？<span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">添加 Pinia 用于状态管理？<span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">添加 Vitest 用于单元测试？<span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">添加端到端测试方案？<span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Nightwatch / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">添加 ESLint 进行代码质量检查？<span style="color:#888;">… No / <span style="color:#89DDFF;text-decoration:underline">Yes</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">添加 Prettier 进行代码格式化？<span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">添加用于调试的 Vue DevTools 7 扩展？（实验性）<span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">正在 ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span> 中搭建项目...</span>
<span style="color:#A6ACCD;">完成。</span></code></pre></div>

如果你不确定某个选项，暂时直接按回车选择 `No` 即可。项目创建完成后，按照说明安装依赖并启动开发服务器：

::: code-group

```sh-vue [npm]
$ cd {{'<your-project-name>'}}
$ npm install
$ npm run dev
```

```sh-vue [pnpm]
$ cd {{'<your-project-name>'}}
$ pnpm install
$ pnpm run dev
```

```sh-vue [yarn]
$ cd {{'<your-project-name>'}}
$ yarn
$ yarn dev
```

```sh-vue [bun]
$ cd {{'<your-project-name>'}}
$ bun install
$ bun run dev
```

:::


现在你应该已经运行起你的第一个 Vue 项目了！请注意，生成项目中的示例组件使用的是 [组合式 API](/guide/introduction#composition-api) 和 `<script setup>`，而不是 [选项式 API](/guide/introduction#options-api)。下面是一些额外提示：

- 推荐的 IDE 配置是 [Visual Studio Code](https://code.visualstudio.com/) + [Vue - Official extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。如果你使用其他编辑器，请查看 [IDE 支持部分](/guide/scaling-up/tooling#ide-support)。
- 更多工具链细节，包括与后端框架的集成，已在 [工具指南](/guide/scaling-up/tooling) 中讨论。
- 想进一步了解底层构建工具 Vite，请查看 [Vite 文档](https://vite.dev/)。
- 如果你选择使用 TypeScript，请查看 [TypeScript 使用指南](typescript/overview)。

当你准备好将应用发布到生产环境时，运行以下命令：

::: code-group

```sh [npm]
$ npm run build
```

```sh [pnpm]
$ pnpm run build
```

```sh [yarn]
$ yarn build
```

```sh [bun]
$ bun run build
```

:::


这会在项目的 `./dist` 目录中生成适用于生产环境的构建版本。查看 [生产部署指南](/guide/best-practices/production-deployment) 以了解更多关于将应用发布到生产环境的信息。

[下一步 >](#next-steps)

## 从 CDN 使用 Vue {#using-vue-from-cdn}

你可以通过 script 标签直接从 CDN 使用 Vue：

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

这里我们使用的是 [unpkg](https://unpkg.com/)，但你也可以使用任何提供 npm 包的 CDN，例如 [jsdelivr](https://www.jsdelivr.com/package/npm/vue) 或 [cdnjs](https://cdnjs.com/libraries/vue)。当然，你也可以下载这个文件并自行托管。

当通过 CDN 使用 Vue 时，不涉及任何“构建步骤”。这会让配置简单许多，并且适合增强静态 HTML 或与后端框架集成。不过，你将无法使用单文件组件（SFC）语法。

### 使用全局构建版本 {#using-the-global-build}

上面的链接加载的是 Vue 的 _全局构建版本_，其中所有顶层 API 都作为全局 `Vue` 对象上的属性暴露出来。下面是一个使用全局构建版本的完整示例：

<div class="options-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[CodePen 演示 >](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[CodePen 演示 >](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip
本指南中许多组合式 API 示例都会使用 `<script setup>` 语法，这需要构建工具。如果你打算在没有构建步骤的情况下使用组合式 API，请参考 [`setup()` 选项](/api/composition-api-setup) 的用法。
:::

</div>

### 使用 ES 模块构建版本 {#using-the-es-module-build}

在本指南的其余部分，我们将主要使用 [ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 语法。如今大多数现代浏览器都原生支持 ES 模块，因此我们可以像这样通过原生 ES 模块从 CDN 使用 Vue：

<div class="options-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

请注意，我们使用的是 `<script type="module">`，而导入的 CDN URL 指向的是 Vue 的 **ES 模块构建版本**。

<div class="options-api">

[CodePen 演示 >](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[CodePen 演示 >](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### 启用 Import Maps {#enabling-import-maps}

在上面的示例中，我们是从完整的 CDN URL 导入的，但在本指南的其余部分你会看到如下代码：

```js
import { createApp } from 'vue'
```

我们可以通过使用 [Import Maps](https://caniuse.com/import-maps) 让浏览器知道去哪里定位 `vue` 导入：

<div class="options-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[CodePen 演示 >](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[CodePen 演示 >](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

你还可以在 import map 中为其他依赖添加条目——但要确保它们指向你打算使用的库的 ES 模块版本。

:::tip Import Maps 浏览器支持
Import Maps 是一项相对较新的浏览器特性。请确保使用处于其 [支持范围](https://caniuse.com/import-maps) 内的浏览器。尤其需要注意的是，它目前仅在 Safari 16.4+ 中受支持。
:::

:::warning 关于生产使用的说明
到目前为止的示例使用的是 Vue 的开发版——如果你打算在生产环境中通过 CDN 使用 Vue，请务必查看 [生产部署指南](/guide/best-practices/production-deployment#without-build-tools)。

虽然可以在没有构建系统的情况下使用 Vue，但另一个可考虑的方案是使用 [`vuejs/petite-vue`](https://github.com/vuejs/petite-vue)，它可能更适合过去会使用 [`jquery/jquery`](https://github.com/jquery/jquery) 或当下可能会使用 [`alpinejs/alpine`](https://github.com/alpinejs/alpine) 的场景。
:::

### 拆分模块 {#splitting-up-the-modules}

随着我们深入本指南，可能需要将代码拆分为独立的 JavaScript 文件，以便更易于管理。例如：

```html [index.html]
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js [my-component.js]
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>计数为：{{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js [my-component.js]
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>计数为：{{ count }}</div>`
}
```

</div>

如果你直接在浏览器中打开上面的 `index.html`，会发现它报错了，因为 ES 模块不能通过 `file://` 协议工作，而浏览器在打开本地文件时使用的就是这个协议。

出于安全原因，ES 模块只能通过 `http://` 协议工作，而浏览器在打开网页时使用的就是这个协议。为了让 ES 模块在本地机器上正常工作，我们需要通过本地 HTTP 服务器以 `http://` 协议提供 `index.html`。

要启动本地 HTTP 服务器，首先确保你已安装 [Node.js](https://nodejs.org/en/)，然后在命令行中、HTML 文件所在的同一目录下运行 `npx serve`。你也可以使用任何其他能够以正确 MIME 类型提供静态文件的 HTTP 服务器。

你可能已经注意到，导入的组件模板是以内联 JavaScript 字符串的形式写入的。如果你使用 VS Code，可以安装 [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 扩展，并在字符串前添加 `/*html*/` 注释，从而为其提供语法高亮。

## 下一步 {#next-steps}

如果你跳过了[介绍](/guide/introduction)，我们强烈建议你在继续阅读其余文档之前先阅读它。

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">继续阅读指南</p>
    <p class="next-steps-caption">指南将带你全面深入地了解框架的各个方面。</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">试试教程</p>
    <p class="next-steps-caption">适合那些更喜欢通过动手实践来学习的人。</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">查看示例</p>
    <p class="next-steps-caption">探索核心功能和常见 UI 任务的示例。</p>
  </a>
</div>
