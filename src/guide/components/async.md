# 异步组件 {#async-components}

## 基本用法 {#basic-usage}

在大型应用中，我们可能需要将应用拆分成更小的块，只在需要时才从服务器加载组件。为了实现这一点，Vue 提供了一个 [`defineAsyncComponent`](/api/general#defineasynccomponent) 函数：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器加载组件
    resolve(/* 已加载的组件 */)
  })
})
// ... 像普通组件一样使用 `AsyncComp`
```

如你所见，`defineAsyncComponent` 接受一个返回 Promise 的加载函数。当你从服务器获取到组件定义后，应调用该 Promise 的 `resolve` 回调。你也可以调用 `reject(reason)` 来表示加载失败。

[ES 模块动态导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 也会返回一个 Promise，因此大多数时候我们会将它与 `defineAsyncComponent` 结合使用。像 Vite 和 webpack 这样的打包工具也支持这种语法（并且会将其用作代码分割点），所以我们可以用它来导入 Vue 单文件组件：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

生成的 `AsyncComp` 是一个包装组件，它只会在真正渲染到页面上时才调用加载函数。此外，它会将所有 props 和插槽传递给内部组件，因此你可以使用这个异步包装器无缝替换原始组件，同时实现懒加载。

与普通组件一样，异步组件也可以通过 `app.component()` 进行[全局注册](/guide/components/registration#global-registration)：

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

你也可以在[局部注册组件](/guide/components/registration#local-registration)时使用 `defineAsyncComponent`：

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

它们也可以直接在其父组件内部定义：

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## 加载和错误状态 {#loading-and-error-states}

异步操作不可避免地会涉及加载和错误状态——`defineAsyncComponent()` 通过高级选项支持处理这些状态：

```js
const AsyncComp = defineAsyncComponent({
  // 加载器函数
  loader: () => import('./Foo.vue'),

  // 异步组件加载时使用的组件
  loadingComponent: LoadingComponent,
  // 显示加载组件前的延迟。默认值：200ms。
  delay: 200,

  // 加载失败时使用的组件
  errorComponent: ErrorComponent,
  // 如果提供了超时并且超过该时间，则会显示错误组件。
  // 默认值：Infinity。
  timeout: 3000
})
```

如果提供了加载组件，它会在内部组件加载期间首先显示。加载组件显示前默认会有 200ms 的延迟——这是因为在快速网络下，立即显示的加载状态可能会很快被替换掉，最终看起来像闪烁。

如果提供了错误组件，当加载函数返回的 Promise 被拒绝时，它会被显示。你也可以指定一个超时时间，以便在请求耗时过长时显示错误组件。

## 懒加载水合 <sup class="vt-badge" data-text="3.5+" /> {#lazy-hydration}

> 本节仅适用于你正在使用[服务端渲染](/guide/scaling-up/ssr)的情况。

在 Vue 3.5+ 中，异步组件可以通过提供一个水合策略来控制其何时被水合。

- Vue 提供了若干内置水合策略。这些内置策略需要分别导入，这样在未使用时才能被 tree-shaking。

- 这种设计有意保持底层，以提供灵活性。未来，编译器语法糖可以在核心层或更高层级的解决方案（例如 Nuxt）之上构建。

### 在空闲时水合 {#hydrate-on-idle}

通过 `requestIdleCallback` 进行水合：

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* 可选地传入一个最大超时时间 */)
})
```

### 在可见时水合 {#hydrate-on-visible}

当元素通过 `IntersectionObserver` 变为可见时进行水合。

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

可选地为观察器传入一个选项对象：

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### 在媒体查询匹配时水合 {#hydrate-on-media-query}

当指定的媒体查询匹配时进行水合。

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### 在交互时水合 {#hydrate-on-interaction}

当组件元素上触发指定事件时进行水合。触发水合的事件在水合完成后也会被重新回放。

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

也可以是多个事件类型的列表：

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### 自定义策略 {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement 是一个辅助函数，用于遍历所有根元素
  // 在组件未水合的 DOM 中，因为根节点可以是片段
  // 而不是单个元素
  forEachElement(el => {
    // ...
  })
  // 准备好后调用 `hydrate`
  hydrate()
  return () => {
    // 如有需要，返回一个清理函数
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## 与 Suspense 一起使用 {#using-with-suspense}

异步组件可以与内置组件 `<Suspense>` 一起使用。`<Suspense>` 和异步组件之间的交互已在[专门的 `<Suspense>` 章节](/guide/built-ins/suspense)中记录。
