---
outline: deep
---

# 渲染函数与 JSX {#render-functions-jsx}

Vue 推荐在绝大多数情况下使用模板来构建应用。不过，有些场景下我们需要 JavaScript 提供的完整编程能力。这时就可以使用**渲染函数**。

> 如果你是虚拟 DOM 和渲染函数的新手，请务必先阅读 [渲染机制](/guide/extras/rendering-mechanism) 这一章。

## 基础用法 {#basic-usage}

### 创建 Vnode {#creating-vnodes}

Vue 提供了一个用于创建 vnode 的 `h()` 函数：

```js
import { h } from 'vue'

const vnode = h(
  'div', // 类型
  { id: 'foo', class: 'bar' }, // props
  [
    /* 子节点 */
  ]
)
```

`h()` 是 **hyperscript** 的缩写，意思是“生成 HTML（超文本标记语言）的 JavaScript”。这个名称沿用了许多虚拟 DOM 实现中的约定。更具描述性的名字可能是 `createVNode()`，但当你需要在渲染函数中多次调用这个函数时，较短的名称会更方便。

`h()` 函数被设计得非常灵活：

```js
// 除了 type 之外，所有参数都是可选的
h('div')
h('div', { id: 'foo' })

// props 中既可以使用属性，也可以使用 DOM 属性
// Vue 会自动选择正确的赋值方式
h('div', { class: 'bar', innerHTML: 'hello' })

// 可以使用 `.` 和 `^` 前缀分别添加
// `.prop` 和 `.attr` 这类 props 修饰符
h('div', { '.name': 'some-name', '^width': '100' })

// class 和 style 与模板中一样，也支持对象 / 数组
// 形式的值
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// 事件监听器应以 onXxx 的形式传入
h('div', { onClick: () => {} })

// children 可以是字符串
h('div', { id: 'foo' }, 'hello')

// 当没有 props 时，可以省略 props 参数
h('div', 'hello')
h('div', [h('span', 'hello')])

// children 数组可以同时包含 vnode 和字符串
h('div', ['hello', h('span', 'hello')])
```

生成的 vnode 具有如下结构：

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning 注意
完整的 `VNode` 接口还包含许多其他内部属性，但强烈建议不要依赖这里列出的属性之外的任何属性。这样可以避免内部属性变更时造成非预期的破坏。
:::

### 声明渲染函数 {#declaring-render-functions}

<div class="composition-api">

在使用 Composition API 和模板时，`setup()` 钩子的返回值会用于向模板暴露数据。而使用渲染函数时，我们可以直接返回渲染函数：

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // 返回渲染函数
    return () => h('div', props.msg + count.value)
  }
}
```

渲染函数是在 `setup()` 内部声明的，因此它天然可以访问 props 以及在同一作用域中声明的任何响应式状态。

除了返回单个 vnode，你也可以返回字符串或数组：

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // 使用数组返回多个根节点
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
请务必返回一个函数，而不是直接返回值！`setup()` 函数在每个组件中只会被调用一次，而返回的渲染函数会被多次调用。
:::

</div>
<div class="options-api">

我们可以使用 `render` 选项来声明渲染函数：

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

`render()` 函数可以通过 `this` 访问组件实例。

除了返回单个 vnode，你也可以返回字符串或数组：

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // 使用数组返回多个根节点
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

如果某个渲染函数组件不需要任何实例状态，也可以直接将其声明为一个函数，以便简写：

```js
function Hello() {
  return 'hello world!'
}
```

没错，这也是一个合法的 Vue 组件！有关这种语法的更多细节，请参阅 [函数式组件](#functional-components)。

### Vnode 必须唯一 {#vnodes-must-be-unique}

组件树中的所有 vnode 都必须是唯一的。这意味着下面的渲染函数是无效的：

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // 糟糕 - 重复的 vnode！
    p,
    p
  ])
}
```

如果你确实想要多次重复渲染同一个元素 / 组件，可以使用工厂函数来实现。例如，下面这个渲染函数可以非常正确地渲染 20 个相同的段落：

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

### 在 `<template>` 中使用 Vnode {#using-vnodes-in-template}

```vue
<script setup>
import { h } from 'vue'

const vnode = h('button', ['Hello'])
</script>

<template>
  <!-- 通过 <component /> -->
  <component :is="vnode">Hi</component>

  <!-- 或者直接作为元素 -->
  <vnode />
  <vnode>Hi</vnode>
</template>
```

一个 vnode 对象已在 `setup()` 中声明，你可以像普通组件一样使用它进行渲染。

:::warning
vnode 表示的是已经创建好的渲染输出，而不是组件定义。在 `<template>` 中使用 vnode 不会创建新的组件实例，vnode 会按原样渲染。

这种模式应谨慎使用，它不能替代普通组件。
:::

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) 是 JavaScript 的一种类似 XML 的扩展，允许我们编写如下代码：

```jsx
const vnode = <div>hello</div>
```

在 JSX 表达式中，使用花括号来插入动态值：

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

`create-vue` 和 Vue CLI 都提供了在项目脚手架中预配置 JSX 支持的选项。如果你要手动配置 JSX，请查阅 [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) 的文档了解详情。

虽然 JSX 最早由 React 引入，但 JSX 实际上并没有定义运行时语义，可以编译为多种不同输出。如果你之前使用过 JSX，请注意**Vue JSX 转换与 React 的 JSX 转换不同**，因此你不能在 Vue 应用中使用 React 的 JSX 转换。与 React JSX 相比，Vue JSX 的一些显著区别包括：

- 你可以直接使用 `class` 和 `for` 之类的 HTML 属性作为 props——不需要使用 `className` 或 `htmlFor`。
- 向组件传递 children（即 slots）的方式 [不同](#passing-slots)。

Vue 的类型定义也为 TSX 的使用提供了类型推导。在使用 TSX 时，请确保在 `tsconfig.json` 中指定 `"jsx": "preserve"`，这样 TypeScript 才会保留 JSX 语法，供 Vue JSX 转换处理。

### JSX 类型推导 {#jsx-type-inference}

与转换一样，Vue 的 JSX 也需要不同的类型定义。

从 Vue 3.4 开始，Vue 不再隐式注册全局 `JSX` 命名空间。为了让 TypeScript 使用 Vue 的 JSX 类型定义，请确保在你的 `tsconfig.json` 中包含以下内容：

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

你也可以通过在文件顶部添加 `/* @jsxImportSource vue */` 注释，按文件启用。

如果有代码依赖全局 `JSX` 命名空间的存在，你可以在项目中显式导入或引用 `vue/jsx`，从而保留 3.4 之前完全相同的全局行为，它会注册全局 `JSX` 命名空间。

## 渲染函数示例 {#render-function-recipes}

下面我们将提供一些常见示例，用于将模板特性实现为等价的渲染函数 / JSX。

### `v-if` {#v-if}

模板：

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

等价的渲染函数 / JSX：

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for` {#v-for}

模板：

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

等价的渲染函数 / JSX：

<div class="composition-api">

```js
h(
  'ul',
  // 假设 `items` 是一个值为数组的 ref
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

以 `on` 开头并紧跟一个大写字母命名的 props 会被视为事件监听器。例如，`onClick` 相当于模板中的 `@click`。

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'Click Me'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  Click Me
</button>
```

#### 事件修饰符 {#event-modifiers}

对于 `.passive`、`.capture` 和 `.once` 这些事件修饰符，可以使用驼峰命名法将它们拼接到事件名后面。

例如：

```js
h('input', {
  onClickCapture() {
    /* 处于捕获模式的监听器 */
  },
  onKeyupOnce() {
    /* 只触发一次 */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

对于其他事件和按键修饰符，可以使用 [`withModifiers`](/api/render-function#withmodifiers) 辅助函数：

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### 组件 {#components}

要为组件创建 vnode，传给 `h()` 的第一个参数应该是组件定义。这意味着使用渲染函数时无需注册组件——你可以直接使用导入的组件：

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

可以看到，只要是有效的 Vue 组件，`h` 就可以处理从任何文件格式导入的组件。

使用渲染函数处理动态组件也很直接：

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

如果某个组件是按名称注册的，不能直接导入（例如由某个库全局注册），则可以使用 [`resolveComponent()`](/api/render-function#resolvecomponent) 辅助函数以编程方式解析它。

### 渲染插槽 {#rendering-slots}

<div class="composition-api">

在渲染函数中，可以从 `setup()` 上下文中访问插槽。`slots` 对象上的每个插槽都是一个**返回 vnode 数组的函数**：

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // 默认插槽：
      // <div><slot /></div>
      h('div', slots.default()),

      // 具名插槽：
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

JSX 等价写法：

```jsx
// 默认
<div>{slots.default()}</div>

// 具名
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

在渲染函数中，可以从 [`this.$slots`](/api/component-instance#slots) 访问插槽：

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

JSX 等价写法：

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### 传递插槽 {#passing-slots}

向组件传递 children 与向元素传递 children 的方式略有不同。我们传递的不是数组，而是一个插槽函数，或者一个插槽函数对象。插槽函数可以返回普通渲染函数能返回的任何内容——在子组件中访问时，这些内容总会被规范化为 vnode 数组。

```js
// 单个默认插槽
h(MyComponent, () => 'hello')

// 具名插槽
// 注意这里需要 `null`，以避免
// slots 对象被当作 props 处理
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

JSX 等价写法：

```jsx
// 默认
<MyComponent>{() => 'hello'}</MyComponent>

// 具名
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

将插槽作为函数传递后，子组件就可以延迟调用它们。这会让插槽的依赖由子组件而不是父组件来跟踪，从而实现更准确、更高效的更新。

### 作用域插槽 {#scoped-slots}

要在父组件中渲染作用域插槽，需要将插槽传递给子组件。注意此时插槽有一个参数 `text`。该插槽会在子组件中被调用，而来自子组件的数据会传回父组件。

```js
// 父组件
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

记得传入 `null`，这样插槽就不会被当作 props。

```js
// 子组件
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

JSX 等价写法：

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>  
}}</MyComponent>
```

### 内置组件 {#built-in-components}

[内置组件](/api/built-in-components) 如 `<KeepAlive>`、`<Transition>`、`<TransitionGroup>`、`<Teleport>` 和 `<Suspense>` 在渲染函数中使用时必须先导入：

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

在模板编译期间，`v-model` 指令会被展开为 `modelValue` 和 `onUpdate:modelValue` props——我们需要自己提供这些 props：

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### 自定义指令 {#custom-directives}

可以使用 [`withDirectives`](/api/render-function#withdirectives) 将自定义指令应用到 vnode 上：

```js
import { h, withDirectives } from 'vue'

// 一个自定义指令
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

如果指令是按名称注册的，不能直接导入，则可以使用 [`resolveDirective`](/api/render-function#resolvedirective) 辅助函数来解析它。

### 模板 ref {#template-refs}

<div class="composition-api">

在 Composition API 中，当使用 [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" /> 时，通过将字符串值作为 props 传给 vnode 来创建模板 ref：

```js
import { h, useTemplateRef } from 'vue'

export default {
  setup() {
    const divEl = useTemplateRef('my-div')

    // <div ref="my-div">
    return () => h('div', { ref: 'my-div' })
  }
}
```

<details>
<summary>3.5 之前的用法</summary>

在 3.5 之前、尚未引入 useTemplateRef() 的版本中，通过将 ref() 本身作为 props 传给 vnode 来创建模板 ref：

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```
</details>
</div>
<div class="options-api">

在 Options API 中，通过将 ref 名称作为字符串传入 vnode props 来创建模板 ref：

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## 函数组件 {#functional-components}

函数组件是组件的一种替代形式，它们没有自己的状态。它们像纯函数一样工作：输入 props，输出 vnode。它们在渲染时不会创建组件实例（即没有 `this`），也没有通常的组件生命周期钩子。

要创建一个函数组件，我们使用普通函数，而不是选项对象。这个函数实际上就是该组件的 `render` 函数。

<div class="composition-api">

函数组件的签名与 `setup()` 钩子相同：

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

由于函数组件没有 `this` 引用，Vue 会将 `props` 作为第一个参数传入：

```js
function MyComponent(props, context) {
  // ...
}
```

第二个参数 `context` 包含三个属性：`attrs`、`emit` 和 `slots`。它们分别对应实例属性 [`$attrs`](/api/component-instance#attrs)、[`$emit`](/api/component-instance#emit) 和 [`$slots`](/api/component-instance#slots)。

</div>

组件的多数常规配置选项都不适用于函数组件。不过，可以通过将 [`props`](/api/options-state#props) 和 [`emits`](/api/options-state#emits) 作为属性添加来定义它们：

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

如果未指定 `props` 选项，那么传给该函数的 `props` 对象将包含所有属性，与 `attrs` 相同。只有在指定了 `props` 选项时，prop 名称才会被规范化为 camelCase。

对于显式声明了 `props` 的函数组件，[属性透传](/guide/components/attrs) 的工作方式与普通组件大致相同。不过，对于没有显式指定 `props` 的函数组件，默认只会从 `attrs` 继承 `class`、`style` 和 `onXxx` 事件监听器。无论哪种情况，都可以将 `inheritAttrs` 设为 `false` 来禁用属性继承：

```js
MyComponent.inheritAttrs = false
```

函数组件可以像普通组件一样被注册和使用。如果你将一个函数作为 `h()` 的第一个参数传入，它会被当作函数组件处理。

### 函数组件的类型定义<sup class="vt-badge ts" /> {#typing-functional-components}

函数组件可以根据是命名还是匿名来进行类型定义。[Vue - 官方扩展](https://github.com/vuejs/language-tools) 也支持在 SFC 模板中消费类型正确的函数组件时进行正确的类型检查。

**命名函数组件**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**匿名函数组件**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```
