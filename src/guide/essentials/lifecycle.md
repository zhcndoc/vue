# 生命周期钩子 {#lifecycle-hooks}

每个 Vue 组件实例在创建时都会经历一系列初始化步骤——例如，它需要设置数据监听、编译模板、将实例挂载到 DOM，并在数据变化时更新 DOM。在此过程中，它还会运行称为生命周期钩子的函数，为用户提供在特定阶段添加自己代码的机会。

## 注册生命周期钩子 {#registering-lifecycle-hooks}

例如，<span class="composition-api">`onMounted`</span><span class="options-api">`mounted`</span> 钩子可用于在组件完成初始渲染并创建 DOM 节点后运行代码：

<div class="composition-api">

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`组件现在已经挂载了。`)
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  mounted() {
    console.log(`组件现在已经挂载了。`)
  }
}
```

</div>

在实例生命周期的不同阶段还会调用其他钩子，其中最常用的是 <span class="composition-api">[`onMounted`](/api/composition-api-lifecycle#onmounted)、[`onUpdated`](/api/composition-api-lifecycle#onupdated) 和 [`onUnmounted`](/api/composition-api-lifecycle#onunmounted)。</span><span class="options-api">[`mounted`](/api/options-lifecycle#mounted)、[`updated`](/api/options-lifecycle#updated) 和 [`unmounted`](/api/options-lifecycle#unmounted)。</span>

<div class="options-api">

所有生命周期钩子在调用时，其 `this` 上下文都指向触发它们的当前活动实例。请注意，这意味着在声明生命周期钩子时应避免使用箭头函数，因为这样你将无法通过 `this` 访问组件实例。

</div>

<div class="composition-api">

在调用 `onMounted` 时，Vue 会自动将已注册的回调函数与当前活动的组件实例关联起来。这要求这些钩子必须在组件 setup 期间**同步**注册。例如，不要这样做：

```js
setTimeout(() => {
  onMounted(() => {
    // 这将无法工作。
  })
}, 100)
```

请注意，这并不意味着调用必须在语法上位于 `setup()` 或 `<script setup>` 内部。只要调用栈是同步的，并且来源于 `setup()` 内部，就可以在外部函数中调用 `onMounted()`。

</div>

## 生命周期图示 {#lifecycle-diagram}

下面是实例生命周期的图示。你现在不需要完全理解其中的所有内容，但随着你不断学习和构建，它会成为一个有用的参考。

![组件生命周期图示](./images/lifecycle.png)

<!-- https://www.figma.com/file/Xw3UeNMOralY6NV7gSjWdS/Vue-Lifecycle -->

有关所有生命周期钩子及其各自使用场景的详细信息，请参阅 <span class="composition-api">[生命周期钩子 API 参考](/api/composition-api-lifecycle)</span><span class="options-api">[生命周期钩子 API 参考](/api/options-lifecycle)</span>。
