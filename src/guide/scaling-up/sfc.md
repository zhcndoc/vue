# 单文件组件 {#single-file-components}

## 简介 {#introduction}

Vue 单文件组件（即 `*.vue` 文件，简称为 **SFC**）是一种特殊的文件格式，它允许我们将 Vue 组件的模板、逻辑**以及**样式封装在同一个文件中。下面是一个 SFC 示例：

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

正如我们所见，Vue SFC 是经典的 HTML、CSS 和 JavaScript 三者的自然延伸。`<template>`、`<script>` 和 `<style>` 块将组件的视图、逻辑和样式封装并放置在同一个文件中。完整语法定义见 [SFC 语法规范](/api/sfc-spec)。

## 为什么使用 SFC {#why-sfc}

虽然 SFC 需要构建步骤，但作为回报，它带来了诸多好处：

- 使用熟悉的 HTML、CSS 和 JavaScript 语法编写模块化组件
- [将本就紧密耦合的关注点放在一起](#what-about-separation-of-concerns)
- 预编译模板，无运行时编译开销
- [组件作用域 CSS](/api/sfc-css-features)
- [在使用 Composition API 时更友好的语法](/api/sfc-script-setup)
- 通过交叉分析模板和脚本获得更多编译期优化
- 面向模板表达式的自动补全与类型检查 [IDE 支持](/guide/scaling-up/tooling#ide-support)
- 开箱即用的热模块替换（HMR）支持

SFC 是 Vue 作为一个框架的标志性特性，也是以下场景中使用 Vue 的推荐方式：

- 单页应用（SPA）
- 静态站点生成（SSG）
- 任何非简单的前端项目，只要构建步骤能为更好的开发体验（DX）提供合理价值。

话虽如此，我们也确实意识到在某些场景下，SFC 可能会显得有些大材小用。这就是为什么 Vue 仍然可以通过不需要构建步骤的纯 JavaScript 来使用。如果你只是想在大体静态的 HTML 上增加一些轻量交互，也可以看看 [petite-vue](https://github.com/vuejs/petite-vue)，它是一个针对渐进增强进行了优化的、6 kB 的 Vue 子集。

## 它是如何工作的 {#how-it-works}

Vue SFC 是一种框架特定的文件格式，必须先由 [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) 预编译为标准的 JavaScript 和 CSS。编译后的 SFC 是一个标准的 JavaScript（ES）模块——这意味着在正确的构建配置下，你可以像导入模块一样导入 SFC：

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

SFC 中的 `<style>` 标签通常会在开发期间以原生 `<style>` 标签的形式注入，以支持热更新。在生产环境中，它们可以被提取并合并为单个 CSS 文件。

你可以在 [Vue SFC Playground](https://play.vuejs.org/) 中体验 SFC，并探索它们是如何被编译的。

在实际项目中，我们通常会将 SFC 编译器与 [Vite](https://vite.dev/) 或 [Vue CLI](http://cli.vuejs.org/)（基于 [webpack](https://webpack.js.org/)）等构建工具集成，并且 Vue 还提供了官方脚手架工具，帮助你尽可能快速地开始使用 SFC。更多细节请查看 [SFC 工具链](/guide/scaling-up/tooling) 章节。

## 关于关注点分离呢？ {#what-about-separation-of-concerns}

一些来自传统 Web 开发背景的用户可能会担心，SFC 将不同的关注点混在了同一个地方——而 HTML/CSS/JS 本应将它们分开！

要回答这个问题，我们首先要达成一致：**关注点分离并不等于文件类型分离**。工程原则的最终目标是提升代码库的可维护性。当关注点分离被教条地理解为文件类型分离时，在日益复杂的前端应用场景中，它并不能帮助我们达到这个目标。

在现代 UI 开发中，我们发现，与其把代码库拆分成三个彼此交织的庞大层次，不如将其拆分为松耦合的组件并进行组合。在一个组件内部，它的模板、逻辑和样式本就是天然耦合的，而将它们放在一起，实际上会让组件更内聚、更易维护。

注意，即使你不喜欢单文件组件的理念，你仍然可以通过使用 [Src Imports](/api/sfc-spec#src-imports) 将 JavaScript 和 CSS 分离到不同文件中，从而利用其热重载和预编译特性。
