# 条件渲染 {#conditional-rendering}

我们可以使用 `v-if` 指令来有条件地渲染一个元素：

```vue-html
<h1 v-if="awesome">Vue 太棒了！</h1>
```

只有当 `awesome` 的值为 [真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 时，这个 `<h1>` 才会被渲染。如果 `awesome` 变为 [假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)，它将从 DOM 中移除。

我们还可以使用 `v-else` 和 `v-else-if` 来表示条件的其他分支：

```vue-html
<h1 v-if="awesome">Vue 太棒了！</h1>
<h1 v-else>哦不 😢</h1>
```

目前，演示同时显示了两个 `<h1>`，而按钮没有任何作用。尝试为它们添加 `v-if` 和 `v-else` 指令，并实现 `toggle()` 方法，这样我们就可以使用按钮在它们之间切换。

更多关于 `v-if` 的细节：<a target="_blank" href="/guide/essentials/conditional.html">指南 - 条件渲染</a>
