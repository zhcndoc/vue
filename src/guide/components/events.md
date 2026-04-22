<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // v-model 的文档以前是本页面的一部分。尝试重定向过期链接。
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# 组件事件 {#component-events}

> 本页面默认你已经阅读过 [组件基础](/guide/essentials/component-basics)。如果你是组件新手，请先阅读那一部分。

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="关于定义自定义事件 emits 的免费 Vue.js 课程"/>
</div>

## 发出与监听事件 {#emitting-and-listening-to-events}

组件可以使用内置的 `$emit` 方法，直接在模板表达式中（例如在 `v-on` 处理器中）发出自定义事件：

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">点我</button>
```

<div class="options-api">

`$emit()` 方法也可以在组件实例上通过 `this.$emit()` 使用：

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

然后父组件可以使用 `v-on` 来监听它：

```vue-html
<MyComponent @some-event="callback" />
```

组件事件监听器也支持 `.once` 修饰符：

```vue-html
<MyComponent @some-event.once="callback" />
```

和组件与 props 一样，事件名会自动进行大小写转换。注意我们发出了一个 camelCase 事件，但在父组件中可以使用 kebab-case 的监听器来监听它。与 [props 的大小写规范](/guide/components/props#prop-name-casing) 一样，我们建议在模板中使用 kebab-case 的事件监听器。

:::tip
不同于原生 DOM 事件，组件发出的事件**不会**冒泡。你只能监听直接子组件发出的事件。如果需要在兄弟组件或深层嵌套组件之间通信，请使用外部事件总线或 [全局状态管理方案](/guide/scaling-up/state-management)。
:::

## 事件参数 {#event-arguments}

有时，随事件一起发出一个特定值会很有用。例如，我们可能希望 `<BlogPost>` 组件负责决定将文本放大多少。在这种情况下，我们可以向 `$emit` 传入额外参数来提供这个值：

```vue-html
<button @click="$emit('increaseBy', 1)">
  增加 1
</button>
```

然后，当我们在父组件中监听该事件时，可以使用内联箭头函数作为监听器，这样就能访问事件参数：

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

或者，如果事件处理器是一个方法：

```vue-html
<MyButton @increase-by="increaseCount" />
```

那么该值将作为这个方法的第一个参数传入：

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
传给 `$emit()` 的所有额外参数都会在事件名之后传递给监听器。例如，使用 `$emit('foo', 1, 2, 3)` 时，监听函数会接收到三个参数。
:::

## 声明发出的事件 {#declaring-emitted-events}

组件可以使用 <span class="composition-api">[`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits) 宏</span><span class="options-api">[`emits`](/api/options-state#emits) 选项</span>显式声明它将发出的事件：

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

我们在 `<template>` 中使用的 `$emit` 方法在组件的 `<script setup>` 部分中无法直接访问，但 `defineEmits()` 会返回一个等价的函数供我们替代使用：

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

`defineEmits()` 宏**不能**在函数内部使用，它必须像上面的示例那样直接放在 `<script setup>` 中。

如果你使用的是显式的 `setup` 函数而不是 `<script setup>`，则应使用 [`emits`](/api/options-state#emits) 选项来声明事件，并且 `emit` 函数会暴露在 `setup()` 上下文中：

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

与 `setup()` 上下文的其他属性一样，`emit` 也可以安全地被解构：

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

`emits` 选项和 `defineEmits()` 宏也支持对象语法。如果使用 TypeScript，你可以为参数添加类型，这使我们能够在运行时验证已发出事件的负载：

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // 返回 `true` 或 `false` 以表示
    // 校验通过 / 失败
  }
})
</script>
```

如果你在 `<script setup>` 中使用 TypeScript，也可以使用纯类型注解来声明发出的事件：

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

更多细节：[组件发出事件的类型标注](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // 返回 `true` 或 `false` 以表示
      // 校验通过 / 失败
    }
  }
}
```

另见：[组件发出事件的类型标注](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

虽然不是必需的，但仍建议定义所有发出的事件，以便更好地记录组件应如何工作。这样 Vue 还可以将已知监听器从 [透传 Attribute](/guide/components/attrs#v-on-listener-inheritance) 中排除，避免由第三方代码手动派发 DOM 事件所导致的边缘情况。

:::tip
如果在 `emits` 选项中定义了原生事件（例如 `click`），那么监听器现在只会监听组件发出的 `click` 事件，不再响应原生的 `click` 事件。
:::

## 事件校验 {#events-validation}

与 props 的类型校验类似，如果使用对象语法而不是数组语法来定义事件，那么发出的事件也可以被校验。

要添加校验，需要为该事件赋值一个函数，该函数接收传给 <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> 调用的参数，并返回一个布尔值来表示该事件是否有效。

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // 无校验
  click: null,

  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('无效的 submit 事件负载！')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // 无校验
    click: null,

    // 校验 submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('无效的 submit 事件负载！')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>
