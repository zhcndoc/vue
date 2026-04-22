# 侦听器 {#watchers}

有时我们可能需要以响应式的方式执行“副作用”——例如，在数值变化时将其打印到控制台。我们可以使用侦听器来实现这一点：

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // 是的，console.log() 就是一种副作用
  console.log(`new count is: ${newCount}`)
})
```

`watch()` 可以直接侦听一个 ref，并且当 `count` 的值发生变化时，回调函数就会被触发。`watch()` 还可以侦听其他类型的数据源——更多细节请参见 <a target="_blank" href="/guide/essentials/watchers.html">指南 - 侦听器</a>。

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // 是的，console.log() 就是一种副作用
      console.log(`new count is: ${newCount}`)
    }
  }
}
```

这里我们使用 `watch` 选项来侦听 `count` 属性的变化。`count` 发生变化时会调用 watch 回调，并将新值作为参数接收。更多细节请参见 <a target="_blank" href="/guide/essentials/watchers.html">指南 - 侦听器</a>。

</div>

一个比将内容打印到控制台更实用的例子，是在 ID 变化时获取新数据。我们现有的代码会在组件挂载时从一个模拟 API 获取 todo 数据。另外还有一个按钮会递增应该被获取的 todo ID。试着实现一个侦听器，在点击按钮时获取一个新的 todo。
