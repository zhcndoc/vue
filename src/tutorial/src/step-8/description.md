# 计算属性 {#computed-property}

让我们继续在上一步的待办事项列表基础上进行开发。这里，我们已经为每个待办事项添加了切换功能。这是通过给每个 todo 对象添加一个 `done` 属性，并使用 `v-model` 将其绑定到复选框上来实现的：

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

我们接下来可以添加的改进是能够隐藏已经完成的待办事项。我们已经有了一个用于切换 `hideCompleted` 状态的按钮。但是我们该如何根据这个状态渲染不同的列表项呢？

<div class="options-api">

引入 <a target="_blank" href="/guide/essentials/computed.html">计算属性</a>。我们可以使用 `computed` 选项声明一个从其他属性响应式计算得出的属性：

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // 根据 `this.hideCompleted` 返回过滤后的 todos
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // 根据 `this.hideCompleted` 返回过滤后的 todos
    }
  }
})
```

</div>

</div>
<div class="composition-api">

引入 <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>。我们可以创建一个计算引用，它会基于其他响应式数据源来计算自己的 `.value`：

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // 根据
  // `todos.value` 和 `hideCompleted.value` 返回过滤后的 todos
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // 根据
      // `todos.value` 和 `hideCompleted.value` 返回过滤后的 todos
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

计算属性会跟踪其计算中使用的其他响应式状态，并将其作为依赖项。它会缓存结果，并在依赖项发生变化时自动更新。

现在，试着添加 `filteredTodos` 计算属性并实现它的计算逻辑吧！如果实现正确，在隐藏已完成项时勾选某个待办事项后，它也应该会立即被隐藏。
