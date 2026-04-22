# Teleport {#teleport}

 <VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="免费 Vue.js Teleport 课程"/>

`<Teleport>` 是一个内置组件，它允许我们将组件模板的一部分“传送”到该组件 DOM 层级之外存在的某个 DOM 节点中。

## 基本用法 {#basic-usage}

有时，组件模板中的一部分在逻辑上属于它，但从视觉上看，它应该显示在 DOM 的其他位置，甚至可能是在 Vue 应用之外。

最常见的例子就是构建全屏模态框时。理想情况下，我们希望模态框按钮和模态框本身的代码写在同一个单文件组件中，因为它们都与模态框的打开 / 关闭状态相关。但这也意味着模态框会和按钮一起渲染，深深嵌套在应用的 DOM 层级中。这会在通过 CSS 定位模态框时带来一些棘手的问题。

考虑以下 HTML 结构。

```vue-html
<div class="outer">
  <h3>Vue Teleport 示例</h3>
  <div>
    <MyModal />
  </div>
</div>
```

下面是 `<MyModal>` 的实现：

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">打开模态框</button>

  <div v-if="open" class="modal">
    <p>来自模态框的问候！</p>
    <button @click="open = false">关闭</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">打开模态框</button>

  <div v-if="open" class="modal">
    <p>来自模态框的问候！</p>
    <button @click="open = false">关闭</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

该组件包含一个用于触发模态框打开的 `<button>`，以及一个带有 `.modal` 类的 `<div>`，其中包含模态框的内容和一个用于自行关闭的按钮。

当在最初的 HTML 结构中使用这个组件时，可能会出现一些问题：

- `position: fixed` 只有在没有祖先元素设置了 `transform`、`perspective` 或 `filter` 属性时，才会将元素相对于视口定位。如果例如我们打算给祖先 `<div class="outer">` 添加 CSS transform 动画，那就会破坏模态框布局！

- 模态框的 `z-index` 会受到其包含元素的限制。如果有另一个元素与 `<div class="outer">` 重叠，并且具有更高的 `z-index`，它就会遮住我们的模态框。

`<Teleport>` 提供了一种简洁的方式来规避这些问题，它允许我们跳出嵌套的 DOM 结构。让我们修改 `<MyModal>` 以使用 `<Teleport>`：

```vue-html{3,8}
<button @click="open = true">打开模态框</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>来自模态框的问候！</p>
    <button @click="open = false">关闭</button>
  </div>
</Teleport>
```

`<Teleport>` 的 `to` 目标可以是一个 CSS 选择器字符串，也可以是一个真实的 DOM 节点。这里，我们实际上是在告诉 Vue 将这个模板片段“**传送**”到 **`body`** 标签中。

你可以点击下面的按钮，并通过浏览器开发者工具检查 `<body>` 标签：

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="demo">
  <button @click="open = true">打开模态框</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">来自模态框的问候！</p>
        <button @click="open = false">关闭</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

你可以将 `<Teleport>` 与 [`<Transition>`](./transition) 结合起来创建带动画的模态框 - 参见[这里的示例](/examples/#modal)。

:::tip
teleport 的 `to` 目标在 `<Teleport>` 组件挂载时必须已经存在于 DOM 中。理想情况下，它应该是整个 Vue 应用之外的一个元素。如果目标是由 Vue 渲染的另一个元素，则需要确保该元素在 `<Teleport>` 之前挂载。如果你正在使用 SSR，请参见 [在 SSR 中处理 Teleports](/guide/scaling-up/ssr#teleports)。
:::

## 与组件一起使用 {#using-with-components}

`<Teleport>` 只会改变渲染后的 DOM 结构——它不会影响组件的逻辑层级。也就是说，如果 `<Teleport>` 中包含一个组件，那么该组件在逻辑上仍然是包含 `<Teleport>` 的父组件的子组件。props 传递和事件触发将继续以相同的方式工作。

这也意味着来自父组件的注入会按预期工作，并且该子组件会在 Vue Devtools 中嵌套在父组件下面，而不是显示在实际内容被移动到的位置。

## 禁用 Teleport {#disabling-teleport}

在某些情况下，我们可能希望有条件地禁用 `<Teleport>`。例如，我们可能希望在桌面端将某个组件渲染为覆盖层，而在移动端则以内联方式渲染。`<Teleport>` 支持 `disabled` prop，可以动态切换：

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

然后我们就可以动态更新 `isMobile`。

## 同一目标上的多个 Teleport {#multiple-teleports-on-the-same-target}

一个常见用例是可复用的 `<Modal>` 组件，并且可能会同时存在多个实例处于活动状态。对于这种场景，多个 `<Teleport>` 组件可以将它们的内容挂载到同一个目标元素上。顺序将是简单的追加，后挂载的内容位于先挂载的内容之后，但都位于目标元素内部。

给定以下用法：

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

渲染结果将是：

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## 延迟 Teleport <sup class="vt-badge" data-text="3.5+" /> {#deferred-teleport}

在 Vue 3.5 及以上版本中，我们可以使用 `defer` prop 将 Teleport 的目标解析延迟到应用的其他部分挂载之后。这使得 Teleport 可以指向由 Vue 渲染、但位于组件树更后面部分的容器元素：

```vue-html
<Teleport defer to="#late-div">...</Teleport>

<!-- 在模板后面的某处 -->
<div id="late-div"></div>
```

请注意，目标元素必须与 Teleport 在同一个挂载 / 更新 tick 中渲染——也就是说，如果 `<div>` 要晚一秒才挂载，Teleport 仍然会报错。`defer` 的工作方式类似于 `mounted` 生命周期钩子。

---

**相关**

- [`<Teleport>` API 参考](/api/built-in-components#teleport)
- [在 SSR 中处理 Teleports](/guide/scaling-up/ssr#teleports)
