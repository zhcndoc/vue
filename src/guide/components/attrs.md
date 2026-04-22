---
outline: deep
---

# 透传 Attributes {#fallthrough-attributes}

> 本页面假设你已经阅读过 [组件基础](/guide/essentials/component-basics)。如果你是组件新手，请先阅读那一节。

## Attribute 继承 {#attribute-inheritance}

“透传 attribute” 是指传递给组件的 attribute 或 `v-on` 事件监听器，但没有被接收组件的 [props](./props) 或 [emits](./events#declaring-emitted-events) 明确定义。常见的例子包括 `class`、`style` 和 `id` 属性。

当一个组件渲染单个根元素时，透传 attribute 会自动添加到根元素的 attribute 上。例如，假设有一个 `<MyButton>` 组件，其模板如下：

```vue-html
<!-- <MyButton> 的模板 -->
<button>Click Me</button>
```

并且父组件这样使用它：

```vue-html
<MyButton class="large" />
```

最终渲染出的 DOM 将是：

```html
<button class="large">Click Me</button>
```

这里，`<MyButton>` 并没有将 `class` 声明为可接受的 prop。因此，`class` 会被视为一个透传 attribute，并自动添加到 `<MyButton>` 的根元素上。

### `class` 和 `style` 的合并 {#class-and-style-merging}

如果子组件的根元素上已经存在 `class` 或 `style` 属性，它会与从父组件继承来的 `class` 和 `style` 值合并。假设我们把前面示例中的 `<MyButton>` 模板改为：

```vue-html
<!-- <MyButton> 的模板 -->
<button class="btn">Click Me</button>
```

那么最终渲染出的 DOM 现在会变成：

```html
<button class="btn large">Click Me</button>
```

### `v-on` 监听器继承 {#v-on-listener-inheritance}

同样的规则也适用于 `v-on` 事件监听器：

```vue-html
<MyButton @click="onClick" />
```

`click` 监听器会被添加到 `<MyButton>` 的根元素上，也就是原生的 `<button>` 元素上。当原生 `<button>` 被点击时，它会触发父组件的 `onClick` 方法。如果原生 `<button>` 已经通过 `v-on` 绑定了一个 `click` 监听器，那么这两个监听器都会触发。

### 嵌套组件继承 {#nested-component-inheritance}

如果一个组件将另一个组件作为其根节点来渲染，例如，我们把 `<MyButton>` 重构为将 `<BaseButton>` 作为根节点渲染：

```vue-html
<!-- 仅渲染另一个组件的 <MyButton/> 模板 -->
<BaseButton />
```

那么 `<MyButton>` 接收到的透传 attribute 会自动向下传递给 `<BaseButton>`。

注意：

1. 传递的 attribute 不包括 `<MyButton>` 已声明为 props 的任何 attribute，或者已声明事件的 `v-on` 监听器——换句话说，已声明的 props 和监听器已经被 `<MyButton>` “消耗”了。

2. 如果 `<BaseButton>` 声明了相应的 props，那么这些传递的 attribute 也可能会被它作为 props 接收。

## 禁用 Attribute 继承 {#disabling-attribute-inheritance}

如果你**不**希望组件自动继承 attribute，可以在组件选项中设置 `inheritAttrs: false`。

<div class="composition-api">

 从 3.3 开始，你也可以在 `<script setup>` 中直接使用 [`defineOptions`](/api/sfc-script-setup#defineoptions)：

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
```

</div>

禁用 attribute 继承的常见场景是：attribute 需要应用到根节点之外的其他元素上。通过将 `inheritAttrs` 选项设为 `false`，你可以完全控制透传 attribute 应该应用到哪里。

这些透传 attribute 可以在模板表达式中通过 `$attrs` 直接访问：

```vue-html
<span>透传的 attributes：{{ $attrs }}</span>
```

`$attrs` 对象包含了所有未被组件的 `props` 或 `emits` 选项声明的 attribute（例如 `class`、`style`、`v-on` 监听器等）。

一些说明：

- 与 props 不同，透传 attribute 在 JavaScript 中会保留其原始大小写，因此像 `foo-bar` 这样的 attribute 需要通过 `$attrs['foo-bar']` 来访问。

- 像 `@click` 这样的 `v-on` 事件监听器会作为 `$attrs.onClick` 下的一个函数暴露在对象上。

以上一节的 `<MyButton>` 组件示例为例——有时我们可能需要为了样式目的，在实际的 `<button>` 元素外包一层额外的 `<div>`：

```vue-html
<div class="btn-wrapper">
  <button class="btn">Click Me</button>
</div>
```

我们希望像 `class` 和 `v-on` 监听器这样的所有透传 attribute 都应用到内部的 `<button>`，而不是外层的 `<div>`。我们可以通过 `inheritAttrs: false` 和 `v-bind="$attrs"` 来实现这一点：

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
```

请记住，[不带参数的 `v-bind`](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) 会将一个对象的所有属性绑定为目标元素的属性。

## 多个根节点上的 Attribute 继承 {#attribute-inheritance-on-multiple-root-nodes}

与单个根节点的组件不同，具有多个根节点的组件不会自动进行 attribute 透传。如果没有显式绑定 `$attrs`，运行时会发出警告。

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

如果 `<CustomLayout>` 具有如下多根模板，由于 Vue 无法确定应将透传 attribute 应用到哪里，因此会发出警告：

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

如果显式绑定了 `$attrs`，则会抑制该警告：

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## 在 JavaScript 中访问透传 Attributes {#accessing-fallthrough-attributes-in-javascript}

<div class="composition-api">

如果需要，你可以在 `<script setup>` 中使用 `useAttrs()` API 来访问组件的透传 attribute：

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

如果不使用 `<script setup>`，`attrs` 会作为 `setup()` 上下文的一个属性暴露出来：

```js
export default {
  setup(props, ctx) {
    // 透传 attribute 作为 ctx.attrs 暴露
    console.log(ctx.attrs)
  }
}
```

请注意，虽然这里的 `attrs` 对象总是反映最新的透传 attribute，但它不是响应式的（出于性能原因）。你不能使用 watcher 来观察它的变化。如果你需要响应性，请使用 prop。或者，你也可以使用 `onUpdated()` 在每次更新时利用最新的 `attrs` 执行副作用。

</div>

<div class="options-api">

如果需要，你可以通过 `$attrs` 实例属性访问组件的透传 attribute：

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>
