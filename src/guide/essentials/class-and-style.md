# 类和样式绑定 {#class-and-style-bindings}

数据绑定的一个常见需求是操作元素的 class 列表和内联样式。由于 `class` 和 `style` 都是属性，我们可以使用 `v-bind` 为它们动态赋值，就像处理其他属性一样。然而，尝试通过字符串拼接来生成这些值可能会很麻烦，而且容易出错。因此，当 `v-bind` 与 `class` 和 `style` 一起使用时，Vue 提供了特殊增强。除了字符串之外，这些表达式还可以求值为对象或数组。

## 绑定 HTML Class {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="免费 Vue.js 动态 CSS Class 课程"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="免费 Vue.js 动态 CSS Class 课程"/>
</div>

### 绑定对象 {#binding-to-objects}

我们可以将一个对象传递给 `:class`（`v-bind:class` 的缩写），以动态切换 class：

```vue-html
<div :class="{ active: isActive }"></div>
```

上面的语法表示，`active` 这个 class 的存在与否将由数据属性 `isActive` 的 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 值决定。

你可以在对象中包含更多字段来切换多个 class。另外，`:class` 指令也可以和普通的 `class` 属性共存。假设有如下状态：

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

以及如下模板：

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

它会渲染为：

```vue-html
<div class="static active"></div>
```

当 `isActive` 或 `hasError` 改变时，class 列表也会随之更新。例如，如果 `hasError` 变成 `true`，class 列表就会变成 `"static active text-danger"`。

绑定的对象不一定要写成内联形式：

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

这将渲染为：

```vue-html
<div class="active"></div>
```

我们还可以绑定一个返回对象的 [computed property](./computed)。这是一种常见且强大的模式：

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### 绑定数组 {#binding-to-arrays}

我们可以将 `:class` 绑定到数组，以应用一个 class 列表：

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

这将渲染为：

```vue-html
<div class="active text-danger"></div>
```

如果你还想有条件地切换列表中的某个 class，可以使用三元表达式：

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

这会始终应用 `errorClass`，但只有当 `isActive` 为 truthy 时才会应用 `activeClass`。

不过，如果你有多个条件 class，这样写会有点冗长。因此，也可以在数组语法中使用对象语法：

```vue-html
<div :class="[{ [activeClass]: isActive }, errorClass]"></div>
```

### 在组件上使用 {#with-components}

> 本节假设你已经了解 [组件](/guide/essentials/component-basics)。如果愿意，可以先跳过，之后再回来阅读。

当你在具有单一根元素的组件上使用 `class` 属性时，这些 class 会被添加到该组件的根元素上，并与其上已有的 class 合并。

例如，如果我们有一个名为 `MyComponent` 的组件，其模板如下：

```vue-html
<!-- 子组件模板 -->
<p class="foo bar">Hi!</p>
```

然后在使用它时添加一些 class：

```vue-html
<!-- 使用组件时 -->
<MyComponent class="baz boo" />
```

渲染后的 HTML 将是：

```vue-html
<p class="foo bar baz boo">Hi!</p>
```

对于 class 绑定也是如此：

```vue-html
<MyComponent :class="{ active: isActive }" />
```

当 `isActive` 为 truthy 时，渲染后的 HTML 将是：

```vue-html
<p class="foo bar active">Hi!</p>
```

如果你的组件有多个根元素，就需要定义哪个元素接收这个 class。你可以使用 `$attrs` 组件属性来做到这一点：

```vue-html
<!-- 使用 $attrs 的 MyComponent 模板 -->
<p :class="$attrs.class">Hi!</p>
<span>这是一个子组件</span>
```

```vue-html
<MyComponent class="baz" />
```

将渲染为：

```html
<p class="baz">Hi!</p>
<span>这是一个子组件</span>
```

你可以在 [Fallthrough Attributes](/guide/components/attrs) 章节中了解更多关于组件属性继承的内容。

## 绑定内联样式 {#binding-inline-styles}

### 绑定对象 {#binding-to-objects-1}

`:style` 支持绑定 JavaScript 对象值——它对应于一个 [HTML 元素的 `style` 属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)：

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

虽然推荐使用 camelCase 键，但 `:style` 也支持 kebab-case 的 CSS 属性键（与它们在实际 CSS 中的用法一致）——例如：

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

通常直接绑定到一个样式对象会更好，这样模板会更简洁：

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '30px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

同样，对象式样式绑定经常与返回对象的 computed properties 一起使用。

`:style` 指令也可以和普通的 style 属性共存，就像 `:class` 一样。

模板：

```vue-html
<h1 style="color: red" :style="'font-size: 1em'">hello</h1>
```

它会渲染为：

```vue-html
<h1 style="color: red; font-size: 1em;">hello</h1>
```

### 绑定数组 {#binding-to-arrays-1}

我们可以将 `:style` 绑定到一个包含多个样式对象的数组。这些对象会被合并并应用到同一个元素上：

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 自动添加前缀 {#auto-prefixing}

当你在 `:style` 中使用需要 [vendor prefix](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) 的 CSS 属性时，Vue 会自动添加合适的前缀。Vue 会在运行时检查当前浏览器支持哪些样式属性来完成这一点。如果浏览器不支持某个特定属性，它会尝试测试各种带前缀的变体，以找到一个受支持的版本。

### 多重值 {#multiple-values}

你可以为某个样式属性提供一个包含多个（带前缀）值的数组，例如：

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

这只会渲染数组中浏览器支持的最后一个值。在这个例子中，对于支持 flexbox 非前缀版本的浏览器，它会渲染 `display: flex`。
