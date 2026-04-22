---
outline: deep
---

# 性能 {#performance}

## 概览 {#overview}

Vue 的设计目标是在大多数常见用例中都能保持高性能，而不需要太多手动优化。然而，总会有一些具有挑战性的场景需要额外的精细调优。在这一节中，我们将讨论在 Vue 应用中涉及性能时你应该关注什么。

首先，让我们讨论 Web 性能的两个主要方面：

- **页面加载性能**：应用在首次访问时显示内容并变得可交互的速度有多快。通常使用诸如 [Largest Contentful Paint (LCP)](https://web.dev/lcp/) 和 [Interaction to Next Paint](https://web.dev/articles/inp) 之类的 Web Vital 指标来衡量。

- **更新性能**：应用响应用户输入并进行更新的速度有多快。例如，当用户在搜索框中输入时列表更新的速度，或者在单页应用（SPA）中用户点击导航链接时页面切换的速度。

虽然理想情况下两者都应尽量优化，但不同的前端架构往往会影响在这些方面达到预期性能的难易程度。此外，你正在构建的应用类型也会极大影响你在性能方面应优先考虑什么。因此，确保最佳性能的第一步，是为你正在构建的应用类型选择合适的架构：

- 查阅 [Vue 的使用方式](/guide/extras/ways-of-using-vue)，了解你可以如何以不同方式利用 Vue。

- Jason Miller 在 [Application Holotypes](https://jasonformat.com/application-holotypes/) 中讨论了 Web 应用的类型及其各自理想的实现 / 交付方式。

## 性能分析选项 {#profiling-options}

要提升性能，我们首先需要知道如何衡量它。有许多出色的工具可以在这方面提供帮助：

用于分析生产环境部署的加载性能：

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

用于在本地开发期间分析性能：

- [Chrome DevTools Performance 面板](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) 会在 Chrome DevTools 的性能时间线中启用 Vue 专属的性能标记。
- [Vue DevTools 扩展](/guide/scaling-up/tooling#browser-devtools) 也提供性能分析功能。

## 页面加载优化 {#page-load-optimizations}

用于优化页面加载性能的方法有很多是与框架无关的 —— 请查看 [这份 web.dev 指南](https://web.dev/fast/) 获取全面的总结。在这里，我们主要关注 Vue 特有的技巧。

### 选择合适的架构 {#choosing-the-right-architecture}

如果你的场景对页面加载性能很敏感，避免将其作为纯客户端 SPA 发布。你希望服务器直接发送包含用户想看到内容的 HTML。纯客户端渲染会受到较慢的内容可见时间影响。可以通过 [服务端渲染（SSR）](/guide/extras/ways-of-using-vue#fullstack-ssr) 或 [静态站点生成（SSG）](/guide/extras/ways-of-using-vue#jamstack-ssg) 来缓解这一问题。查看 [SSR 指南](/guide/scaling-up/ssr) 了解如何使用 Vue 进行 SSR。如果你的应用并不需要丰富的交互能力，你也可以使用传统后端服务器来渲染 HTML，并在客户端用 Vue 对其进行增强。

如果你的主应用必须是 SPA，但还有营销页面（落地页、关于页、博客），请把它们分开部署！你的营销页面理想情况下应该通过 SSG 以几乎没有 JS 的静态 HTML 形式部署。

### 包体积与 Tree-shaking {#bundle-size-and-tree-shaking}

提升页面加载性能最有效的方法之一是发布更小的 JavaScript 包。以下是在使用 Vue 时减小包体积的一些方法：

- 如果可能，使用构建步骤。

  - 通过现代构建工具打包时，Vue 的许多 API 都是["可被 tree-shaking 的"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)。例如，如果你没有使用内置的 `<Transition>` 组件，它就不会被包含在最终的生产包中。Tree-shaking 也可以移除源代码中其他未使用的模块。

  - 使用构建步骤时，模板会被预编译，因此我们不需要把 Vue 编译器一起发送到浏览器。这可以节省 **14kb** 的 min+gzipped JavaScript，并避免运行时编译的开销。

- 在引入新依赖时要注意体积！在真实世界的应用中，臃肿的包体积最常见的原因往往是引入了沉重的依赖却没有意识到。

  - 如果使用构建步骤，优先选择提供 ES module 格式且有利于 tree-shaking 的依赖。例如，优先使用 `lodash-es` 而不是 `lodash`。

  - 检查依赖的体积，并评估它提供的功能是否值得。注意，如果该依赖对 tree-shaking 友好，实际增加的体积将取决于你从中实际导入了哪些 API。像 [bundlejs.com](https://bundlejs.com/) 这样的工具可用于快速检查，但使用你实际的构建配置进行测量始终是最准确的。

- 如果你主要将 Vue 用于渐进式增强，并倾向于避免使用构建步骤，可以考虑改用 [petite-vue](https://github.com/vuejs/petite-vue)（只有 **6kb**）。

### 代码分割 {#code-splitting}

代码分割是指构建工具将应用包拆分为多个更小的 chunk，然后可以按需或并行加载。通过适当的代码分割，页面加载时所需的功能可以立即下载，而额外的 chunk 只在需要时才懒加载，从而提升性能。

像 Rollup（Vite 就是基于它）或 webpack 这样的打包工具，可以通过检测 ESM 动态导入语法自动创建拆分 chunk：

```js
// lazy.js 及其依赖会被拆分到一个独立的 chunk 中
// 并且只会在调用 `loadLazy()` 时加载。
function loadLazy() {
  return import('./lazy.js')
}
```

懒加载最适合用于在初始页面加载后并不立即需要的功能。在 Vue 应用中，这可以与 Vue 的 [异步组件](/guide/components/async) 特性结合起来，为组件树创建拆分 chunk：

```js
import { defineAsyncComponent } from 'vue'

// 为 Foo.vue 及其依赖创建一个独立的 chunk。
// 它只会在异步组件在页面上被渲染时按需获取。
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

对于使用 Vue Router 的应用，强烈建议对路由组件使用懒加载。Vue Router 对懒加载有显式支持，与 `defineAsyncComponent` 分开。更多细节请参见 [路由懒加载](https://router.vuejs.org/guide/advanced/lazy-loading.html)。

## 更新优化 {#update-optimizations}

### Props 稳定性 {#props-stability}

在 Vue 中，子组件只有在其接收到的 props 中至少有一个发生变化时才会更新。考虑下面的示例：

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

在 `<ListItem>` 组件内部，它使用 `id` 和 `activeId` 这两个 props 来判断自己是否是当前激活的项。虽然这样可行，但问题在于，只要 `activeId` 发生变化，列表中的 **每一个** `<ListItem>` 都必须更新！

理想情况下，只有那些激活状态发生变化的项才应该更新。我们可以把激活状态的计算移到父组件中，并让 `<ListItem>` 直接接收 `active` prop：

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

现在，对于大多数组件来说，当 `activeId` 变化时，`active` prop 仍然保持不变，因此它们不再需要更新。一般来说，核心思想是让传递给子组件的 props 尽可能保持稳定。

### `v-once` {#v-once}

`v-once` 是一个内置指令，可用于渲染依赖运行时数据但永远不需要更新的内容。它所在的整个子树在后续所有更新中都会被跳过。更多细节请参见其 [API 参考](/api/built-in-directives#v-once)。

### `v-memo` {#v-memo}

`v-memo` 是一个内置指令，可用于有条件地跳过大型子树或 `v-for` 列表的更新。更多细节请参见其 [API 参考](/api/built-in-directives#v-memo)。

### 计算属性稳定性 {#computed-stability}

在 Vue 3.4 及以上版本中，计算属性只有在其计算结果与上一次相比发生变化时才会触发副作用。例如，下面的 `isEven` 计算属性只有在返回值从 `true` 变为 `false`，或反过来时才会触发副作用：

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// 不会触发新的日志，因为计算结果保持为 `true`
count.value = 2
count.value = 4
```

这减少了不必要的副作用触发，但不幸的是，如果计算属性在每次计算时都会创建一个新对象，这种优化就不起作用了：

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

因为每次都会创建一个新对象，所以从技术上讲，新值总是与旧值不同。即使 `isEven` 属性保持不变，Vue 也无法知道这一点，除非它对旧值和新值进行深度比较。这样的比较可能很昂贵，而且很可能不值得。

相反，我们可以通过手动比较新值与旧值来优化这一点，并在确认没有任何变化时有条件地返回旧值：

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[在 playground 中试试](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

请注意，你应该始终先执行完整计算，再进行比较并返回旧值，这样每次运行都能收集到相同的依赖项。

## 通用优化 {#general-optimizations}

> 以下技巧会同时影响页面加载和更新性能。

### 对大列表进行虚拟化 {#virtualize-large-lists}

在所有前端应用中，最常见的性能问题之一就是渲染大型列表。无论一个框架有多高效，由于浏览器需要处理的 DOM 节点数量实在太多，渲染一个包含成千上万项的列表**一定**会很慢。

不过，我们并不一定要一开始就渲染所有这些节点。在大多数情况下，用户的屏幕尺寸只能显示大型列表中的一小部分。我们可以通过**列表虚拟化**显著提升性能：这种技术只渲染大型列表中当前位于视口内或接近视口的项目。

实现列表虚拟化并不容易，好在已经有一些现成的社区库可以直接使用：

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### 降低大型不可变结构的响应式开销 {#reduce-reactivity-overhead-for-large-immutable-structures}

Vue 的响应式系统默认是深层的。虽然这让状态管理更直观，但当数据量很大时，它确实会带来一定开销，因为每次属性访问都会触发用于依赖追踪的代理陷阱。这通常在处理深层嵌套对象的大型数组时会变得明显，因为一次渲染可能需要访问 100,000+ 个属性，因此它只应影响非常特定的使用场景。

Vue 确实提供了一个退出深层响应式的方式，可以使用 [`shallowRef()`](/api/reactivity-advanced#shallowref) 和 [`shallowReactive()`](/api/reactivity-advanced#shallowreactive)。浅层 API 创建的状态只在根级别具有响应式能力，并且会原样暴露所有嵌套对象。这样可以保持嵌套属性访问的速度，但代价是我们现在必须把所有嵌套对象都视为不可变对象，并且更新只能通过替换根状态来触发：

```js
const shallowArray = shallowRef([
  /* 深层对象的大列表 */
])

// 这不会触发更新...
shallowArray.value.push(newObject)
// 这会：
shallowArray.value = [...shallowArray.value, newObject]

// 这不会触发更新...
shallowArray.value[0].foo = 1
// 这会：
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### 避免不必要的组件抽象 {#avoid-unnecessary-component-abstractions}

有时我们会创建[无渲染组件](/guide/components/slots#renderless-components)或高阶组件（即用额外 props 渲染其他组件的组件），以获得更好的抽象效果或代码组织方式。虽然这样做并没有问题，但请记住，组件实例比普通 DOM 节点昂贵得多，因为抽象模式创建了过多组件实例会带来性能成本。

需要注意的是，只减少少量实例不会产生明显影响，所以如果组件在应用中只渲染了几次，就不必过于担心。最值得考虑这种优化的场景仍然是大型列表。想象一个有 100 项的列表，其中每个条目组件都包含许多子组件。在这里移除一个不必要的组件抽象，可能会减少数百个组件实例。
