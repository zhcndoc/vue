# 表单绑定 {#form-bindings}

结合使用 `v-bind` 和 `v-on`，我们可以在表单输入元素上创建双向绑定：

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // 一个 v-on 处理器会接收原生 DOM 事件
    // 作为参数。
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // 一个 v-on 处理器会接收原生 DOM 事件
  // 作为参数。
  text.value = e.target.value
}
```

</div>

试着在输入框中输入内容——你应该会看到 `<p>` 中的文本随着你的输入而更新。

为了简化双向绑定，Vue 提供了一个指令 `v-model`，它本质上是上述写法的语法糖：

```vue-html
<input v-model="text">
```

`v-model` 会自动将 `<input>` 的值与绑定的状态同步，因此我们不再需要为此使用事件处理器。

`v-model` 不仅适用于文本输入框，也适用于其他类型的输入，例如复选框、单选按钮和下拉选择框。更多细节请参见 <a target="_blank" href="/guide/essentials/forms.html">指南 - 表单绑定</a>。

现在，试着重构这段代码，改为使用 `v-model`。
