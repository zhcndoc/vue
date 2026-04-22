# 属性绑定 {#attribute-bindings}

在 Vue 中，mustache 仅用于文本插值。要将属性绑定到动态值，我们使用 `v-bind` 指令：

```vue-html
<div v-bind:id="dynamicId"></div>
```

**指令** 是一种以 `v-` 前缀开头的特殊属性。它们是 Vue 模板语法的一部分。与文本插值类似，指令的值是可以访问组件状态的 JavaScript 表达式。`v-bind` 和指令语法的完整细节在 <a target="_blank" href="/guide/essentials/template-syntax.html">指南 - 模板语法</a> 中讨论。

冒号后面的部分（`:id`）是该指令的“参数”。这里，元素的 `id` 属性会与组件状态中的 `dynamicId` 属性保持同步。

由于 `v-bind` 使用得非常频繁，它有一个专门的简写语法：

```vue-html
<div :id="dynamicId"></div>
```

现在，试着给 `<h1>` 添加一个动态的 `class` 绑定，使用 `titleClass` <span class="options-api">data 属性</span><span class="composition-api">ref</span> 作为它的值。如果绑定正确，文本应该会变成红色。
