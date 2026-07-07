# 模板语法 {#template-syntax}

<ScrimbaLink href="https://scrimba.com/links/vue-template-syntax" title="免费的 Vue.js 模板语法课程" type="scrimba">
  在 Scrimba 上观看互动视频课程
</ScrimbaLink>

Vue 使用一种基于 HTML 的模板语法，它允许你以声明式的方式将渲染后的 DOM 绑定到底层组件实例的数据。所有 Vue 模板在语法上都是有效的 HTML，可以被符合规范的浏览器和 HTML 解析器解析。

在底层，Vue 会将模板编译为高度优化的 JavaScript 代码。结合响应式系统，Vue 能够智能地判断在应用状态变化时需要重新渲染的组件最少数量，并应用最少量的 DOM 操作。

如果你熟悉虚拟 DOM 概念，并且更喜欢 JavaScript 的原始能力，你也可以[直接编写渲染函数](/guide/extras/render-function)来代替模板，并可选地支持 JSX。不过请注意，它们不像模板那样享有同等程度的编译期优化。

## Text Interpolation {#text-interpolation}

The most basic form of data binding is text interpolation using the “Mustache” syntax (double curly braces):

```vue-html
<span>Message: {{ msg }}</span>
```

The Mustache tag will be replaced with the `msg` property value from [the corresponding component instance](/guide/essentials/reactivity-fundamentals#declaring-reactive-state). Whenever the `msg` property changes, it will also be updated.

## 原始 HTML {#raw-html}

双大括号会将数据解释为纯文本，而不是 HTML。若要输出真正的 HTML，你需要使用 [`v-html` 指令](/api/built-in-directives#v-html)：

```vue-html
<p>使用文本插值：{{ rawHtml }}</p>
<p>使用 v-html 指令：<span v-html="rawHtml"></span></p>
```

<script setup>
  const rawHtml = '<span style="color: red">这应该是红色。</span>'
</script>

<div class="demo">
  <p>使用文本插值：{{ rawHtml }}</p>
  <p>使用 v-html 指令：<span v-html="rawHtml"></span></p>
</div>

这里我们遇到了新的内容。你看到的 `v-html` 属性被称为**指令**。指令以 `v-` 为前缀，表示它们是由 Vue 提供的特殊属性，正如你可能已经猜到的那样，它们会对渲染后的 DOM 应用特殊的响应式行为。这里，我们基本上是在说：“让这个元素的 inner HTML 与当前活动实例上的 `rawHtml` 属性保持同步。”

`span` 的内容会被替换为 `rawHtml` 属性的值，并按纯 HTML 进行解释——数据绑定会被忽略。请注意，你不能使用 `v-html` 来组合模板片段，因为 Vue 不是一个基于字符串的模板引擎。相反，组件被视为 UI 复用与组合的基本单元。

:::warning 安全警告
在你的网站上动态渲染任意 HTML 可能非常危险，因为这很容易导致 [XSS 漏洞](https://en.wikipedia.org/wiki/Cross-site_scripting)。只应对可信内容使用 `v-html`，**绝不要**对用户提供的内容使用。
:::

## 属性绑定 {#attribute-bindings}

Mustache 不能在 HTML 属性内部使用。相反，请使用 [`v-bind` 指令](/api/built-in-directives#v-bind)：

```vue-html
<div v-bind:id="dynamicId"></div>
```

`v-bind` 指令会告诉 Vue 将元素的 `id` 属性与组件的 `dynamicId` 属性保持同步。如果绑定的值是 `null` 或 `undefined`，那么该属性将从渲染后的元素中移除。

### 简写 {#shorthand}

由于 `v-bind` 使用得非常频繁，它有专门的简写语法：

```vue-html
<div :id="dynamicId"></div>
```

以 `:` 开头的属性看起来可能与普通 HTML 有些不同，但事实上它是属性名中合法的字符，而且所有受 Vue 支持的浏览器都能正确解析。此外，它们不会出现在最终渲染的标记中。简写语法是可选的，但在你稍后学习更多用法时，可能会很喜欢它。

> 在本指南的其余部分，我们将在代码示例中使用简写语法，因为这是 Vue 开发者最常见的用法。

### 同名简写 {#same-name-shorthand}

- 仅支持 3.4+

如果属性名与被绑定的 JavaScript 值的变量名相同，语法还可以进一步简化，省略属性值：

```vue-html
<!-- 与 :id="id" 相同 -->
<div :id></div>

<!-- 这也可以 -->
<div v-bind:id></div>
```

这类似于在 JavaScript 中声明对象时的属性简写语法。请注意，这一特性仅在 Vue 3.4 及以上版本可用。

### 布尔属性 {#boolean-attributes}

[布尔属性](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) 是一种通过元素上是否存在来表示 true / false 值的属性。例如，[`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) 是最常用的布尔属性之一。

在这种情况下，`v-bind` 的工作方式略有不同：

```vue-html
<button :disabled="isButtonDisabled">按钮</button>
```

如果 `isButtonDisabled` 具有 [真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)，则会包含 `disabled` 属性。如果该值是空字符串，也会包含该属性，以保持与 `<button disabled="">` 一致。对于其他 [假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)，该属性将被省略。

### 动态绑定多个属性 {#dynamically-binding-multiple-attributes}

如果你有一个表示多个属性的 JavaScript 对象，如下所示：

<div class="composition-api">

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

</div>

你可以使用不带参数的 `v-bind` 将它们绑定到单个元素：

```vue-html
<div v-bind="objectOfAttrs"></div>
```

## 使用 JavaScript 表达式 {#using-javascript-expressions}

到目前为止，我们在模板中只绑定到了简单的属性键。但 Vue 实际上支持在所有数据绑定中使用完整的 JavaScript 表达式能力：

```vue-html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

这些表达式会在当前组件实例的数据作用域中作为 JavaScript 求值。

在 Vue 模板中，JavaScript 表达式可用于以下位置：

- 文本插值（mustache）内部
- 任何 Vue 指令的属性值中（以 `v-` 开头的特殊属性）

### 仅限表达式 {#expressions-only}

每个绑定中只能包含**一个单独的表达式**。表达式是一段可以被求值为某个值的代码。一个简单的判断方法是：它是否可以放在 `return` 之后使用。

因此，下面这种写法**不会**生效：

```vue-html
<!-- 这是语句，不是表达式： -->
{{ var a = 1 }}

<!-- 控制流也不行，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

### 调用函数 {#calling-functions}

可以在绑定表达式中调用组件暴露的方法：

```vue-html
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```

:::tip
在绑定表达式中调用的函数会在组件每次更新时都被调用，因此它们**不应**具有任何副作用，例如修改数据或触发异步操作。
:::

### 受限的全局对象访问 {#restricted-globals-access}

模板表达式是沙箱化的，只能访问[受限的全局对象列表](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3)。该列表暴露了常用的内置全局对象，例如 `Math` 和 `Date`。

列表中未明确包含的全局对象，例如挂载在 `window` 上的用户属性，在模板表达式中都无法访问。不过，你可以通过将它们添加到 [`app.config.globalProperties`](/api/application#app-config-globalproperties) 中，为所有 Vue 表达式显式定义额外的全局对象。

## 指令 {#directives}

指令是带有 `v-` 前缀的特殊属性。Vue 提供了许多[内置指令](/api/built-in-directives)，包括我们上面介绍过的 `v-html` 和 `v-bind`。

指令属性值预期为单个 JavaScript 表达式（`v-for`、`v-on` 和 `v-slot` 除外，这些会在后面的各自章节中讨论）。指令的作用是：当其表达式的值变化时，响应式地将更新应用到 DOM 上。以 [`v-if`](/api/built-in-directives#v-if) 为例：

```vue-html
<p v-if="seen">现在你看见我了</p>
```

这里，`v-if` 指令会根据表达式 `seen` 的真假值来移除或插入 `<p>` 元素。

### 参数 {#arguments}

某些指令可以接收一个“参数”，通过指令名后面的冒号来表示。例如，`v-bind` 指令用于响应式地更新 HTML 属性：

```vue-html
<a v-bind:href="url"> ... </a>

<!-- 简写 -->
<a :href="url"> ... </a>
```

这里，`href` 是参数，它告诉 `v-bind` 指令将元素的 `href` 属性绑定到表达式 `url` 的值。在简写中，参数前面的所有内容（即 `v-bind:`）都被压缩成一个字符 `:`。

另一个例子是 `v-on` 指令，它用于监听 DOM 事件：

```vue-html
<a v-on:click="doSomething"> ... </a>

<!-- 简写 -->
<a @click="doSomething"> ... </a>
```

这里，参数是要监听的事件名称：`click`。`v-on` 也有对应的简写，即 `@` 字符。我们之后也会更详细地讲解事件处理。

### 动态参数 {#dynamic-arguments}

也可以通过使用方括号将 JavaScript 表达式包裹起来，把它用作指令参数：

```vue-html
<!--
请注意，参数表达式存在一些约束，
如下文“动态参数值约束”和“动态参数语法约束”两节所述。
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- 简写 -->
<a :[attributeName]="url"> ... </a>
```

这里，`attributeName` 会作为 JavaScript 表达式动态求值，其求值结果将作为参数的最终值。例如，如果你的组件实例有一个数据属性 `attributeName`，其值为 `"href"`，那么这个绑定就等同于 `v-bind:href`。

类似地，你也可以使用动态参数将处理器绑定到动态的事件名称：

```vue-html
<a v-on:[eventName]="doSomething"> ... </a>

<!-- 简写 -->
<a @[eventName]="doSomething"> ... </a>
```

在这个例子中，当 `eventName` 的值是 `"focus"` 时，`v-on:[eventName]` 就等同于 `v-on:focus`。

#### 动态参数值约束 {#dynamic-argument-value-constraints}

动态参数预期求值为字符串，`null` 除外。特殊值 `null` 可用于显式移除该绑定。任何其他非字符串值都会触发警告。

#### 动态参数语法约束 {#dynamic-argument-syntax-constraints}

动态参数表达式有一些语法约束，因为某些字符，例如空格和引号，在 HTML 属性名中是无效的。例如，下面这种写法是无效的：

```vue-html
<!-- 这会触发编译器警告。 -->
<a :['foo' + bar]="value"> ... </a>
```

如果你需要传递复杂的动态参数，最好使用[计算属性](./computed)，我们很快就会介绍它。

在使用 DOM 内模板（直接写在 HTML 文件中的模板）时，你也应避免使用大写字符命名键，因为浏览器会将属性名强制转换为小写：

```vue-html
<a :[someAttr]="value"> ... </a>
```

上面的代码在 DOM 内模板中会被转换为 `:[someattr]`。如果你的组件有一个 `someAttr` 属性而不是 `someattr`，代码将无法正常工作。单文件组件中的模板**不受**此约束影响。

### 修饰符 {#modifiers}

修饰符是用点号表示的特殊后缀，用于表明某个指令应以某种特殊方式绑定。例如，`.prevent` 修饰符会告诉 `v-on` 指令在触发的事件上调用 `event.preventDefault()`：

```vue-html
<form @submit.prevent="onSubmit">...</form>
```

当我们进一步探索这些特性时，你还会看到其他修饰符的示例，[用于 `v-on`](./event-handling#event-modifiers) 和[用于 `v-model`](./forms#modifiers)。

最后，这里是完整的指令语法示意图：

![Diagram visualizing the full directive syntax, including directive name, argument, modifiers, and value](./images/directive.png)

<!-- https://www.figma.com/file/BGWUknIrtY9HOmbmad0vFr/Directive -->
