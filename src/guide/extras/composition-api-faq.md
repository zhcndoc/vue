---
outline: deep
---

# 组合式 API FAQ {#composition-api-faq}

:::tip
本 FAQ 假设你已经有 Vue 的使用经验——特别是主要使用 Options API 的 Vue 2 经验。
:::

## 什么是 Composition API？ {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Free Composition API Lesson"/>

Composition API 是一组 API，允许我们使用导入的函数来编写 Vue 组件，而不是声明选项。它是一个总称，涵盖以下 API：

- [响应式 API](/api/reactivity-core)，例如 `ref()` 和 `reactive()`，它们允许我们直接创建响应式状态、计算状态和侦听器。

- [生命周期钩子](/api/composition-api-lifecycle)，例如 `onMounted()` 和 `onUnmounted()`，它们允许我们以编程方式挂载到组件生命周期中。

- [依赖注入](/api/composition-api-dependency-injection)，即 `provide()` 和 `inject()`，它们允许我们在使用响应式 API 的同时利用 Vue 的依赖注入系统。

Composition API 是 Vue 3 和 [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html) 的内置功能。对于更早的 Vue 2 版本，请使用官方维护的 [`@vue/composition-api`](https://github.com/vuejs/composition-api) 插件。在 Vue 3 中，它通常也会与单文件组件中的 [`<script setup>`](/api/sfc-script-setup) 语法一起使用。下面是一个使用 Composition API 的组件基础示例：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 修改状态并触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`初始计数是 ${count.value}.`)
})
</script>

<template>
  <button @click="increment">计数是：{{ count }}</button>
</template>
```

尽管它的 API 风格基于函数组合，**Composition API 并不是函数式编程**。Composition API 基于 Vue 可变的、细粒度的响应式范式，而函数式编程强调不可变性。

如果你有兴趣了解如何使用 Composition API 来学习 Vue，可以通过左侧边栏顶部的切换开关将全站 API 偏好设置为 Composition API，然后从头开始阅读指南。

## 为什么选择 Composition API？ {#why-composition-api}

### 更好的逻辑复用 {#better-logic-reuse}

Composition API 的主要优势是，它能够以 [可组合函数](/guide/reusability/composables) 的形式实现简洁高效的逻辑复用。它解决了 [mixin 的所有缺点](/guide/reusability/composables#vs-mixins)，而 mixin 是 Options API 的主要逻辑复用机制。

Composition API 的逻辑复用能力催生了诸如 [VueUse](https://vueuse.org/) 这样的出色社区项目，它是一个不断增长的可组合工具集。它还提供了一种简洁的机制，方便将有状态的第三方服务或库轻松集成到 Vue 的响应式系统中，例如 [不可变数据](/guide/extras/reactivity-in-depth#immutable-data)、[状态机](/guide/extras/reactivity-in-depth#state-machines) 和 [RxJS](/guide/extras/reactivity-in-depth#rxjs)。

### 更灵活的代码组织 {#more-flexible-code-organization}

很多用户喜欢 Options API 的一个原因是，默认情况下我们编写出来的代码是有组织的：每一部分都有其归属，取决于它属于哪个选项。然而，当单个组件的逻辑复杂度超过某个阈值时，Options API 就会带来严重限制。这个限制在需要处理多个**逻辑关注点**的组件中尤为明显——我们在许多生产环境的 Vue 2 应用中都亲眼见过这一点。

以 Vue CLI 的 GUI 中的文件夹浏览器组件为例：这个组件负责以下逻辑关注点：

- 跟踪当前文件夹状态并显示其内容
- 处理文件夹导航（打开、关闭、刷新……）
- 处理新建文件夹
- 切换仅显示收藏文件夹
- 切换显示隐藏文件夹
- 处理当前工作目录变更

该组件的[原始版本](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404)是用 Options API 编写的。如果我们根据每一行代码所处理的逻辑关注点给它们上色，效果如下：

<img alt="folder component before" src="./images/options-api.png" width="129" height="500" style="margin: 1.2em auto">

注意，与同一个逻辑关注点相关的代码被迫分散在不同的选项中，位于文件的不同部分。在一个长达数百行的组件里，理解和浏览某一个逻辑关注点需要不断上下滚动文件，这比本应有的难度要大得多。此外，如果我们想把某个逻辑关注点提取成可复用工具，从文件不同部分找出并提取正确的代码片段会相当费力。

下面是同一个组件，在[重构为 Composition API 之后](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e)的前后对比：

![folder component after](./images/composition-api-after.png)

注意，与同一个逻辑关注点相关的代码现在可以被归组在一起：在处理某个特定逻辑关注点时，我们不再需要在不同的选项块之间来回跳转。而且，由于我们不再需要为了提取代码而对其进行重新排列，现在可以更轻松地把一组代码移动到外部文件中。这种重构摩擦的降低，是大型代码库长期可维护性的关键。

### 更好的类型推导 {#better-type-inference}

近年来，越来越多的前端开发者开始采用 [TypeScript](https://www.typescriptlang.org/)，因为它帮助我们编写更健壮的代码、更有信心地进行变更，并提供了带有 IDE 支持的出色开发体验。然而，最初在 2013 年构想出来的 Options API 并没有把类型推导纳入设计考虑。为了让类型推导在 Options API 中可用，我们不得不实现一些[极其复杂的类型运算](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165)。即便付出了这些努力，Options API 的类型推导在 mixin 和依赖注入场景下仍然可能失效。

这导致许多想用 TS 搭配 Vue 的开发者倾向于使用由 `vue-class-component` 支持的 Class API。然而，基于类的 API 高度依赖 ES 装饰器，而在 2019 年 Vue 3 开发时，这个语言特性仍只是一个 stage 2 提案。我们认为将官方 API 建立在一个不稳定的提案之上风险太高。从那以后，装饰器提案又经历了一轮彻底重做，并最终在 2022 年达到 stage 3。此外，基于类的 API 也存在与 Options API 类似的逻辑复用和组织方面的限制。

相比之下，Composition API 主要使用普通变量和函数，它们天然更适合类型系统。使用 Composition API 编写的代码几乎不需要手动类型标注，就能享受完整的类型推导。大多数时候，Composition API 代码在 TypeScript 和普通 JavaScript 中看起来几乎完全一样。这也使得普通 JavaScript 用户同样能从部分类型推导中受益。

### 更小的生产环境包体积和更低的开销 {#smaller-production-bundle-and-less-overhead}

使用 Composition API 和 `<script setup>` 编写的代码，也比对应的 Options API 实现更高效、更利于压缩。这是因为 `<script setup>` 组件中的模板会被编译成一个函数，并以内联方式放在与 `<script setup>` 代码相同的作用域中。不同于通过 `this` 访问属性，编译后的模板代码可以直接访问 `<script setup>` 内声明的变量，中间不需要实例代理。这也带来了更好的压缩效果，因为所有变量名都可以安全地缩短。

## 与 Options API 的关系 {#relationship-with-options-api}

### 取舍 {#trade-offs}

一些从 Options API 迁移过来的用户发现他们的 Composition API 代码不那么有组织，并因此得出结论：在代码组织方面，Composition API “更差”。我们建议持有这种观点的用户从另一个角度看待这个问题。

Composition API 不再提供那些引导你把代码放进各自桶里的“护栏”，这点确实如此。作为回报，你可以像编写普通 JavaScript 一样来编写组件代码。这意味着**你可以而且应该像编写普通 JavaScript 那样，将任何代码组织最佳实践应用到 Composition API 代码中**。如果你能写出组织良好的 JavaScript，那么你也应该能写出组织良好的 Composition API 代码。

Options API 确实让你在编写组件代码时“少想一点”，这也是许多用户喜欢它的原因。然而，在减少心智负担的同时，它也会把你锁定在既定的代码组织模式中，没有退路，这会让大型项目中的重构或提升代码质量变得困难。从这个角度看，Composition API 提供了更好的长期扩展性。

### Composition API 是否覆盖所有使用场景？ {#does-composition-api-cover-all-use-cases}

就有状态逻辑而言，是的。使用 Composition API 时，可能仍然需要的选项只有：`props`、`emits`、`name` 和 `inheritAttrs`。

:::tip

从 3.3 开始，你可以直接在 `<script setup>` 中使用 `defineOptions` 来设置组件名称或 `inheritAttrs` 属性

:::

如果你打算只使用 Composition API（再加上上面列出的选项），你可以通过一个[编译时标志](/api/compile-time-flags)从 Vue 中移除与 Options API 相关的代码，从而让生产环境包体积再减少几 KB。请注意，这也会影响你依赖中的 Vue 组件。

### 我可以在同一个组件中同时使用两种 API 吗？ {#can-i-use-both-apis-in-the-same-component}

可以。你可以在 Options API 组件中通过 [`setup()`](/api/composition-api-setup) 选项使用 Composition API。

不过，我们只建议在以下情况下这样做：你已经有一个现有的 Options API 代码库，需要与使用 Composition API 编写的新功能 / 外部库集成。

### Options API 会被废弃吗？ {#will-options-api-be-deprecated}

不会，我们没有这个计划。Options API 是 Vue 不可或缺的一部分，也是许多开发者喜爱它的原因。我们也意识到，Composition API 的许多优势只有在大规模项目中才会真正体现出来，而 Options API 对于许多低到中等复杂度的场景来说仍然是一个稳妥的选择。

## 与 Class API 的关系 {#relationship-with-class-api}

鉴于 Composition API 提供了出色的 TypeScript 集成，并带来了额外的逻辑复用和代码组织优势，我们不再建议在 Vue 3 中使用 Class API。

## 与 React Hooks 的比较 {#comparison-with-react-hooks}

Composition API 提供了与 React Hooks 同等水平的逻辑组合能力，但也有一些重要区别。

React Hooks 会在组件每次更新时反复调用。这带来了一些注意事项，甚至会让经验丰富的 React 开发者也感到困惑。它还会引发性能优化问题，严重影响开发体验。以下是一些例子：

- Hooks 对调用顺序敏感，不能有条件地调用。

- 在 React 组件中声明的变量可能会被 hook 闭包捕获；如果开发者没有传入正确的依赖数组，这些变量就会变得“过时”。这使得 React 开发者不得不依赖 ESLint 规则来确保传入正确的依赖项。然而，这条规则往往不够智能，并且为了保证正确性会过度补偿，导致不必要的失效；在遇到边界情况时也会带来很多麻烦。

- 代价高昂的计算需要使用 `useMemo`，而这同样要求手动传入正确的依赖数组。

- 传递给子组件的事件处理函数默认会导致不必要的子组件更新，因此需要显式使用 `useCallback` 作为优化。这几乎总是需要的，而且同样要求正确的依赖数组。忽视这一点会导致应用默认出现过度渲染，并可能在不知不觉中引发性能问题。

- 过时闭包问题与 Concurrent 特性结合后，会使得很难推断某段 hooks 代码何时执行；同时，使用应当跨渲染保持的可变状态（通过 `useRef`）也会变得繁琐。

> 注意：上面一些与 memoization 相关的问题，预计可以通过即将推出的 [React Compiler](https://react.dev/learn/react-compiler) 解决。

相比之下，Vue Composition API：

- 只会调用一次 `setup()` 或 `<script setup>` 中的代码。这使得代码与惯用 JavaScript 的直觉更加一致，因为不需要担心过时闭包的问题。Composition API 的调用也不受调用顺序影响，并且可以有条件地调用。

- Vue 的运行时响应式系统会自动收集在计算属性和侦听器中使用的响应式依赖，因此无需手动声明依赖。

- 无需手动缓存回调函数来避免不必要的子组件更新。一般来说，Vue 的细粒度响应式系统可以确保子组件只在需要时更新。对于 Vue 开发者来说，手动优化子组件更新通常并不常见。

我们承认 React Hooks 的创造力，它也是 Composition API 的重要灵感来源。然而，上面提到的问题确实存在于它的设计中，而我们注意到 Vue 的响应式模型恰好提供了一种绕过这些问题的方式。
