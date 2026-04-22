---
outline: deep
---

# Suspense {#suspense}

:::warning 实验性功能
`<Suspense>` 是一个实验性功能。它不保证会达到稳定状态，并且其 API 可能会在此之前发生变化。
:::

`<Suspense>` 是一个内置组件，用于协调组件树中的异步依赖。它可以在等待组件树下多个嵌套异步依赖解析完成时渲染加载状态。

## 异步依赖 {#async-dependencies}

为了解释 `<Suspense>` 要解决的问题以及它如何与这些异步依赖交互，我们先来设想如下这样的组件层级：

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus> (带有 async setup() 的组件)
   └─ <Content>
      ├─ <ActivityFeed> (异步组件)
      └─ <Stats> (异步组件)
```

在组件树中，有多个嵌套组件的渲染都依赖于某个异步资源先被解析完成。如果没有 `<Suspense>`，它们每个都需要自己处理加载 / 错误 / 已加载状态。在最糟糕的情况下，我们可能会在页面上看到三个加载中的转圈提示，而内容则在不同时间分别显示出来。

`<Suspense>` 组件让我们能够在等待这些嵌套异步依赖解析完成时，显示顶层的加载 / 错误状态。

`<Suspense>` 可以等待两种类型的异步依赖：

1. 带有 async `setup()` 钩子的组件。这包括使用 `<script setup>` 且包含顶层 `await` 表达式的组件。

2. [异步组件](/guide/components/async)。

### `async setup()` {#async-setup}

Composition API 组件的 `setup()` 钩子可以是异步的：

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

如果使用 `<script setup>`，顶层 `await` 表达式的存在会自动使组件成为一个异步依赖：

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### 异步组件 {#async-components}

异步组件默认是 **“可被 Suspense 处理的”**。这意味着，如果其父链中存在 `<Suspense>`，它就会被视为该 `<Suspense>` 的一个异步依赖。在这种情况下，加载状态将由 `<Suspense>` 来控制，而组件自身的 loading、error、delay 和 timeout 选项都会被忽略。

异步组件可以选择不受 `Suspense` 控制，只需在其选项中指定 `suspensible: false`，这样组件就会始终自行控制其加载状态。

## 加载状态 {#loading-state}

`<Suspense>` 组件有两个插槽：`#default` 和 `#fallback`。这两个插槽都只允许有 **一个** 直接子节点。默认插槽中的节点会在可能时显示；如果不能，则会显示 fallback 插槽中的节点。

```vue-html
<Suspense>
  <!-- 带有嵌套异步依赖的组件 -->
  <Dashboard />

  <!-- 通过 #fallback 插槽提供的加载状态 -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

在初始渲染时，`<Suspense>` 会在内存中渲染其默认插槽内容。如果在此过程中遇到任何异步依赖，它就会进入 **pending** 状态。在 pending 状态期间，会显示 fallback 内容。当遇到的所有异步依赖都解析完成后，`<Suspense>` 会进入 **resolved** 状态，并显示已解析完成的默认插槽内容。

如果在初始渲染期间没有遇到任何异步依赖，`<Suspense>` 将直接进入 resolved 状态。

一旦进入 resolved 状态，只有当 `#default` 插槽的根节点被替换时，`<Suspense>` 才会重新回到 pending 状态。树中更深层的新异步依赖 **不会** 导致 `<Suspense>` 回到 pending 状态。

当发生回退时，fallback 内容不会立即显示。相反，`<Suspense>` 会在等待新内容及其异步依赖解析完成期间，先显示之前的 `#default` 内容。这个行为可以通过 `timeout` 属性来配置：如果渲染新的默认内容所花费的时间超过 `timeout` 毫秒，`<Suspense>` 就会切换到 fallback 内容。将 `timeout` 设为 `0` 会使得在默认内容被替换时立即显示 fallback 内容。

## 事件 {#events}

`<Suspense>` 组件会发出 3 个事件：`pending`、`resolve` 和 `fallback`。`pending` 事件在进入 pending 状态时触发。`resolve` 事件在 `default` 插槽中的新内容完成解析时触发。`fallback` 事件在显示 `fallback` 插槽内容时触发。

例如，这些事件可用于在新组件加载时，在旧 DOM 前面显示一个加载指示器。

## 错误处理 {#error-handling}

`<Suspense>` 目前不通过组件本身提供错误处理——不过，你可以使用 [`errorCaptured`](/api/options-lifecycle#errorcaptured) 选项或 [`onErrorCaptured()`](/api/composition-api-lifecycle#onerrorcaptured) 钩子，在 `<Suspense>` 的父组件中捕获并处理异步错误。

## 与其他组件结合使用 {#combining-with-other-components}

通常会希望将 `<Suspense>` 与 [`<Transition>`](./transition) 和 [`<KeepAlive>`](./keep-alive) 组件组合使用。这些组件的嵌套顺序对于让它们都正常工作非常重要。

此外，这些组件通常还会与来自 [Vue Router](https://router.vuejs.org/) 的 `<RouterView>` 组件一起使用。

下面的示例展示了如何嵌套这些组件，以便它们都能按预期工作。对于更简单的组合，你可以移除不需要的组件：

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 主内容 -->
          <component :is="Component"></component>

          <!-- 加载状态 -->
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

Vue Router 原生支持使用动态导入来[延迟加载组件](https://router.vuejs.org/guide/advanced/lazy-loading.html)。这与异步组件不同，目前它们不会触发 `<Suspense>`。不过，它们的后代仍然可以包含异步组件，而这些异步组件会像平常一样触发 `<Suspense>`。

## 嵌套 Suspense {#nested-suspense}

- 仅在 3.3+ 中支持

当我们有多个异步组件（常见于嵌套路由或基于布局的路由）时，像这样：

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
```

`<Suspense>` 会创建一个边界，按预期解析树中的所有异步组件。不过，当我们更改 `DynamicAsyncOuter` 时，`<Suspense>` 会正确等待它；但当我们更改 `DynamicAsyncInner` 时，嵌套的 `DynamicAsyncInner` 会渲染一个空节点，直到它解析完成为止（而不是显示之前的那个节点或 fallback 插槽）。

为了解决这个问题，我们可以使用嵌套的 suspense 来处理嵌套组件的补丁，例如：

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- 这里 -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
```

如果你不设置 `suspensible` 属性，内部的 `<Suspense>` 会被父级 `<Suspense>` 当作同步组件处理。这意味着它有自己的 fallback 插槽，并且如果两个 `Dynamic` 组件同时发生变化，在子级 `<Suspense>` 加载其自身的依赖树时，可能会出现空节点以及多次补丁循环，这通常并不理想。设置该属性后，所有异步依赖处理都会交给父级 `<Suspense>`（包括触发的事件），而内部的 `<Suspense>` 仅作为依赖解析和补丁的另一道边界。

---

**相关内容**

- [`<Suspense>` API 参考](/api/built-in-components#suspense)
