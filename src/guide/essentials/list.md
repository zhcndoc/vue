# 列表渲染 {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="免费 Vue.js 列表渲染课程"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="免费 Vue.js 列表渲染课程"/>
</div>

## `v-for` {#v-for}

我们可以使用 `v-for` 指令基于数组渲染一个列表。`v-for` 指令需要使用特殊语法 `item in items`，其中 `items` 是源数据数组，而 `item` 是正在迭代的数组元素的**别名**：

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

在 `v-for` 的作用域内，模板表达式可以访问所有父级作用域属性。此外，`v-for` 还支持一个可选的第二个别名，用于表示当前项的索引：

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

`v-for` 的变量作用域类似于以下 JavaScript：

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // 可以访问外部作用域中的 `parentMessage`
  // 但 `item` 和 `index` 只在这里可用
  console.log(parentMessage, item.message, index)
})
```

注意 `v-for` 的值与 `forEach` 回调函数的签名相匹配。实际上，你可以像解构函数参数一样，对 `v-for` 的项别名使用解构：

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- 带有索引别名 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

对于嵌套的 `v-for`，作用域同样类似于嵌套函数。每个 `v-for` 作用域都可以访问父级作用域：

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

你也可以使用 `of` 作为分隔符来替代 `in`，这样更接近 JavaScript 中迭代器的语法：

```vue-html
<div v-for="item of items"></div>
```

## `v-for` 与对象 {#v-for-with-an-object}

你也可以使用 `v-for` 遍历对象的属性。遍历顺序将基于对该对象调用 `Object.values()` 的结果：

<div class="composition-api">

```js
const myObject = reactive({
  title: '如何在 Vue 中做列表',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: '如何在 Vue 中做列表',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

你也可以为属性名（也就是 key）提供第二个别名：

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

还可以为索引提供另一个别名：

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` 与范围 {#v-for-with-a-range}

`v-for` 也可以接受一个整数。在这种情况下，它会基于 `1...n` 的范围重复渲染模板 `n` 次。

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

注意这里 `n` 的初始值是 `1`，而不是 `0`。

## 在 `<template>` 上使用 `v-for` {#v-for-on-template}

与模板上的 `v-if` 类似，你也可以在 `<template>` 标签上使用 `v-for` 来渲染包含多个元素的块。例如：

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` 与 `v-if` {#v-for-with-v-if}

当 `v-if` 和 `v-for` 出现在同一个节点上时，`v-if` 的优先级更高。这意味着 `v-if` 条件将无法访问 `v-for` 作用域中的变量：

```vue-html
<!--
这会抛出一个错误，因为属性 "todo"
在实例上未定义。
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

可以通过将 `v-for` 移到包裹它的 `<template>` 标签上来修复这个问题（这也更明确）：

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

:::warning 注意
由于隐式优先级，不推荐在同一个元素上同时使用 `v-if` 和 `v-for`。

有两种常见场景容易让人这样做：

- 用于过滤列表中的项目（例如 `v-for="user in users" v-if="user.isActive"`）。在这种情况下，请将 `users` 替换为一个返回过滤后列表的计算属性（例如 `activeUsers`）。

- 用于在列表应该隐藏时避免渲染它（例如 `v-for="user in users" v-if="shouldShowUsers"`）。在这种情况下，将 `v-if` 移到一个容器元素上（例如 `ul`、`ol`）。
:::

## 使用 `key` 维护状态 {#maintaining-state-with-key}

当 Vue 更新由 `v-for` 渲染的元素列表时，默认会使用“就地更新”策略。如果数据项的顺序发生了变化，Vue 不会移动 DOM 元素以匹配项目顺序，而是会就地补丁每个元素，并确保它反映该索引下应渲染的内容。

这种默认模式很高效，但**只适用于你的列表渲染输出不依赖子组件状态或临时 DOM 状态（例如表单输入值）**的情况。

为了让 Vue 获得提示，以便它可以跟踪每个节点的身份，从而复用和重排现有元素，你需要为每一项提供一个唯一的 `key` 属性：

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

当使用 `<template v-for>` 时，`key` 应该放在 `<template>` 容器上：

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip 注意
这里的 `key` 是一个通过 `v-bind` 绑定的特殊属性。不要将它与 [在对象上使用 `v-for`](#v-for-with-an-object) 时的属性键变量混淆。
:::

建议尽可能在 `v-for` 中提供 `key` 属性，除非遍历的 DOM 内容非常简单（即不包含组件或有状态的 DOM 元素），或者你是有意依赖默认行为以获得性能提升。

`key` 绑定期望的是原始值——即字符串和数字。不要把对象用作 `v-for` 的 `key`。关于 `key` 属性的详细用法，请参见 [`key` API 文档](/api/built-in-special-attributes#key)。

## `v-for` 与组件 {#v-for-with-a-component}

> 本节假设你已经了解 [组件](/guide/essentials/component-basics)。你可以先跳过，之后再回来阅读。

你可以像在普通元素上一样直接在组件上使用 `v-for`（别忘了提供 `key`）：

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

不过，这不会自动向组件传递任何数据，因为组件拥有各自独立的作用域。为了将遍历的数据传递给组件，我们还应该使用 props：

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

之所以不会自动把 `item` 注入组件，是因为那样会让组件与 `v-for` 的工作方式紧密耦合。明确地说明数据来源可以让组件在其他场景中复用。

<div class="composition-api">

查看[这个简单待办事项列表示例](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=)，了解如何使用 `v-for` 渲染组件列表，并向每个实例传递不同的数据。

</div>
<div class="options-api">

查看[这个简单待办事项列表示例](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=)，了解如何使用 `v-for` 渲染组件列表，并向每个实例传递不同的数据。

</div>

## 数组变更检测 {#array-change-detection}

### 变更方法 {#mutation-methods}

Vue 能够检测到响应式数组调用了变更方法，并触发必要的更新。这些变更方法包括：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### 替换数组 {#replacing-an-array}

顾名思义，变更方法会修改它们所调用的原始数组。与之相比，还有一些非变更方法，例如 `filter()`、`concat()` 和 `slice()`，它们不会修改原始数组，而是**始终返回一个新数组**。当使用非变更方法时，我们应该用新数组替换旧数组：

<div class="composition-api">

```js
// `items` 是一个值为数组的 ref
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

你可能会认为这会导致 Vue 丢弃现有的 DOM 并重新渲染整个列表——幸运的是，并非如此。Vue 实现了一些智能启发式策略，以最大化 DOM 元素的复用，因此用另一个包含部分重叠对象的数组替换数组，是一种非常高效的操作。

## 显示过滤/排序后的结果 {#displaying-filtered-sorted-results}

有时我们希望显示数组经过过滤或排序后的版本，而不实际修改或重置原始数据。在这种情况下，你可以创建一个返回过滤或排序后数组的计算属性。

例如：

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

在计算属性不可行的情况下（例如在嵌套的 `v-for` 循环中），你可以使用方法：

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

在计算属性中使用 `reverse()` 和 `sort()` 时要小心！这两个方法会修改原始数组，这在计算属性的 getter 中应当避免。在调用这些方法之前，请先创建原始数组的副本：

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
