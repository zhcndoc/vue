# Priority D 规则：谨慎使用 {#priority-d-rules-use-with-caution}

Vue 的某些特性是为了适应少见的边缘情况，或帮助从旧代码库更平滑地迁移而存在的。然而，过度使用时，它们会让你的代码更难维护，甚至成为 bug 的来源。这些规则会指出一些可能存在风险的特性，并说明在什么情况下以及为什么应当避免使用它们。

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
const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

function renameTodo() {
  // 通过 prop 修改了父组件的响应式对象
  // 也就是说，子组件正在伸手更改父组件拥有的状态。
  props.todo.text = 'renamed by child'
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="renameTodo">重命名</button>
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
const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:todo'])

function renameTodo() {
  // 发出一个新对象 — 由父组件负责更新。
  emit('update:todo', { ...props.todo, text: 'renamed by parent' })
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="renameTodo">重命名</button>
  </span>
</template>
```

</div>

</div>
