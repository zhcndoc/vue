# 自定义指令 {#custom-directives}

<script setup>
const vHighlight = {
  mounted: el => {
    el.classList.add('is-highlight')
  }
}
</script>

<style>
.vt-doc p.is-highlight {
  margin-bottom: 0;
}

.is-highlight {
  background-color: yellow;
  color: black;
}
</style>

## 介绍 {#introduction}

除了核心中自带的默认指令集（如 `v-model` 或 `v-show`）之外，Vue 还允许你注册自己的自定义指令。

我们已经在 Vue 中引入了两种代码复用形式：[组件](/guide/essentials/component-basics) 和 [可组合函数](./composables)。组件是主要的构建块，而可组合函数专注于复用有状态逻辑。另一方面，自定义指令主要用于复用涉及对普通元素进行底层 DOM 访问的逻辑。

自定义指令是一个对象，其中包含类似组件生命周期的钩子函数。这些钩子会接收该指令所绑定的元素。下面是一个示例：当元素被 Vue 插入到 DOM 中时，给它添加一个类：

<div class="composition-api">

```vue
<script setup>
// 在模板中启用 v-highlight
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>这句话很重要！</p>
</template>
```

</div>

<div class="options-api">

```js
const highlight = {
  mounted: (el) => el.classList.add('is-highlight')
}

export default {
  directives: {
    // 在模板中启用 v-highlight
    highlight
  }
}
```

```vue-html
<p v-highlight>这句话很重要！</p>
```

</div>

<div class="demo">
  <p v-highlight>这句话很重要！</p>
</div>

<div class="composition-api">

在 `<script setup>` 中，任何以 `v` 前缀开头的驼峰式变量都可以作为自定义指令使用。在上面的例子中，`vHighlight` 可以在模板中以 `v-highlight` 的形式使用。

如果你没有使用 `<script setup>`，可以通过 `directives` 选项注册自定义指令：

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-highlight
    highlight: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

与组件类似，自定义指令必须先注册后才能在模板中使用。在上面的例子中，我们使用的是通过 `directives` 选项进行的局部注册。

</div>

也可以在应用级别全局注册自定义指令：

```js
const app = createApp({})

// 使所有组件都能使用 v-highlight
app.directive('highlight', {
  /* ... */
})
```

可以通过扩展 `vue` 中的 `GlobalDirectives` 接口来为全局自定义指令添加类型

更多详情：[为全局自定义指令添加类型](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />

## 何时使用自定义指令 {#when-to-use}

自定义指令只应在所需功能只能通过直接操作 DOM 来实现时使用。

一个常见的例子是 `v-focus` 自定义指令，它会让元素获得焦点。

<div class="composition-api">

```vue
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // 在模板中启用 v-focus
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

这个指令比 `autofocus` 属性更有用，因为它不仅在页面加载时有效——当元素被 Vue 动态插入时，它也同样有效！

在可能的情况下，推荐使用内置指令（如 `v-bind`）进行声明式模板编写，因为它们更高效，并且更适合服务端渲染。

## 指令钩子 {#directive-hooks}

指令定义对象可以提供多个钩子函数（全部可选）：

```js
const myDirective = {
  // 在绑定元素的属性
  // 或事件监听器应用之前调用
  created(el, binding, vnode) {
    // 参数详见下文
  },
  // 在元素被插入 DOM 之前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及其所有子组件都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 在父组件更新之前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在父组件及其
  // 所有子组件更新完成后调用
  updated(el, binding, vnode, prevVnode) {},
  // 在父组件卸载之前调用
  beforeUnmount(el, binding, vnode) {},
  // 在父组件卸载时调用
  unmounted(el, binding, vnode) {}
}
```

### 钩子参数 {#hook-arguments}

指令钩子会传入以下参数：

- `el`：指令所绑定的元素。这可用于直接操作 DOM。

- `binding`：一个包含以下属性的对象。

  - `value`：传给指令的值。例如在 `v-my-directive="1 + 1"` 中，值将是 `2`。
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否发生变化，它都可用。
  - `arg`：传给指令的参数（如果有）。例如在 `v-my-directive:foo` 中，arg 将是 `"foo"`。
  - `modifiers`：一个包含修饰符的对象（如果有）。例如在 `v-my-directive.foo.bar` 中，修饰符对象将是 `{ foo: true, bar: true }`。
  - `instance`：使用该指令的组件实例。
  - `dir`：指令定义对象。

- `vnode`：表示绑定元素的底层 VNode。
- `prevVnode`：表示上一次渲染中绑定元素的 VNode。仅在 `beforeUpdate` 和 `updated` 钩子中可用。

例如，考虑以下指令用法：

```vue-html
<div v-example:foo.bar="baz">
```

`binding` 参数的对象形状如下：

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
}
```

与内置指令类似，自定义指令的参数也可以是动态的。例如：

```vue-html
<div v-example:[arg]="value"></div>
```

这里，指令参数会根据组件状态中的 `arg` 属性进行响应式更新。

:::tip 注意
除了 `el` 之外，你应该把这些参数视为只读，且绝不要修改它们。如果你需要在多个钩子之间共享信息，建议通过元素的 [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) 来实现。
:::

## 函数简写 {#function-shorthand}

自定义指令经常会在 `mounted` 和 `updated` 中表现出相同的行为，而不需要其他钩子。在这种情况下，我们可以将该指令定义为一个函数：

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // 这里会在 `mounted` 和 `updated` 中都被调用
  el.style.color = binding.value
})
```

## 对象字面量 {#object-literals}

如果你的指令需要多个值，也可以传入一个 JavaScript 对象字面量。请记住，指令可以接收任何有效的 JavaScript 表达式。

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## 在组件上使用 {#usage-on-components}

:::warning 不推荐
不推荐在组件上使用自定义指令。当组件有多个根节点时，可能会出现意外行为。
:::

在组件上使用时，自定义指令总会应用到组件的根节点上，类似于 [透传 Attributes](/guide/components/attrs)。

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- MyComponent 的模板 -->

<div> <!-- v-demo 指令会应用在这里 -->
  <span>我的组件内容</span>
</div>
```

请注意，组件可能会有多个根节点。应用到多根组件时，指令会被忽略并抛出警告。与属性不同，指令不能通过 `v-bind="$attrs"` 传递给其他元素。
