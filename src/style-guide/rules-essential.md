# 优先级 A 规则：必需 {#priority-a-rules-essential}

::: warning 注意
本 Vue.js 风格指南已过时，需要进行审查。如果你有任何问题或建议，请[提交 issue](https://github.com/vuejs/docs/issues/new)。
:::

这些规则有助于防止错误，因此请不惜一切代价学习并遵守它们。可能存在例外，但应当非常罕见，而且只应由对 JavaScript 和 Vue 都有专业知识的人做出。

## 使用多单词组件名 {#use-multi-word-component-names}

用户组件名称应始终使用多个单词，根 `App` 组件除外。这可以防止与现有和未来的 HTML 元素发生[冲突](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)，因为所有 HTML 元素都只有一个单词。

<div class="style-example style-example-bad">
<h3>错误</h3>

```vue-html
<!-- 在预编译模板中 -->
<Item />

<!-- 在 DOM 内模板中 -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```vue-html
<!-- 在预编译模板中 -->
<TodoItem />

<!-- 在 DOM 内模板中 -->
<todo-item></todo-item>
```

</div>

## 使用详细的 prop 定义 {#use-detailed-prop-definitions}

在提交的代码中，prop 定义应始终尽可能详细，至少要指定类型。

::: details 详细说明
详细的 [prop 定义](/guide/components/props#prop-validation) 有两个优点：

- 它们记录了组件的 API，因此更容易看出该组件应如何使用。
- 在开发过程中，如果某个组件提供了格式不正确的 prop，Vue 会发出警告，帮助你发现潜在的错误来源。
  :::

<div class="options-api">

<div class="style-example style-example-bad">
<h3>错误</h3>

```js
// 仅在原型开发时这样才可以
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```js
props: {
  status: String
}
```

```js
// 更好！
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>错误</h3>

```js
// 仅在原型开发时这样才可以
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// 更好！

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>

</div>

## 使用带 `key` 的 `v-for` {#use-keyed-v-for}

在组件上，`v-for` 必须始终配合 `key` 使用，以维护子树中的内部组件状态。即使对于元素来说，这也是一种良好实践，可以保持可预测的行为，例如动画中的[对象恒定性](https://bost.ocks.org/mike/constancy/)。

::: details 详细说明
假设你有一个待办事项列表：

<div class="options-api">

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: '学习使用 v-for'
      },
      {
        id: 2,
        text: '学习使用 key'
      }
    ]
  }
}
```

</div>

<div class="composition-api">

```js
const todos = ref([
  {
    id: 1,
    text: '学习使用 v-for'
  },
  {
    id: 2,
    text: '学习使用 key'
  }
])
```

</div>

然后你按字母顺序对它们排序。在更新 DOM 时，Vue 会优化渲染，以执行尽可能少的 DOM 变更。这可能意味着先删除第一个待办事项元素，然后再把它加回到列表末尾。

问题在于，在某些情况下，不删除那些仍将保留在 DOM 中的元素是很重要的。例如，你可能希望使用 `<transition-group>` 来为列表排序添加动画，或者当渲染的元素是 `<input>` 时保持焦点。在这些情况下，为每一项添加一个唯一的 key（例如 `:key="todo.id"`）会让 Vue 更可预测地决定如何行为。

根据我们的经验，最好是始终添加唯一的 key，这样你和你的团队就不必担心这些边界情况了。然后在极少数对性能极其敏感且不需要对象恒定性的场景中，你可以有意识地做出例外。
:::

<div class="style-example style-example-bad">
<h3>错误</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## 避免在 `v-for` 中使用 `v-if` {#avoid-v-if-with-v-for}

**不要在与 `v-for` 相同的元素上使用 `v-if`。**

这种写法常见于以下两种情况：

- 过滤列表中的项（例如 `v-for="user in users" v-if="user.isActive"`）。在这种情况下，请用一个新的计算属性替换 `users`，让它返回过滤后的列表（例如 `activeUsers`）。

- 在列表应该被隐藏时避免渲染它（例如 `v-for="user in users" v-if="shouldShowUsers"`）。在这种情况下，把 `v-if` 移到一个容器元素上（例如 `ul`、`ol`）。

::: details 详细说明
当 Vue 处理指令时，`v-if` 的优先级高于 `v-for`，因此下面这个模板：

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

会抛出错误，因为 `v-if` 指令会先被求值，而此时迭代变量 `user` 并不存在。

可以通过改为迭代一个计算属性来修复，例如：

<div class="options-api">

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

</div>

<div class="composition-api">

```js
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
```

</div>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

或者，我们也可以使用带有 `v-for` 的 `<template>` 标签来包裹 `<li>` 元素：

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>错误</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## 使用组件级作用域样式 {#use-component-scoped-styling}

对于应用程序来说，顶层 `App` 组件和布局组件中的样式可以是全局的，但其他所有组件都应始终使用作用域样式。

这仅与[单文件组件](/guide/scaling-up/sfc)相关。它并不要求必须使用 [`scoped` 属性](https://vue-loader.vuejs.org/guide/scoped-css.html)。作用域可以通过 [CSS modules](https://vue-loader.vuejs.org/guide/css-modules.html)、类似 [BEM](http://getbem.com/) 的基于类的策略，或其他库/约定来实现。

**不过，组件库应优先使用基于类的策略，而不是使用 `scoped` 属性。**

这样更容易覆盖内部样式，使用可读性强且特异性不会过高的类名，同时又极不容易产生冲突。

::: details 详细说明
如果你正在开发大型项目、与其他开发者协作，或者有时会包含第三方 HTML/CSS（例如来自 Auth0），一致的作用域控制将确保你的样式只会应用到它们应当作用的组件上。

除了 `scoped` 属性之外，使用唯一的类名还可以帮助确保第三方 CSS 不会作用于你自己的 HTML。例如，许多项目会使用 `button`、`btn` 或 `icon` 这些类名，因此即使不使用 BEM 之类的策略，添加一个应用特定和/或组件特定的前缀（例如 `ButtonClose-icon`）也可以提供一些保护。
:::

<div class="style-example style-example-bad">
<h3>错误</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- 使用 `scoped` 属性 -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- 使用 CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- 使用 BEM 约定 -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>
