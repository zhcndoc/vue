# 内置特殊元素 {#built-in-special-elements}

:::info 非组件
`<component>`、`<slot>` 和 `<template>` 是类似组件的特性，属于模板语法的一部分。它们不是真正的组件，并且会在模板编译过程中被编译掉。因此，在模板中它们通常以小写形式书写。
:::

## `<component>` {#component}

用于渲染动态组件或元素的“元组件”。

- **Props**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **细节**

  实际要渲染的组件由 `is` prop 决定。

  - 当 `is` 是字符串时，它可以是 HTML 标签名，也可以是组件的注册名。

  - 另外，`is` 也可以直接绑定到某个组件的定义。

- **示例**

  按注册名渲染组件（Options API）：

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  按定义渲染组件（使用 `<script setup>` 的 Composition API）：

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  渲染 HTML 元素：

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  [内置组件](./built-in-components) 都可以传给 `is`，但如果你想通过名称传递它们，就必须先注册。例如：

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  如果你传给 `is` 的是组件本身而不是它的名称，则不需要注册，例如在 `<script setup>` 中。

  如果在 `<component>` 标签上使用了 `v-model`，模板编译器会将其展开为 `modelValue` prop 和 `update:modelValue` 事件监听器，就像它对其他组件所做的那样。然而，这与原生 HTML 元素（例如 `<input>` 或 `<select>`）不兼容。因此，在动态创建的原生元素上使用 `v-model` 将不起作用：

  ```vue
  <script setup>
  import { ref } from 'vue'

  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- 这不会起作用，因为 'input' 是一个原生 HTML 元素 -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  在实践中，这种边缘情况并不常见，因为原生表单字段在真实应用中通常会被封装在组件里。如果你确实需要直接使用原生元素，那么可以手动将 `v-model` 拆分为属性和事件。

- **另见** [动态组件](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

表示模板中的插槽内容出口。

- **Props**

  ```ts
  interface SlotProps {
    /**
     * 传递给 <slot> 的任意 props，会作为作用域插槽的参数传入
     */
    [key: string]: any
    /**
     * 保留用于指定插槽名称。
     */
    name?: string
  }
  ```

- **细节**

  `<slot>` 元素可以使用 `name` 属性来指定插槽名称。当未指定 `name` 时，它会渲染默认插槽。传递给该插槽元素的额外属性会作为插槽 props 传递给父组件中定义的作用域插槽。

  元素本身会被其匹配到的插槽内容替换。

  Vue 模板中的 `<slot>` 元素会被编译成 JavaScript，因此不要将它与 [原生 `<slot>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)混淆。

- **另见** [组件 - 插槽](/guide/components/slots)

## `<template>` {#template}

`<template>` 标签用作占位符，当我们希望使用内置指令而不在 DOM 中渲染元素时会用到它。

- **细节**

  对 `<template>` 的特殊处理只有在它与以下指令之一一起使用时才会触发：

  - `v-if`、`v-else-if` 或 `v-else`
  - `v-for`
  - `v-slot`

  如果没有这些指令，那么它会被当作 [原生 `<template>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)来渲染。

  带有 `v-for` 的 `<template>` 也可以拥有一个 [`key` 属性](/api/built-in-special-attributes#key)。其他所有属性和指令都会被丢弃，因为在没有对应元素的情况下它们没有意义。

  单文件组件使用一个 [顶层 `<template>` 标签](/api/sfc-spec#language-blocks) 来包裹整个模板。该用法与上面描述的 `<template>` 用法是分开的。那个顶层标签不属于模板本身，并且不支持模板语法，例如指令。

- **另见**
  - [指南 - 在 `<template>` 上使用 `v-if`](/guide/essentials/conditional#v-if-on-template)
  - [指南 - 在 `<template>` 上使用 `v-for`](/guide/essentials/list#v-for-on-template)
  - [指南 - 命名插槽](/guide/components/slots#named-slots)
