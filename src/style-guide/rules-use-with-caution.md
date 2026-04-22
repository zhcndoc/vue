# Priority D 规则：谨慎使用 {#priority-d-rules-use-with-caution}

::: warning 注意
此 Vue.js 风格指南已过时，需要重新审查。如果你有任何问题或建议，请 [提交 issue](https://github.com/vuejs/docs/issues/new)。
:::

Vue 的一些特性是为了适应罕见的边缘情况，或者让从旧代码库迁移时更顺畅而存在的。然而，当这些特性被过度使用时，它们会让代码更难维护，甚至成为 bug 的来源。这些规则会指出一些潜在有风险的特性，说明何时以及为什么应该避免它们。

## 带有 `scoped` 的元素选择器 {#element-selectors-with-scoped}

**应避免在 `scoped` 中使用元素选择器。**

在 `scoped` 样式中，应优先使用类选择器而不是元素选择器，因为大量元素选择器的性能较差。

::: details 详细说明
为了实现样式作用域，Vue 会给组件元素添加一个唯一属性，例如 `data-v-f3f3eg9`。然后会修改选择器，使其只选择带有该属性的匹配元素（例如 `button[data-v-f3f3eg9]`）。

问题在于，大量元素-属性选择器（例如 `button[data-v-f3f3eg9]`）的速度会明显慢于类-属性选择器（例如 `.btn-close[data-v-f3f3eg9]`），因此在可能的情况下应优先使用类选择器。
:::

<div class="style-example style-example-bad">
<h3>差</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## 隐式的父子通信 {#implicit-parent-child-communication}

**父子组件通信应优先使用 props 和 events，而不是 `this.$parent` 或直接修改 props。**

理想的 Vue 应用是 props 向下传递，events 向上传递。遵循这一约定会让你的组件更容易理解。不过，也存在一些边缘情况，在这些情况下，修改 prop 或使用 `this.$parent` 可以简化两个已经高度耦合的组件。

问题在于，在很多 _简单_ 的场景中，这些模式也可能带来便利。请注意：不要被“简化”（更容易理解状态流向）所替代的短期便利（更少的代码）所诱惑。

<div class="options-api">

<div class="style-example style-example-bad">
<h3>差</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>差</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input v-model="todo.text" />
</template>
```

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const instance = getCurrentInstance()

function removeTodo() {
  const parent = instance.parent
  if (!parent) return

  parent.props.todos = parent.props.todos.filter((todo) => {
    return todo.id !== props.todo.id
  })
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo">×</button>
  </span>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['input'])
</script>

<template>
  <input :value="todo.text" @input="emit('input', $event.target.value)" />
</template>
```

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="emit('delete')">×</button>
  </span>
</template>
```

</div>

</div>
