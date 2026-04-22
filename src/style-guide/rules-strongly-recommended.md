# 优先级 B 规则：强烈推荐 {#priority-b-rules-strongly-recommended}

::: warning 注意
本 Vue.js 风格指南已过时，需要审查。如果你有任何问题或建议，请[提交 issue](https://github.com/vuejs/docs/issues/new)。
:::

这些规则已被证明在大多数项目中有助于提升可读性和/或开发者体验。即使你违反了它们，代码仍然可以运行，但违规应当是少数且有充分理由的。

## 组件文件 {#component-files}

**只要有可用于合并文件的构建系统，每个组件都应该放在自己的文件中。**

这有助于你在需要编辑组件或查看如何使用它时，更快地找到它。

<div class="style-example style-example-bad">
<h3>坏</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## 单文件组件文件名大小写 {#single-file-component-filename-casing}

**[单文件组件](/guide/scaling-up/sfc)的文件名应始终使用 PascalCase 或始终使用 kebab-case。**

PascalCase 与代码编辑器中的自动补全配合得最好，因为它与我们在 JS(X) 和模板中引用组件的方式保持一致，只要有可能都是如此。不过，混合大小写的文件名有时会在大小写不敏感的文件系统上引发问题，因此 kebab-case 也完全可以接受。

<div class="style-example style-example-bad">
<h3>坏</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## 基础组件名称 {#base-component-names}

**为应用特定的样式和约定提供支持的基础组件（也称展示型、傻瓜型或纯组件）都应该以特定前缀开头，例如 `Base`、`App` 或 `V`。**

::: details 详细说明
这些组件为应用中的一致样式和行为奠定基础。它们可能**只**包含：

- HTML 元素，
- 其他基础组件，以及
- 第三方 UI 组件。

但它们**绝不会**包含全局状态（例如来自 [Pinia](https://pinia.vuejs.org/) store）。

它们的名称通常会包含其包裹的元素名称（例如 `BaseButton`、`BaseTable`），除非它们的特定用途没有对应元素（例如 `BaseIcon`）。如果你为更具体的上下文构建类似组件，它们几乎总是会消费这些组件（例如 `BaseButton` 可能会在 `ButtonSubmit` 中使用）。

这种约定有一些优点：

- 在编辑器中按字母顺序排列时，你应用的基础组件会被一起列出，因此更容易识别。

- 由于组件名称应始终为多词名称，这种约定可以避免你为简单的组件包装器去选择一个随意的前缀（例如 `MyButton`、`VueButton`）。

- 由于这些组件使用非常频繁，你可能希望直接将它们注册为全局组件，而不是到处导入它们。使用前缀可以让 Webpack 实现这一点：

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>坏</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## 紧密耦合的组件名称 {#tightly-coupled-component-names}

**与父组件紧密耦合的子组件，应在名称中包含父组件名称作为前缀。**

如果一个组件只在某个单一父组件的上下文中才有意义，那么这种关系就应该在它的名称中体现出来。由于编辑器通常按字母顺序组织文件，这也能让这些相关文件彼此相邻。

::: details 详细说明
你可能会想通过将子组件嵌套在以其父组件命名的目录中来解决这个问题。例如：

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

或者：

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

不推荐这样做，因为这会导致：

- 很多文件名称相似，使得在代码编辑器中快速切换文件更困难。
- 很多嵌套子目录，会增加在编辑器侧边栏中浏览组件所需的时间。
  :::

<div class="style-example style-example-bad">
<h3>坏</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## 组件名称中的词序 {#order-of-words-in-component-names}

**组件名称应以最高层级（通常是最通用）的词开头，并以描述性的修饰词结尾。**

::: details 详细说明
你可能会想：

> “为什么我们要强制组件名称使用不那么自然的语言顺序？”

在自然英语中，形容词和其他修饰语通常出现在名词前面，而例外情况则需要连接词。例如：

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

如果你愿意，完全可以在组件名称中包含这些连接词，但顺序仍然很重要。

另外要注意，**什么算作“最高层级”会因你的应用而异**。例如，设想一个带有搜索表单的应用。它可能包含如下组件：

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

你可能会注意到，很难看出哪些组件是搜索相关的。现在根据这条规则重命名这些组件：

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

由于编辑器通常按字母顺序组织文件，现在一眼就能看出组件之间所有重要的关系。

你可能会想用另一种方式解决这个问题：将所有搜索组件放在一个“search”目录下，再将所有设置组件放在一个“settings”目录下。我们只建议在非常大的应用中（例如 100+ 个组件）考虑这种方法，原因如下：

- 与在单个 `components` 目录中滚动相比，浏览嵌套子目录通常需要更多时间。
- 命名冲突（例如多个 `ButtonDelete.vue` 组件）会使在代码编辑器中快速导航到特定组件变得更困难。
- 重构会变得更困难，因为“查找并替换”通常不足以更新已移动组件的相对引用。
  :::

<div class="style-example style-example-bad">
<h3>坏</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## 自闭合组件 {#self-closing-components}

**在[单文件组件](/guide/scaling-up/sfc)、字符串模板和 [JSX](/guide/extras/render-function#jsx-tsx) 中，没有内容的组件应使用自闭合形式——但在 in-DOM 模板中绝不应如此。**

自闭合的组件表明它们不仅没有内容，而且**本来就**不应该有内容。这就像书里的一页空白页和标注着“本页故意留白”的页面之间的区别。你的代码也会因为省去不必要的闭合标签而更简洁。

不幸的是，HTML 不允许自定义元素自闭合——只有 [官方的“空元素”](https://www.w3.org/TR/html/syntax.html#void-elements) 才可以。这就是为什么只有当 Vue 的模板编译器能在 DOM 之前处理模板时，这种策略才可行，然后再输出符合 DOM 规范的 HTML。

<div class="style-example style-example-bad">
<h3>坏</h3>

```vue-html
<!-- 在单文件组件、字符串模板和 JSX 中 -->
<MyComponent></MyComponent>
```

```vue-html
<!-- 在 in-DOM 模板中 -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```vue-html
<!-- 在单文件组件、字符串模板和 JSX 中 -->
<MyComponent/>
```

```vue-html
<!-- 在 in-DOM 模板中 -->
<my-component></my-component>
```

</div>

## 模板中的组件名称大小写 {#component-name-casing-in-templates}

**在大多数项目中，组件名称在[单文件组件](/guide/scaling-up/sfc)和字符串模板中应始终使用 PascalCase，但在 in-DOM 模板中应使用 kebab-case。**

与 kebab-case 相比，PascalCase 有几个优点：

- 编辑器可以在模板中自动补全组件名称，因为 JavaScript 中也使用 PascalCase。
- `<MyComponent>` 与单词形式的 HTML 元素相比，比 `<my-component>` 更加醒目，因为前者有两个字符差异（两个大写字母），而后者只有一个（一个连字符）。
- 如果你在模板中使用任何非 Vue 的自定义元素，例如 web component，PascalCase 可以确保你的 Vue 组件仍然清晰可见。

不幸的是，由于 HTML 不区分大小写，in-DOM 模板仍然必须使用 kebab-case。

另外要注意，如果你已经在 kebab-case 上投入很多，那么与 HTML 约定保持一致，并且能在所有项目中使用相同的大小写格式，可能比上面列出的优点更重要。在这些情况下，**全局使用 kebab-case 也是可以接受的。**

<div class="style-example style-example-bad">
<h3>坏</h3>

```vue-html
<!-- 在单文件组件和字符串模板中 -->
<mycomponent/>
```

```vue-html
<!-- 在单文件组件和字符串模板中 -->
<myComponent/>
```

```vue-html
<!-- 在 in-DOM 模板中 -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>好</h3>

```vue-html
<!-- 在单文件组件和字符串模板中 -->
<MyComponent/>
```

```vue-html
<!-- 在 in-DOM 模板中 -->
<my-component></my-component>
```

或者

```vue-html
<!-- 在所有地方 -->
<my-component></my-component>
```

</div>

## JS/JSX 中的组件名称大小写 {#component-name-casing-in-js-jsx}

**JS/[JSX](/guide/extras/render-function#jsx-tsx) 中的组件名称应始终使用 PascalCase，不过对于仅通过 `app.component` 进行全局组件注册、且应用较简单的场景，也可以在字符串中使用 kebab-case。**

::: details 详细说明
在 JavaScript 中，PascalCase 是类和原型构造函数的惯例——本质上，任何可以拥有不同实例的东西都是如此。Vue 组件也有实例，因此使用 PascalCase 也是合理的。额外的好处是，在 JSX（以及模板）中使用 PascalCase，可以让代码读者更容易区分组件和 HTML 元素。

不过，对于**仅**通过 `app.component` 使用全局组件定义的应用，我们更推荐使用 kebab-case。原因如下：

- 全局组件很少会在 JavaScript 中被引用，因此遵循 JavaScript 的命名惯例意义不大。
- 这类应用总是包含许多 DOM 内模板，而 [kebab-case **必须** 使用](#component-name-casing-in-templates)。
  :::

<div class="style-example style-example-bad">
<h3>错误</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## 组件名称使用完整单词 {#full-word-component-names}

**组件名称应优先使用完整单词，而不是缩写。**

编辑器中的自动补全使得输入较长名称的成本非常低，而它们带来的清晰度却非常有价值。尤其应始终避免使用不常见的缩写。

<div class="style-example style-example-bad">
<h3>错误</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## Prop 名称大小写 {#prop-name-casing}

**Prop 名称在声明时应始终使用 camelCase。当在 DOM 内模板中使用时，props 应使用 kebab-case。单文件组件模板和 [JSX](/guide/extras/render-function#jsx-tsx) 可以使用 kebab-case 或 camelCase 的 props。大小写应保持一致——如果你选择使用 camelCase 的 props，请确保在应用中不要使用 kebab-case 的 props**

<div class="style-example style-example-bad">
<h3>错误</h3>

<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// 对于 DOM 内模板
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// 对于 SFC - 请确保整个项目中的大小写保持一致
// 你可以使用任一约定，但我们不建议混用两种不同的大小写风格
<WelcomeMessage greeting-text="hi"/>
// 或者
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// 对于 DOM 内模板
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## 多属性元素 {#multi-attribute-elements}

**带有多个属性的元素应该换行书写，每行一个属性。**

在 JavaScript 中，将包含多个属性的对象拆分到多行，通常被认为是一种良好惯例，因为这样更易于阅读。我们的模板和 [JSX](/guide/extras/render-function#jsx-tsx) 也应如此。

<div class="style-example style-example-bad">
<h3>错误</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## 模板中的简单表达式 {#simple-expressions-in-templates}

**组件模板中应只包含简单表达式，更复杂的表达式应重构到计算属性或方法中。**

模板中的复杂表达式会降低其声明性。我们应努力描述“应该显示什么”，而不是“我们如何计算这个值”。计算属性和方法也允许代码复用。

<div class="style-example style-example-bad">
<h3>错误</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```vue-html
<!-- 在模板中 -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// 复杂表达式已被移到计算属性中
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// 复杂表达式已被移到计算属性中
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## 简单的计算属性 {#simple-computed-properties}

**复杂的计算属性应尽可能拆分为更多更简单的属性。**

::: details 详细说明
更简单、命名良好的计算属性具有以下优点：

- **更容易测试**

  当每个计算属性只包含一个非常简单的表达式，并且依赖项很少时，就更容易编写测试来确认它能正确工作。

- **更容易阅读**

  简化计算属性会迫使你为每个值提供一个描述性的名称，即使它没有被复用。这会让其他开发者（以及未来的你）更容易聚焦在他们关心的代码上，并弄清楚究竟发生了什么。

- **更能适应需求变化**

  任何可以命名的值都可能对视图有用。例如，我们可能决定显示一条消息，告诉用户他们节省了多少钱。我们也可能决定计算销售税，但也许会将其单独显示，而不是作为最终价格的一部分。

  小而聚焦的计算属性对信息将如何被使用所做的假设更少，因此在需求变化时需要更少的重构。
  :::

<div class="style-example style-example-bad">
<h3>错误</h3>

<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## 带引号的属性值 {#quoted-attribute-values}

**非空的 HTML 属性值应始终放在引号中（单引号或双引号，取决于在 JS 中没有被使用的那一种）。**

虽然没有空格的属性值在 HTML 中不强制要求加引号，但这种做法常常会导致人们为了避免空格而牺牲可读性，使属性值变得不够清晰。

<div class="style-example style-example-bad">
<h3>错误</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## 指令简写 {#directive-shorthands}

**指令简写（`:` 代表 `v-bind:`，`@` 代表 `v-on:`，`#` 代表 `v-slot`）应当始终使用或始终不使用。**

<div class="style-example style-example-bad">
<h3>错误</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>这里可能是一个页面标题</h1>
</template>

<template #footer>
  <p>这里有一些联系信息</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>正确</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>这里可能是一个页面标题</h1>
</template>

<template v-slot:footer>
  <p>这里有一些联系信息</p>
</template>
```

```vue-html
<template #header>
  <h1>这里可能是一个页面标题</h1>
</template>

<template #footer>
  <p>这里有一些联系信息</p>
</template>
```

</div>
