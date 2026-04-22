# 模板引用 {#template-refs}

虽然 Vue 的声明式渲染模型已经帮你抽象掉了大多数直接的 DOM 操作，但在某些情况下，我们仍然需要直接访问底层的 DOM 元素。为此，我们可以使用特殊的 `ref` 属性：

```vue-html
<input ref="input">
```

`ref` 是一个特殊属性，类似于在 `v-for` 章节中讨论过的 `key` 属性。它允许我们在组件挂载后，直接获取某个特定 DOM 元素或子组件实例的引用。例如，当你想在组件挂载时以编程方式聚焦某个输入框，或者在某个元素上初始化第三方库时，这会很有用。

## 访问 Refs {#accessing-the-refs}

<div class="composition-api">

要使用 Composition API 获取该引用，我们可以使用 [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" /> 辅助函数：

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// 第一个参数必须与模板中的 ref 值匹配
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

当使用 TypeScript 时，Vue 的 IDE 支持和 `vue-tsc` 会根据匹配的 `ref` 属性所绑定的是哪个元素或组件，自动推断 `input.value` 的类型。

<details>
<summary>3.5 之前的用法</summary>

在 3.5 之前尚未引入 `useTemplateRef()` 的版本中，我们需要声明一个 ref，其名称与模板中的 ref 属性值相匹配：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 用于保存元素引用
// 名称必须与模板 ref 值匹配
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

如果不使用 `<script setup>`，还要记得从 `setup()` 中返回这个 ref：

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</details>

</div>
<div class="options-api">

得到的 ref 会暴露在 `this.$refs` 上：

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

请注意，你只能在组件**挂载之后**访问该 ref。如果你尝试在模板表达式中访问 <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span>，它在首次渲染时将是 <span class="options-api">`undefined`</span><span class="composition-api">`null`</span>。这是因为该元素直到首次渲染后才存在！

<div class="composition-api">

如果你想监听模板 ref 的变化，请务必考虑 ref 可能为 `null` 的情况：

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // 还未挂载，或者该元素已被卸载（例如通过 v-if）
  }
})
```

另请参阅：[类型化模板 Refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## 组件上的 Ref {#ref-on-component}

> 本节假设你已经了解 [组件](/guide/essentials/component-basics)。如果愿意，可以先跳过，稍后再回来。

`ref` 也可以用于子组件。在这种情况下，引用将是一个组件实例：

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value 将持有一个 <Child /> 实例
})
</script>

<template>
  <Child ref="child" />
</template>
```

<details>
<summary>3.5 之前的用法</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value 将持有一个 <Child /> 实例
})
</script>

<template>
  <Child ref="child" />
</template>
```

</details>

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child 将持有一个 <Child /> 实例
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">如果子组件使用的是 Options API，或者没有使用 `<script setup>`，</span><span class="options-api">该</span>被引用的实例将与子组件的 `this` 完全相同，这意味着父组件可以完全访问子组件的每个属性和方法。这使得在父组件和子组件之间创建紧密耦合的实现细节变得很容易，因此组件 ref 只应在绝对必要时使用——在大多数情况下，你应该先尝试使用标准的 props 和 emit 接口来实现父子交互。

<div class="composition-api">

这里有一个例外：使用 `<script setup>` 的组件默认是**私有的**：父组件引用一个使用 `<script setup>` 的子组件时，除非子组件通过 `defineExpose` 宏选择暴露一个公共接口，否则父组件无法访问任何内容：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// 编译器宏（例如 defineExpose）不需要导入
defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板 ref 获取该组件实例时，得到的实例形状将是 `{ a: number, b: number }`（refs 会像在普通实例上一样自动解包）。

请注意，defineExpose 必须在任何 await 操作之前调用。否则，在 await 操作之后暴露的属性和方法将无法访问。

另请参阅：[类型化组件模板 Refs](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

`expose` 选项可用于限制对子组件实例的访问：

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

在上面的示例中，父组件通过模板 ref 引用这个组件时，只能访问 `publicData` 和 `publicMethod`。

</div>

## `v-for` 中的 Refs {#refs-inside-v-for}

> 需要 v3.5 或更高版本

<div class="composition-api">

当 `ref` 用在 `v-for` 中时，相应的 ref 应该包含一个数组值，挂载后这些元素会被填充进去：

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = useTemplateRef('items')

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>3.5 之前的用法</summary>

在 3.5 之前尚未引入 `useTemplateRef()` 的版本中，我们需要声明一个 ref，其名称与模板中的 ref 属性值相匹配。该 ref 也应包含数组值：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

</details>

</div>
<div class="options-api">

当 `ref` 用在 `v-for` 中时，得到的 ref 值将是一个包含相应元素的数组：

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

需要注意的是，ref 数组**不能**保证与源数组具有相同的顺序。

## 函数 Refs {#function-refs}

`ref` 属性除了可以绑定字符串 key 之外，还可以绑定到一个函数，该函数会在每次组件更新时被调用，并让你能够完全灵活地决定将元素引用存储在哪里。该函数会接收元素引用作为第一个参数：

```vue-html
<input :ref="(el) => { /* 将 el 赋值给某个属性或 ref */ }">
```

请注意，我们这里使用的是动态 `:ref` 绑定，因此可以传入函数而不是 ref 名称字符串。当元素被卸载时，该参数将是 `null`。当然，你也可以使用一个方法来代替内联函数。
