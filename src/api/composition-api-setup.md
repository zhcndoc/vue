# Composition API：setup() {#composition-api-setup}

## 基本用法 {#basic-usage}

`setup()` 钩子在以下情况下充当组件中使用 Composition API 的入口点：

1. 在不使用构建步骤的情况下使用 Composition API；
2. 在 Options API 组件中集成基于 Composition API 的代码。

:::info 注意
如果你在单文件组件中使用 Composition API，强烈建议使用 [`<script setup>`](/api/sfc-script-setup)，以获得更简洁、更易用的语法。
:::

我们可以使用 [响应式 API](./reactivity-core) 声明响应式状态，并通过从 `setup()` 返回一个对象将其暴露给模板。返回对象上的属性也会在组件实例上可用（如果使用了其他选项）：

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // 暴露给模板和其他 Options API 钩子
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

`setup` 返回的 [ref](/api/reactivity-core#ref) 在模板中访问时会被[自动浅层解包](/guide/essentials/reactivity-fundamentals#deep-reactivity)，因此访问它们时无需使用 `.value`。当在 `this` 上访问时，它们也会以相同方式被解包。

`setup()` 本身无法访问组件实例——在 `setup()` 内部，`this` 的值将是 `undefined`。你可以从 Options API 中访问通过 Composition API 暴露的值，但不能反过来。

`setup()` 应该**同步**返回一个对象。只有当组件是 [Suspense](../guide/built-ins/suspense) 组件的后代时，才能使用 `async setup()`。

## 访问 Props {#accessing-props}

传递给 `setup` 函数的第一个参数是 `props` 参数。与标准组件中的预期一致，`setup` 函数内部的 `props` 是响应式的，并且在传入新的 props 时会更新。

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

请注意，如果你解构了 `props` 对象，解构得到的变量将失去响应性。因此建议始终以 `props.xxx` 的形式访问 props。

如果你确实需要解构 props，或者需要在保持响应性的同时将某个 prop 传递给外部函数，可以使用 [toRefs()](./reactivity-utilities#torefs) 和 [toRef()](/api/reactivity-utilities#toref) 工具 API：

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // 将 `props` 转换为 refs 对象，然后再解构
    const { title } = toRefs(props)
    // `title` 是一个 ref，用来追踪 `props.title`
    console.log(title.value)

    // 或者，将 `props` 上的单个属性转换为 ref
    const title = toRef(props, 'title')
  }
}
```

## Setup 上下文 {#setup-context}

传递给 `setup` 函数的第二个参数是一个 **Setup Context** 对象。该上下文对象暴露了在 `setup` 内部可能有用的其他值：

```js
export default {
  setup(props, context) {
    // 属性（非响应式对象，等同于 $attrs）
    console.log(context.attrs)

    // 插槽（非响应式对象，等同于 $slots）
    console.log(context.slots)

    // 触发事件（函数，等同于 $emit）
    console.log(context.emit)

    // 暴露公共属性（函数）
    console.log(context.expose)
  }
}
```

上下文对象不是响应式的，因此可以安全地进行解构：

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` 和 `slots` 是有状态的对象，当组件本身更新时它们总会同步更新。这意味着你应该避免对它们进行解构，并始终以 `attrs.x` 或 `slots.x` 的形式引用属性。还要注意，与 `props` 不同，`attrs` 和 `slots` 的属性**不是**响应式的。如果你打算根据 `attrs` 或 `slots` 的变化应用副作用，你应该在 `onBeforeUpdate` 生命周期钩子中进行。

### 暴露公共属性 {#exposing-public-properties}

`expose` 是一个函数，可用于在父组件通过 [模板 ref](/guide/essentials/template-refs#ref-on-component) 访问组件实例时，显式限制所暴露的属性：

```js{5,10}
export default {
  setup(props, { expose }) {
    // 将实例“关闭”-
    // 即不向父组件暴露任何内容
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    expose({ count: publicCount })
  }
}
```

## 与渲染函数一起使用 {#usage-with-render-functions}

`setup` 也可以返回一个[渲染函数](/guide/extras/render-function)，它可以直接使用在同一作用域中声明的响应式状态：

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

返回渲染函数会阻止我们再返回任何其他内容。从内部来说这不会有问题，但如果我们想通过模板 ref 将此组件的方法暴露给父组件，这就可能成为问题。

我们可以通过调用 [`expose()`](#exposing-public-properties) 来解决这个问题：

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

这样，`increment` 方法就可以通过模板 ref 在父组件中使用。
