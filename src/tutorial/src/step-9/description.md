# 生命周期和模板引用 {#lifecycle-and-template-refs}

到目前为止，得益于响应式和声明式渲染，Vue 一直在为我们处理所有 DOM 更新。然而，不可避免地会有一些情况，我们需要手动操作 DOM。

我们可以使用 <a target="_blank" href="/api/built-in-special-attributes.html#ref">特殊的 `ref` 属性</a> 来请求一个 **模板引用**——也就是模板中某个元素的引用：

```vue-html
<p ref="pElementRef">hello</p>
```

<div class="composition-api">

要访问该 ref，我们需要声明<span class="html">并暴露</span>一个同名的 ref：

<div class="sfc">

```js
const pElementRef = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```

</div>

请注意，这个 ref 初始化时的值是 `null`。这是因为当 <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> 执行时，该元素还不存在。模板引用只能在组件**挂载**之后访问。

要在挂载后执行代码，我们可以使用 `onMounted()` 函数：

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // 组件现在已经挂载。
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // 组件现在已经挂载。
    })
  }
})
```

</div>
</div>

<div class="options-api">

该元素会作为 `this.$refs.pElementRef` 暴露在 `this.$refs` 上。不过，你只能在组件**挂载**之后访问它。

要在挂载后执行代码，我们可以使用 `mounted` 选项：

<div class="sfc">

```js
export default {
  mounted() {
    // 组件现在已经挂载。
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // 组件现在已经挂载。
  }
})
```

</div>
</div>

这称为一个 **生命周期钩子**——它允许我们注册一个回调，在组件生命周期的特定时间被调用。还有其他钩子，例如 <span class="options-api">`created` 和 `updated`</span><span class="composition-api">`onUpdated` 和 `onUnmounted`</span>。更多细节请查看 <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">生命周期图示</a>。

现在，尝试添加一个 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 钩子，通过 <span class="options-api">`this.$refs.pElementRef`</span><span class="composition-api">`pElementRef.value`</span> 访问 `<p>`，并对其执行一些直接的 DOM 操作（例如更改它的 `textContent`）。
