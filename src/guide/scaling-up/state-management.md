# 状态管理 {#state-management}

## 什么是状态管理？ {#what-is-state-management}

从技术上讲，任何 Vue 组件实例已经在“管理”自己的响应式状态了。以一个简单的计数器组件为例：

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// 状态
const count = ref(0)

// 操作
function increment() {
  count.value++
}
</script>

<!-- 视图 -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // 状态
  data() {
    return {
      count: 0
    }
  },
  // 操作
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- 视图 -->
<template>{{ count }}</template>
```

</div>

它是一个自包含的单元，包含以下部分：

- **状态**，驱动我们应用的事实来源；
- **视图**，对**状态**的声明式映射；
- **操作**，状态可能因响应来自**视图**的用户输入而发生变化的方式。

这是对“一种单向数据流”概念的简单表示：

<p style="text-align: center">
  <img alt="state flow diagram" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

然而，当我们有**多个共享同一状态的组件**时，这种简单性就开始失效了：

1. 多个视图可能依赖于同一份状态。
2. 来自不同视图的操作可能需要修改同一份状态。

对于第一种情况，一种可行的变通方法是将共享状态“提升”到一个共同的祖先组件，然后再作为 props 向下传递。然而，在层级很深的组件树中，这很快就会变得繁琐，从而引出另一个问题，即 [Prop Drilling](/guide/components/provide-inject#prop-drilling)。

对于第二种情况，我们往往会求助于一些方案，例如通过模板引用直接获取父/子实例，或者尝试通过派发事件来修改并同步多份状态副本。这两种模式都很脆弱，并且很快会导致代码难以维护。

一种更简单直接的解决方案是将共享状态从组件中抽离出来，放到一个全局单例中进行管理。这样一来，我们的组件树就变成了一个巨大的“视图”，任何组件都可以访问状态或触发操作，不管它们在树中的什么位置！

## 使用响应式 API 进行简单的状态管理 {#simple-state-management-with-reactivity-api}

<div class="options-api">

在 Options API 中，响应式数据通过 `data()` 选项声明。在内部，`data()` 返回的对象会通过 [`reactive()`](/api/reactivity-core#reactive) 函数变成响应式对象，而该函数也作为公共 API 可用。

</div>

如果你有一份需要被多个实例共享的状态，可以使用 [`reactive()`](/api/reactivity-core#reactive) 创建一个响应式对象，然后将其导入到多个组件中：

```js [store.js]
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue [ComponentA.vue]
<script setup>
import { store } from './store.js'
</script>

<template>来自 A：{{ store.count }}</template>
```

```vue [ComponentB.vue]
<script setup>
import { store } from './store.js'
</script>

<template>来自 B：{{ store.count }}</template>
```

</div>
<div class="options-api">

```vue [ComponentA.vue]
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>来自 A：{{ store.count }}</template>
```

```vue [ComponentB.vue]
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>来自 B：{{ store.count }}</template>
```

</div>

现在，每当 `store` 对象发生变动时，`<ComponentA>` 和 `<ComponentB>` 都会自动更新各自的视图——我们现在有了单一事实来源。

不过，这也意味着任何导入了 `store` 的组件都可以随意修改它：

```vue-html{2}
<template>
  <button @click="store.count++">
    来自 B：{{ store.count }}
  </button>
</template>
```

虽然这在简单场景下可行，但一个可以被任何组件任意修改的全局状态，长期来看并不容易维护。为了确保状态修改逻辑与状态本身一样集中管理，建议在 store 上定义一些方法，并使用能够表达操作意图的名称：

```js{5-7} [store.js]
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    来自 B：{{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd1csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9kasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyX/IftlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip
注意点击处理函数使用的是带括号的 `store.increment()`——这很必要，因为这样才能以正确的 `this` 上下文调用该方法；由于它不是组件方法，所以必须这样做。
:::

虽然这里我们使用的是一个单独的响应式对象作为 store，但你也可以共享使用其他 [响应式 API](/api/reactivity-core) 创建的响应式状态，例如 `ref()` 或 `computed()`，甚至可以从一个 [可组合函数](/guide/reusability/composables) 中返回全局状态：

```js
import { ref } from 'vue'

// 全局状态，在模块作用域中创建
const globalCount = ref(1)

export function useCount() {
  // 局部状态，每个组件分别创建
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

Vue 的响应式系统与组件模型相互解耦，这使得它具有极高的灵活性。

## SSR 注意事项 {#ssr-considerations}

如果你正在构建一个使用了 [服务端渲染（SSR）](./ssr) 的应用，那么由于 store 是在多个请求之间共享的单例，上述模式可能会导致问题。这在 SSR 指南中的 [更多细节](./ssr#cross-request-state-pollution) 里有讨论。

## Pinia {#pinia}

虽然我们手写的状态管理方案在简单场景下已经足够，但在大型生产应用中还需要考虑更多事情：

- 更强的团队协作约定
- 与 Vue DevTools 集成，包括时间线、组件内检查和时间旅行调试
- 热模块替换
- 服务端渲染支持

[Pinia](https://pinia.vuejs.org) 是一个实现了上述所有功能的状态管理库。它由 Vue 核心团队维护，并同时支持 Vue 2 和 Vue 3。

已有用户可能熟悉 [Vuex](https://vuex.vuejs.org/)，这是 Vue 之前的官方状态管理库。随着 Pinia 在生态中承担相同角色，Vuex 现在已进入维护模式。它仍然可用，但不会再接收新功能。新应用推荐使用 Pinia。

Pinia 最初是对下一代 Vuex 可能是什么样子的探索，吸收了 Vuex 5 核心团队讨论中的许多想法。最终我们意识到，Pinia 已经实现了我们在 Vuex 5 中想要的大部分内容，于是决定将它作为新的推荐方案。

与 Vuex 相比，Pinia 提供了更简单、样板更少的 API，提供了类似 Composition API 风格的接口，并且最重要的是，在与 TypeScript 一起使用时具有良好的类型推导支持。
