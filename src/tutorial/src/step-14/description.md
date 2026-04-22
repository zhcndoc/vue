# 插槽 {#slots}

除了通过 props 传递数据外，父组件还可以通过 **插槽** 将模板片段传递给子组件：

<div class="sfc">

```vue-html
<ChildComp>
  这是一些插槽内容！
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  这是一些插槽内容！
</child-comp>
```

</div>

在子组件中，可以使用 `<slot>` 元素作为出口来渲染来自父组件的插槽内容：

<div class="sfc">

```vue-html
<!-- 在子模板中 -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- 在子模板中 -->
<slot></slot>
```

</div>

`<slot>` 出口中的内容会被视为“后备”内容：如果父组件没有传递任何插槽内容，就会显示它：

```vue-html
<slot>后备内容</slot>
```

目前我们还没有向 `<ChildComp>` 传递任何插槽内容，所以你应该能看到后备内容。现在让我们在使用父组件 `msg` 状态的同时，给子组件提供一些插槽内容。
