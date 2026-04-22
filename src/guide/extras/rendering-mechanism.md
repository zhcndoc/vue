---
outline: deep
---

# 渲染机制 {#rendering-mechanism}

Vue 是如何将模板转换为实际的 DOM 节点的？又是如何高效地更新这些 DOM 节点的？这里我们将通过深入了解 Vue 的内部渲染机制，来尝试说明这些问题。

## 虚拟 DOM {#virtual-dom}

你可能听说过“虚拟 DOM”这个术语，Vue 的渲染系统就是建立在它之上的。

虚拟 DOM（VDOM）是一种编程概念：在内存中保留一个理想的、或“虚拟的”UI 表示，并将其与“真实”的 DOM 同步。这个概念由 [React](https://react.dev/) 首创，并已被许多其他框架采用，且实现方式各不相同，包括 Vue。

虚拟 DOM 更像是一种模式，而不是某种特定技术，因此并不存在唯一的权威实现。我们可以用一个简单的例子来说明这个概念：

```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* 更多 vnode */
  ]
}
```

这里，`vnode` 是一个普通的 JavaScript 对象（一个“虚拟节点”），表示一个 `<div>` 元素。它包含了创建实际元素所需的全部信息。它还包含更多子 vnode，因此它也是一棵虚拟 DOM 树的根节点。

运行时渲染器可以遍历一棵虚拟 DOM 树，并据此构建真实 DOM 树。这个过程称为 **挂载**。

如果我们有两份虚拟 DOM 树，渲染器也可以遍历并比较这两棵树，找出差异，并将这些变化应用到实际 DOM 上。这个过程称为 **patch**，也称为“diffing”或“reconciliation”。

虚拟 DOM 的主要优点在于，它让开发者能够以声明式的方式，程序化地创建、检查和组合所需的 UI 结构，而将直接操作 DOM 的工作留给渲染器。

## 渲染流程 {#render-pipeline}

从高层次来看，当一个 Vue 组件被挂载时，会发生以下事情：

1. **编译**：Vue 模板会被编译成 **render 函数**：返回虚拟 DOM 树的函数。这一步可以通过构建步骤提前完成，也可以通过运行时编译器即时完成。

2. **挂载**：运行时渲染器调用 render 函数，遍历其返回的虚拟 DOM 树，并据此创建实际的 DOM 节点。这一步是作为一个 [响应式 effect](./reactivity-in-depth) 执行的，因此它会追踪所有被使用到的响应式依赖。

3. **patch**：当挂载期间使用到的某个依赖发生变化时，effect 会重新运行。这时会创建一棵新的、更新后的虚拟 DOM 树。运行时渲染器会遍历新树，将其与旧树比较，并把必要的更新应用到实际 DOM 上。

![render pipeline](./images/render-pipeline.png)

<!-- https://www.figma.com/file/elViLsnxGJ9lsQVsuhwqxM/Rendering-Mechanism -->

## 模板 vs. Render 函数 {#templates-vs-render-functions}

Vue 模板会被编译成虚拟 DOM render 函数。Vue 也提供了 API，使我们可以跳过模板编译步骤，直接编写 render 函数。在处理高度动态的逻辑时，render 函数比模板更灵活，因为你可以使用 JavaScript 的全部能力来操作 vnode。

那么为什么 Vue 默认推荐使用模板呢？原因有很多：

1. 模板更接近实际的 HTML。这使得重用现有 HTML 片段、应用无障碍最佳实践、使用 CSS 进行样式设计，以及让设计师理解和修改都更加容易。

2. 由于模板语法更具确定性，因此更容易进行静态分析。这使得 Vue 的模板编译器能够应用许多编译时优化，以提升虚拟 DOM 的性能（我们将在下面讨论）。

在实践中，模板已经足以满足应用中大多数使用场景。Render 函数通常只用于那些需要处理高度动态渲染逻辑的可复用组件。关于 render 函数的使用将在 [Render Functions & JSX](./render-function) 中更详细地讨论。

## 编译器感知的虚拟 DOM {#compiler-informed-virtual-dom}

React 以及大多数其他虚拟 DOM 实现中的虚拟 DOM 实现都纯粹依赖运行时：协调算法无法对传入的虚拟 DOM 树做任何假设，因此它必须完整遍历整棵树，并 diff 每个 vnode 的 props，以确保正确性。此外，即使树中的某一部分从不改变，在每次重新渲染时它们也总会创建新的 vnode，造成不必要的内存压力。这是虚拟 DOM 最受诟病的方面之一：这种有些“蛮力”的协调过程为了声明性和正确性而牺牲了效率。

但事情并不一定非要如此。在 Vue 中，框架同时控制编译器和运行时。这使我们能够实现许多只有紧密耦合的渲染器才能利用的编译时优化。编译器可以静态分析模板，并在生成的代码中留下提示，从而让运行时在可能的情况下走捷径。同时，我们仍然保留了用户在特殊情况下下沉到 render 函数层以获得更直接控制的能力。我们将这种混合方法称为 **编译器感知的虚拟 DOM**。

下面，我们将讨论 Vue 模板编译器为提升虚拟 DOM 运行时性能所做的一些主要优化。

### 缓存静态内容 {#cache-static}

模板中经常会有不包含任何动态绑定的部分：

```vue-html{2-3}
<div>
  <div>foo</div> <!-- 已缓存 -->
  <div>bar</div> <!-- 已缓存 -->
  <div>{{ dynamic }}</div>
</div>
```

[在 Template Explorer 中查看](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PiA8IS0tIGNhY2hlZCAtLT5cbiAgPGRpdj5iYXI8L2Rpdj4gPCEtLSBjYWNoZWQgLS0+XG4gIDxkaXY+e3sgZHluYW1pYyB9fTwvZGl2PlxuPC9kaXY+XG4iLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)

`foo` 和 `bar` 这两个 div 是静态的——在每次重新渲染时重新创建 vnode 并对它们进行 diff 是没有必要的。渲染器会在初次渲染时创建这些 vnode，将它们缓存起来，并在后续每次重新渲染时复用同一组 vnode。当渲染器注意到旧 vnode 和新 vnode 是同一个时，它还能够完全跳过对它们的 diff。

此外，当连续的静态元素足够多时，它们会被压缩成一个单独的“静态 vnode”，其中包含这些节点的纯 HTML 字符串（[示例](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)）。这些静态 vnode 会通过直接设置 `innerHTML` 来挂载。

### Patch Flags {#patch-flags}

对于带有动态绑定的单个元素，我们也可以在编译期推导出很多信息：

```vue-html
<!-- 仅 class 绑定 -->
<div :class="{ active }"></div>

<!-- 仅 id 和 value 绑定 -->
<input :id="id" :value="value">

<!-- 仅文本子节点 -->
<div>{{ dynamic }}</div>
```

[在 Template Explorer 中查看](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2IDpjbGFzcz1cInsgYWN0aXZlIH1cIj48L2Rpdj5cblxuPGlucHV0IDppZD1cImlkXCIgOnZhbHVlPVwidmFsdWVcIj5cblxuPGRpdj57eyBkeW5hbWljIH19PC9kaXY+Iiwib3B0aW9ucyI6e319)

在为这些元素生成 render 函数代码时，Vue 会在 vnode 创建调用中直接编码它们各自所需的更新类型：

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)
```

最后一个参数 `2` 是一个 [patch flag](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts)。一个元素可以有多个 patch flag，这些标志会合并成一个数字。运行时渲染器随后可以使用 [位运算](https://en.wikipedia.org/wiki/Bitwise_operation) 来检查这些标志，从而判断它是否需要执行某些工作：

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // 更新元素的 class
}
```

位运算检查的速度极快。有了 patch flag，Vue 就能够在更新带有动态绑定的元素时，只做必要的最少工作。

Vue 还会编码 vnode 所具有的子节点类型。例如，一个具有多个根节点的模板会被表示为一个 fragment。在大多数情况下，我们可以确定这些根节点的顺序永远不会改变，因此也可以把这类信息作为 patch flag 提供给运行时：

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

因此，运行时可以完全跳过对根 fragment 的子节点顺序协调。

### 树扁平化 {#tree-flattening}

再看一下上一个示例生成的代码，你会注意到返回的虚拟 DOM 树的根节点是通过一个特殊的 `createElementBlock()` 调用创建的：

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

从概念上讲，一个“block”是模板中内部结构稳定的一部分。在这个例子中，整个模板就是一个 block，因为它不包含 `v-if` 和 `v-for` 之类的结构性指令。

每个 block 会追踪其所有后代节点（不只是直接子节点）中带有 patch flag 的节点。例如：

```vue-html{3,5}
<div> <!-- 根 block -->
  <div>...</div>         <!-- 不会被追踪 -->
  <div :id="id"></div>   <!-- 会被追踪 -->
  <div>                  <!-- 不会被追踪 -->
    <div>{{ bar }}</div> <!-- 会被追踪 -->
  </div>
</div>
```

其结果是得到一个扁平化数组，其中只包含动态后代节点：

```
div (block root)
- 带有 :id 绑定的 div
- 带有 {{ bar }} 绑定的 div
```

当这个组件需要重新渲染时，它只需要遍历这棵扁平化的树，而不是整棵树。这被称为 **树扁平化**，它极大减少了虚拟 DOM 协调期间需要遍历的节点数量。模板中所有静态部分实际上都会被跳过。

`v-if` 和 `v-for` 指令会创建新的 block 节点：

```vue-html
<div> <!-- 根 block -->
  <div>
    <div v-if> <!-- if block -->
      ...
    </div>
  </div>
</div>
```

子 block 会作为动态后代节点，记录在父 block 的数组中。这样可以为父 block 保持稳定的结构。

### 对 SSR Hydration 的影响 {#impact-on-ssr-hydration}

patch flag 和树扁平化也极大提升了 Vue 的 [SSR Hydration](/guide/scaling-up/ssr#client-hydration) 性能：

- 单个元素的 hydration 可以根据对应 vnode 的 patch flag 走快速路径。

- 在 hydration 期间，只需要遍历 block 节点及其动态后代节点，从而在模板层面实现了部分 hydration。
