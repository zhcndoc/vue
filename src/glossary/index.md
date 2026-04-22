# 术语表 {#glossary}

本术语表旨在就讨论 Vue 时常见的技术术语含义提供一些指导。其目的在于*描述*这些术语在日常使用中的常见含义，而不是对它们应当如何使用作出*规定*。某些术语可能会根据上下文的不同而具有略微不同的含义或细微差别。

[[TOC]]

## 异步组件 {#async-component}

*异步组件* 是对另一个组件的包装器，它允许被包装的组件以懒加载方式加载。这通常用于减小构建后的 `.js` 文件体积，使其可以拆分为更小的块，并且只在需要时才加载。

Vue Router 为 [路由组件的懒加载](https://router.vuejs.org/guide/advanced/lazy-loading.html) 提供了类似的功能，不过它并不使用 Vue 的异步组件特性。

更多详情请参见：
- [指南 - 异步组件](/guide/components/async.html)

## 编译器宏 {#compiler-macro}

*编译器宏* 是一种会被编译器处理并转换为其他内容的特殊代码。它们本质上是一种巧妙的字符串替换形式。

Vue 的 [SFC](#single-file-component) 编译器支持各种宏，例如 `defineProps()`、`defineEmits()` 和 `defineExpose()`。这些宏有意设计得看起来像普通的 JavaScript 函数，以便能够利用 JavaScript / TypeScript 周边相同的解析器和类型推导工具。不过，它们并不是会在浏览器中运行的真实函数。它们是由编译器检测并替换为真正会实际运行的 JavaScript 代码的特殊字符串。

宏在使用上有一些不适用于普通 JavaScript 代码的限制。例如，你可能会认为 `const dp = defineProps` 可以让你为 `defineProps` 创建一个别名，但实际上这会导致错误。对于 `defineProps()` 可传入的值也有一些限制，因为这些“参数”必须由编译器处理，而不是在运行时处理。

更多详情请参见：
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## 组件 {#component}

*组件* 这个术语并非 Vue 独有。它在许多 UI 框架中都很常见。它描述的是 UI 中的一块区域，例如按钮或复选框。组件也可以组合起来形成更大的组件。

组件是 Vue 提供的主要机制，用于将 UI 拆分成更小的部分，以提升可维护性并实现代码复用。

Vue 组件是一个对象。所有属性都是可选的，但组件要渲染就必须提供模板或渲染函数。例如，下列对象就是一个有效的组件：

```js
const HelloWorldComponent = {
  render() {
    return 'Hello world!'
  }
}
```

在实践中，大多数 Vue 应用都是使用 [单文件组件](#single-file-component)（`.vue` 文件）编写的。虽然这些组件乍看之下可能不像对象，但 SFC 编译器会将它们转换为一个对象，并将其作为该文件的默认导出。从外部来看，`.vue` 文件只是一个导出组件对象的 ES 模块。

组件对象的属性通常被称为*选项*。这也是 [选项式 API](#options-api) 名称的由来。

组件的选项定义了该组件的实例应当如何创建。概念上，组件与类相似，尽管 Vue 并不使用真正的 JavaScript 类来定义它们。

组件这个术语也可以更宽泛地用于指代组件实例。

更多详情请参见：
- [指南 - 组件基础](/guide/essentials/component-basics.html)

“component” 这个词也出现在其他几个术语中：
- [异步组件](#async-component)
- [动态组件](#dynamic-component)
- [函数式组件](#functional-component)
- [Web 组件](#web-component)

## 可组合函数 {#composable}

*可组合函数* 这个术语描述了 Vue 中一种常见的使用模式。它并不是 Vue 的一个单独特性，只是使用框架 [组合式 API](#composition-api) 的一种方式。

* 可组合函数是一个函数。
* 可组合函数用于封装和复用有状态逻辑。
* 函数名通常以 `use` 开头，这样其他开发者就知道它是一个可组合函数。
* 通常期望在组件的 `setup()` 函数同步执行期间调用该函数（或者等价地，在 `<script setup>` 块执行期间调用）。这将可组合函数的调用与当前组件上下文关联起来，例如通过调用 `provide()`、`inject()` 或 `onMounted()`。
* 可组合函数通常返回一个普通对象，而不是响应式对象。该对象通常包含 ref 和函数，并且预计会在调用代码中被解构。

和许多模式一样，关于某段特定代码是否符合这一标签，可能会存在一些分歧。并非所有 JavaScript 工具函数都是可组合函数。如果一个函数没有使用 Composition API，那么它很可能不是可组合函数。如果它不期望在 `setup()` 同步执行期间被调用，那么它很可能也不是可组合函数。可组合函数专门用于封装有状态逻辑，它们不只是函数的一种命名约定。

更多关于编写可组合函数的内容，请参见 [指南 - 可组合函数](/guide/reusability/composables.html)。

## 组合式 API {#composition-api}

*组合式 API* 是一组用于在 Vue 中编写组件和可组合函数的函数。

这个术语也用于描述编写组件的两种主要风格之一，另一种是 [选项式 API](#options-api)。使用组合式 API 编写的组件会使用 `<script setup>` 或显式的 `setup()` 函数。

更多详情请参见 [组合式 API FAQ](/guide/extras/composition-api-faq)。

## 自定义元素 {#custom-element}

*自定义元素* 是 [Web Components](#web-component) 标准的一项特性，并且已在现代浏览器中实现。它指的是在 HTML 标记中使用自定义 HTML 元素，以便在页面的该位置包含一个 Web 组件的能力。

Vue 内置支持渲染自定义元素，并允许它们直接用于 Vue 组件模板中。

自定义元素不应与将 Vue 组件作为标签包含在另一个 Vue 组件模板中的能力混淆。自定义元素用于创建 Web 组件，而不是 Vue 组件。

更多详情请参见：
- [指南 - Vue 与 Web Components](/guide/extras/web-components.html)

## 指令 {#directive}

*指令* 这个术语指的是以 `v-` 前缀开头的模板属性，或者它们对应的简写形式。

内置指令包括 `v-if`、`v-for`、`v-bind`、`v-on` 和 `v-slot`。

Vue 也支持创建自定义指令，不过它们通常只在作为直接操作 DOM 节点的“后门”时使用。自定义指令通常不能用来重现内置指令的功能。

更多详情请参见：
- [指南 - 模板语法 - 指令](/guide/essentials/template-syntax.html#directives)
- [指南 - 自定义指令](/guide/reusability/custom-directives.html)

## 动态组件 {#dynamic-component}

*动态组件* 用于描述这样一种情况：需要动态决定要渲染哪个子组件。通常，这是通过 `<component :is="type">` 来实现的。

动态组件并不是一种特殊的组件类型。任何组件都可以作为动态组件使用。动态的是组件的选择，而不是组件本身。

更多详情请参见：
- [指南 - 组件基础 - 动态组件](/guide/essentials/component-basics.html#dynamic-components)

## effect {#effect}

参见 [reactive effect](#reactive-effect) 和 [side effect](#side-effect)。

## 事件 {#event}

使用事件在程序的不同部分之间进行通信，是编程中许多不同领域都很常见的做法。在 Vue 中，这个术语通常既用于原生 HTML 元素事件，也用于 Vue 组件事件。`v-on` 指令用于在模板中监听这两类事件。

更多详情请参见：
- [指南 - 事件处理](/guide/essentials/event-handling.html)
- [指南 - 组件事件](/guide/components/events.html)

## Fragment {#fragment}

*fragment* 这个术语指的是一种特殊类型的 [VNode](#vnode)，它作为其他 VNode 的父级使用，但自身不会渲染任何元素。

这个名称来源于原生 DOM API 中与之类似的 [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) 概念。

Fragment 用于支持具有多个根节点的组件。虽然这类组件表面上看起来有多个根，但在幕后它们会使用一个 fragment 节点作为单一根节点，作为这些“根”节点的父节点。

模板编译器也会使用 Fragment 作为包装多个动态节点的一种方式，例如通过 `v-for` 或 `v-if` 创建的节点。这允许向 [VDOM](#virtual-dom) 的补丁算法传递额外提示。其中大部分都是内部处理的，但你可能会直接遇到的一个地方是：在使用 `v-for` 的 `<template>` 标签上使用 `key`。在这种情况下，`key` 会作为 [prop](#prop) 添加到 fragment VNode 上。

Fragment 节点目前在 DOM 中会被渲染为空文本节点，不过这只是实现细节。如果你使用 `$el`，或者尝试借助浏览器内置 API 遍历 DOM，就可能会遇到这些文本节点。

## 函数式组件 {#functional-component}

组件定义通常是一个包含选项的对象。如果你使用的是 `<script setup>`，它看起来可能并非如此，但从 `.vue` 文件导出的组件仍然会是一个对象。

*函数式组件* 是组件的一种替代形式，它改为使用一个函数来声明。该函数充当组件的 [渲染函数](#render-function)。

函数式组件不能拥有自己的状态。它也不会经历通常的组件生命周期，因此不能使用生命周期钩子。这使它们比普通的、有状态的组件更轻量一些。

更多详情请参见：
- [指南 - 渲染函数与 JSX - 函数式组件](/guide/extras/render-function.html#functional-components)

## 预提升 {#hoisting}

术语 *hoisting* 用于描述在代码执行到某一部分之前，先运行该部分代码，提前于其他代码执行。执行会被“提到”更早的位置。

JavaScript 会对某些结构使用 hoisting，例如 `var`、`import` 和函数声明。

在 Vue 的上下文中，编译器会应用 *hoisting* 来提升性能。在编译组件时，静态值会被移出组件的作用域。这些静态值被称为“hoisted”，因为它们是在组件外部创建的。

## 缓存静态内容 {#cache-static}

术语 *cache* 用于描述对经常访问的数据进行临时存储，以提升性能。

Vue 模板编译器会识别这些静态 VNode，在初次渲染期间缓存它们，并在之后的每次重新渲染中重用相同的 VNode。

更多详情请参见：
- [指南 - 渲染机制 - 缓存静态内容](/guide/extras/rendering-mechanism.html#cache-static)

## DOM 内模板 {#in-dom-template}

定义组件模板有多种方式。在大多数情况下，模板以字符串形式提供。

术语 *in-DOM template* 指的是模板以 DOM 节点形式提供，而不是字符串。然后 Vue 会使用 `innerHTML` 将 DOM 节点转换为模板字符串。

通常，in-DOM 模板最初是直接写在页面 HTML 中的 HTML 标记。浏览器随后将其解析为 DOM 节点，然后 Vue 再使用这些节点读取 `innerHTML`。

更多详情请参见：
- [指南 - 创建应用 - DOM 内根组件模板](/guide/essentials/application.html#in-dom-root-component-template)
- [指南 - 组件基础 - DOM 内模板解析注意事项](/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)
- [选项：渲染 - template](/api/options-rendering.html#template)

## 注入 {#inject}

参见 [provide / inject](#provide-inject)。

## 生命周期钩子 {#lifecycle-hooks}

Vue 组件实例会经历一个生命周期。例如，它会被创建、挂载、更新以及卸载。

*生命周期钩子* 是一种监听这些生命周期事件的方式。

使用选项式 API 时，每个钩子都作为单独的选项提供，例如 `mounted`。组合式 API 则改用函数，例如 `onMounted()`。

更多详情请参见：
- [指南 - 生命周期钩子](/guide/essentials/lifecycle.html)

## 宏 {#macro}

参见 [编译器宏](#compiler-macro)。

## 命名插槽 {#named-slot}

一个组件可以有多个插槽，并通过名称进行区分。默认插槽之外的插槽被称为 *命名插槽*。

更多详情请参见：
- [指南 - 插槽 - 命名插槽](/guide/components/slots.html#named-slots)

## 选项式 API {#options-api}

Vue 组件使用对象来定义。组件对象的属性被称为 *选项*。

组件可以用两种风格编写。一种风格将 [组合式 API](#composition-api) 与 `setup` 结合使用（通过 `setup()` 选项或 `<script setup>`）。另一种风格很少直接使用组合式 API，而是使用各种组件选项来实现类似的结果。以这种方式使用的组件选项被称为 *选项式 API*。

选项式 API 包括 `data()`、`computed`、`methods` 和 `created()` 等选项。

某些选项，例如 `props`、`emits` 和 `inheritAttrs`，在使用任一 API 编写组件时都可以使用。由于它们是组件选项，因此可以被视为选项式 API 的一部分。然而，由于这些选项也会与 `setup()` 配合使用，因此通常把它们看作两种组件风格共享的内容更有意义。

`setup()` 函数本身就是一个组件选项，所以它 *可以* 被描述为选项式 API 的一部分。然而，这并不是“选项式 API”这个术语通常的用法。相反，`setup()` 函数被认为是组合式 API 的一部分。

## 插件 {#plugin}

虽然术语 *plugin* 可以用于各种不同的上下文中，但 Vue 对插件有一个特定概念：它是一种为应用添加功能的方式。

通过调用 `app.use(plugin)` 将插件添加到应用中。插件本身要么是一个函数，要么是一个带有 `install` 函数的对象。该函数会接收应用实例，然后可以执行它需要做的任何事情。

更多详情请参见：
- [指南 - 插件](/guide/reusability/plugins.html)

## prop {#prop}

在 Vue 中，术语 *prop* 有三种常见用法：

* 组件 props
* VNode props
* 插槽 props

*组件 props* 是大多数人所理解的 props。这些由组件通过 `defineProps()` 或 `props` 选项显式定义。

术语 *VNode props* 指的是传递给 `h()` 第二个参数的对象属性。这些属性可以包括组件 props，也可以包括组件事件、DOM 事件、DOM 属性和 DOM property。通常只有在使用渲染函数直接操作 VNode 时，才会接触到 VNode props。

*Slot props* 是传递给作用域插槽的属性。

在所有情况下，props 都是从别处传入的属性。

虽然单词 props 源自 *properties*，但在 Vue 的上下文中，props 具有更具体的含义。你应避免把它用作 properties 的缩写。

更多详情请参见：
- [指南 - Props](/guide/components/props.html)
- [指南 - 渲染函数与 JSX](/guide/extras/render-function.html)
- [指南 - 插槽 - 作用域插槽](/guide/components/slots.html#scoped-slots)

## provide / inject {#provide-inject}

`provide` 和 `inject` 是一种组件间通信形式。

当某个组件 *提供* 一个值时，该组件的所有后代都可以选择使用 `inject` 获取这个值。与 props 不同，提供值的组件并不知道到底是哪个组件正在接收这个值。

`provide` 和 `inject` 有时用于避免 *prop drilling*。它们也可以作为一种隐式方式，让组件与其插槽内容进行通信。

`provide` 也可以在应用级别使用，使某个值对该应用中的所有组件可用。

更多详情请参见：
- [指南 - provide / inject](/guide/components/provide-inject.html)

## 响应式副作用 {#reactive-effect}

*响应式副作用* 是 Vue 响应式系统的一部分。它指的是跟踪某个函数依赖项的过程，并在这些依赖项的值发生变化时重新运行该函数。

`watchEffect()` 是创建副作用最直接的方式。Vue 的其他多个部分在内部也会使用副作用，例如组件渲染更新、`computed()` 和 `watch()`。

Vue 只能在响应式副作用内部跟踪响应式依赖。如果在响应式副作用之外读取某个属性的值，它就会“失去”响应性，意思是如果该属性随后发生变化，Vue 不会知道该如何处理。

这个术语来源于“side effect（副作用）”。调用副作用函数是属性值发生变化所产生的一个副作用。

更多详情请参见：
- [指南 - 深入响应式系统](/guide/extras/reactivity-in-depth.html)

## 响应性 {#reactivity}

一般来说，*reactivity* 指的是能够根据数据变化自动执行操作的能力。例如，当数据值变化时更新 DOM 或发起网络请求。

在 Vue 的上下文中，reactivity 用于描述一组功能。这些功能组合起来形成一个 *响应式系统*，并通过 [Reactivity API](#reactivity-api) 暴露出来。

响应式系统可以通过多种不同方式实现。例如，可以通过对代码进行静态分析来确定其依赖项。然而，Vue 并不采用这种响应式系统形式。

相反，Vue 的响应式系统会在运行时跟踪属性访问。它通过 Proxy 包装器以及属性的 [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)/[setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) 函数来实现这一点。

更多详情请参见：
- [指南 - 响应式基础](/guide/essentials/reactivity-fundamentals.html)
- [指南 - 深入响应式系统](/guide/extras/reactivity-in-depth.html)

## 响应式 API {#reactivity-api}

*Reactivity API* 是一组与 [响应性](#reactivity) 相关的 Vue 核心函数。这些函数可以独立于组件使用。它包括 `ref()`、`reactive()`、`computed()`、`watch()` 和 `watchEffect()` 等函数。

Reactivity API 是组合式 API 的子集。

更多详情请参见：
- [响应式 API：核心](/api/reactivity-core.html)
- [响应式 API：工具](/api/reactivity-utilities.html)
- [响应式 API：进阶](/api/reactivity-advanced.html)

## ref {#ref}

> 本条目讲的是 `ref` 在响应式中的用法。对于模板中使用的 `ref` 属性，请改看 [模板 ref](#template-ref)。

`ref` 是 Vue 响应式系统的一部分。它是一个对象，只有一个响应式属性，名为 `value`。

ref 有多种不同类型。例如，可以使用 `ref()`、`shallowRef()`、`computed()` 和 `customRef()` 创建 ref。函数 `isRef()` 可用于检查一个对象是否为 ref，而 `isReadonly()` 可用于检查该 ref 是否允许直接重新赋值其值。

更多详情请参见：
- [指南 - 响应式基础](/guide/essentials/reactivity-fundamentals.html)
- [响应式 API：核心](/api/reactivity-core.html)
- [响应式 API：工具](/api/reactivity-utilities.html)
- [响应式 API：进阶](/api/reactivity-advanced.html)

## 渲染函数 {#render-function}

*渲染函数* 是组件中用于生成渲染期间所使用的 VNode 的部分。模板会被编译为渲染函数。

更多详情请参见：
- [指南 - 渲染函数与 JSX](/guide/extras/render-function.html)

## scheduler {#scheduler}

*scheduler* 是 Vue 内部的一部分，用于控制 [reactive effects](#reactive-effect) 运行的时机。

当响应式状态发生变化时，Vue 不会立即触发渲染更新。相反，它会使用队列将这些更新批量处理。这样可以确保组件即使在底层数据发生多次变化时，也只会重新渲染一次。

[Watchers](/guide/essentials/watchers.html) 也会通过 scheduler 队列进行批量处理。`flush: 'pre'`（默认值）的 Watchers 会在组件渲染之前运行，而 `flush: 'post'` 的 Watchers 则会在组件渲染之后运行。

scheduler 中的任务还用于执行其他各种内部任务，例如触发某些 [lifecycle hooks](#lifecycle-hooks) 以及更新 [template refs](#template-ref)。

## scoped slot {#scoped-slot}

术语 *scoped slot* 用于指代接收 [props](#prop) 的 [slot](#slot)。

从历史上看，Vue 对 scoped slot 和非 scoped slot 的区分要大得多。在某种程度上，它们可以被视为两个独立的特性，只是通过共同的模板语法统一起来。

在 Vue 3 中，slot API 被简化，使所有 slot 的行为都像 scoped slot 一样。然而，scoped slot 和非 scoped slot 的使用场景通常不同，因此该术语仍然很有用，可用于指代带有 props 的 slot。

传递给 slot 的 props 只能在父模板中的特定区域内使用，该区域负责定义 slot 的内容。该模板区域对这些 props 来说表现得像一个变量作用域，因此称为“scoped slot”。

更多详情请参见：
- [Guide - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

参见 [Single-File Component](#single-file-component)。

## side effect {#side-effect}

术语 *side effect* 并非 Vue 所特有。它用于描述那些会在其局部作用域之外产生影响的操作或函数。

例如，在设置属性如 `user.name = null` 的上下文中，预期这会改变 `user.name` 的值。如果它还做了别的事情，比如触发 Vue 的响应式系统，那么这就会被称为副作用。这也是 Vue 中 [reactive effect](#reactive-effect) 一词的来源。

当一个函数被描述为具有副作用时，意思是该函数除了返回一个值之外，还会执行某种在函数外部可观察到的操作。这可能意味着它会更新状态中的某个值，或者发起网络请求。

这个术语常用于描述渲染或计算属性。最佳实践是让渲染过程没有副作用。同样，计算属性的 getter 函数也不应有副作用。

## Single-File Component {#single-file-component}

术语 *Single-File Component*，或 SFC，指的是 Vue 组件中常用的 `.vue` 文件格式。

另请参见：
- [Guide - Single-File Components](/guide/scaling-up/sfc.html)
- [SFC Syntax Specification](/api/sfc-spec.html)

## slot {#slot}

slot 用于向子组件传递内容。props 用于传递数据值，而 slot 用于传递更丰富的内容，包括 HTML 元素和其他 Vue 组件。

更多详情请参见：
- [Guide - Slots](/guide/components/slots.html)

## template ref {#template-ref}

术语 *template ref* 指的是在模板中的某个标签上使用 `ref` 属性。组件渲染后，该属性用于填充对应的属性，其值可以是与模板中该标签对应的 HTML 元素或组件实例。

如果你使用的是 Options API，那么 refs 会通过 `$refs` 对象的属性暴露出来。

使用 Composition API 时，template ref 会填充一个同名的响应式 [ref](#ref)。

template ref 不应与 Vue 响应式系统中的响应式 refs 混淆。

更多详情请参见：
- [Guide - Template Refs](/guide/essentials/template-refs.html)

## VDOM {#vdom}

参见 [virtual DOM](#virtual-dom)。

## virtual DOM {#virtual-dom}

术语 *virtual DOM*（VDOM）并非 Vue 独有。它是多个 Web 框架用于管理 UI 更新的一种常见方法。

浏览器使用由节点组成的树来表示页面的当前状态。该树，以及用于与之交互的 JavaScript API，被称为 *document object model*，简称 *DOM*。

操作 DOM 是一个主要的性能瓶颈。virtual DOM 提供了一种管理它的策略。

Vue 组件不会直接创建 DOM 节点，而是生成一个它们希望得到的 DOM 节点描述。这些描述是普通的 JavaScript 对象，称为 VNodes（virtual DOM nodes）。创建 VNodes 的成本相对较低。

每次组件重新渲染时，都会将新的 VNodes 树与之前的 VNodes 树进行比较，然后把任何差异应用到真实 DOM 上。如果没有任何变化，就不需要触碰 DOM。

Vue 采用一种混合方法，我们称之为 [Compiler-Informed Virtual DOM](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom)。Vue 的模板编译器能够基于模板的静态分析应用性能优化。与其在运行时对组件旧的和新的 VNode 树进行完整比较，Vue 可以使用编译器提取的信息，将比较范围缩小到实际可能发生变化的树中部分。

更多详情请参见：
- [Guide - Rendering Mechanism](/guide/extras/rendering-mechanism.html)
- [Guide - Render Functions & JSX](/guide/extras/render-function.html)

## VNode {#vnode}

*VNode* 是 *virtual DOM node*。它们可以使用 [`h()`](/api/render-function.html#h) 函数创建。

更多信息请参见 [virtual DOM](#virtual-dom)。

## Web Component {#web-component}

*Web Components* 标准是一组在现代 Web 浏览器中实现的特性集合。

Vue 组件不是 Web Components，但可以使用 `defineCustomElement()` 从 Vue 组件创建一个 [custom element](#custom-element)。Vue 也支持在 Vue 组件内部使用 custom element。

更多详情请参见：
- [Guide - Vue and Web Components](/guide/extras/web-components.html)
