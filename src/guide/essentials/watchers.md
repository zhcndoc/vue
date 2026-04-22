# 侦听器 {#watchers}

## 基本示例 {#basic-example}

计算属性允许我们以声明式的方式计算衍生值。然而，在某些情况下，我们需要在状态变化时执行“副作用”——例如，修改 DOM，或根据异步操作的结果改变另一部分状态。

<div class="options-api">

在 Options API 中，我们可以使用 [`watch` 选项](/api/options-state#watch) 来在某个响应式属性变化时触发一个函数：

```js
export default {
  data() {
    return {
      question: '',
      answer: '问题通常都包含一个问号。 ;-)',
      loading: false
    }
  },
  watch: {
    // 当 question 变化时，这个函数就会执行
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = '思考中...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = '错误！无法访问 API。' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  提一个是/否问题：
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[在 Playground 中试试](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINfKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

`watch` 选项也支持以点号分隔的路径作为 key：

```js
export default {
  watch: {
    // 注意：这里只支持简单路径，不支持表达式。
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

在 Composition API 中，我们可以使用 [`watch` 函数](/api/reactivity-core#watch) 来在某个响应式状态变化时触发一个回调：

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('问题通常都包含一个问号。 ;-)')
const loading = ref(false)

// watch 可以直接作用于 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = '思考中...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = '错误！无法访问 API。' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    提一个是/否问题：
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925njoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuK/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)

### 侦听源类型 {#watch-source-types}

`watch` 的第一个参数可以是不同类型的响应式“源”：它可以是一个 ref（包括计算属性 ref）、一个响应式对象、一个 [getter 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)，或者由多个源组成的数组：

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

请注意，你不能像下面这样侦听响应式对象的某个属性：

```js
const obj = reactive({ count: 0 })

// 这不会生效，因为传给 watch() 的是一个数字
watch(obj.count, (count) => {
  console.log(`Count is: ${count}`)
})
```

应该改为使用 getter：

```js
// 改为使用 getter：
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  }
)
```

</div>

## 深层侦听器 {#deep-watchers}

<div class="options-api">

`watch` 默认是浅层的：回调函数只会在被侦听的属性被赋予一个新值时触发——它不会在嵌套属性发生变化时触发。如果你希望在所有嵌套的变更上都触发回调，需要使用深层侦听器：

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // 注意：这里 `newValue` 会等于 `oldValue`
        // 只要这个对象本身没有被替换，
        // 即使发生了嵌套变更也是如此。
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

当你直接在一个响应式对象上调用 `watch()` 时，它会隐式地创建一个深层侦听器——回调函数会在所有嵌套变更时触发：

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套属性变更时触发
  // 注意：这里 `newValue` 会等于 `oldValue`
  // 因为它们指向的是同一个对象！
})

obj.count++
```

这应当与返回响应式对象的 getter 区分开来——在后者中，只有当 getter 返回了不同的对象时，回调才会触发：

```js
watch(
  () => state.someObject,
  () => {
    // 只有当 state.someObject 被替换时才会触发
  }
)
```

不过，你也可以通过显式使用 `deep` 选项，将第二种情况强制变成深层侦听器：

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：这里 `newValue` 会等于 `oldValue`
    // *除非* state.someObject 已经被替换
  },
  { deep: true }
)
```

</div>

在 Vue 3.5+ 中，`deep` 选项也可以是一个数字，用来表示最大遍历深度——也就是 Vue 应该遍历对象嵌套属性的层级数。

:::warning 请谨慎使用
深层侦听需要遍历被侦听对象中的所有嵌套属性，在大型数据结构上使用时可能会很昂贵。只有在必要时才使用，并注意性能影响。
:::

## 即时侦听器 {#eager-watchers}

`watch` 默认是惰性的：在被侦听的源发生变化之前，回调不会被调用。但在某些情况下，我们可能希望同样的回调逻辑立即执行——例如，我们可能希望先获取一些初始数据，然后在相关状态变化时重新获取数据。

<div class="options-api">

我们可以通过使用一个带有 `handler` 函数和 `immediate: true` 选项的对象来声明侦听器，从而强制其回调立即执行：

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // 组件创建时会立即执行。
      },
      // 强制立即执行回调
      immediate: true
    }
  }
  // ...
}
```

`handler` 函数的初次执行会发生在 `created` 钩子之前。Vue 此时已经处理完 `data`、`computed` 和 `methods` 选项，所以这些属性在首次调用时就可以使用。

</div>

<div class="composition-api">

我们可以通过传入 `immediate: true` 选项来强制侦听器的回调立即执行：

```js
watch(
  source,
  (newValue, oldValue) => {
    // 立即执行，然后在 `source` 变化时再次执行
  },
  { immediate: true }
)
```

</div>

## 一次性侦听器 {#once-watchers}

- 仅在 3.4+ 中支持

侦听器的回调会在被侦听的源发生变化时执行。如果你希望回调只在源变化时触发一次，请使用 `once: true` 选项。

<div class="options-api">

```js
export default {
  watch: {
    source: {
      handler(newValue, oldValue) {
        // 当 `source` 变化时，只触发一次
      },
      once: true
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(
  source,
  (newValue, oldValue) => {
    // 当 `source` 变化时，只触发一次
  },
  { once: true }
)
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

侦听器回调常常会使用与源完全相同的响应式状态。例如，考虑下面这段代码，它使用侦听器在 `todoId` ref 变化时加载远程资源：

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

特别要注意的是，这个侦听器把 `todoId` 用了两次：一次作为源，另一次在回调内部。

这可以通过 [`watchEffect()`](/api/reactivity-core#watcheffect) 来简化。`watchEffect()` 允许我们自动跟踪回调中使用到的响应式依赖。上面的侦听器可以改写为：

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

这里回调会立即执行，不需要再指定 `immediate: true`。在执行过程中，它会自动将 `todoId.value` 追踪为依赖（类似于计算属性）。每当 `todoId.value` 变化时，回调就会再次执行。使用 `watchEffect()` 时，我们不再需要显式地把 `todoId` 作为源传入。

你可以查看这个 [`watchEffect()` 的示例](/examples/#fetching-data)，了解响应式数据获取的实际用法。

对于这类只有一个依赖的示例，`watchEffect()` 的优势相对较小。但对于有多个依赖的侦听器来说，使用 `watchEffect()` 可以省去手动维护依赖列表的负担。此外，如果你需要侦听嵌套数据结构中的多个属性，`watchEffect()` 可能比深层侦听器更高效，因为它只会追踪回调中实际用到的属性，而不是递归地追踪所有属性。

:::tip
`watchEffect` 只会在其**同步**执行期间追踪依赖。当与异步回调一起使用时，只有在第一个 `await` 之前访问到的属性才会被追踪。
:::

### `watch` 与 `watchEffect` {#watch-vs-watcheffect}

`watch` 和 `watchEffect` 都允许我们响应式地执行副作用。它们的主要区别在于追踪响应式依赖的方式：

- `watch` 只追踪显式侦听的源。它不会追踪在回调中访问的任何内容。此外，只有当源实际发生变化时，回调才会触发。`watch` 将依赖追踪与副作用分离，使我们能够更精确地控制回调何时触发。

- `watchEffect` 则将依赖追踪和副作用合并为一个阶段。它会在同步执行期间自动追踪每个被访问到的响应式属性。这更方便，通常也会让代码更简洁，但其响应式依赖也因此不那么明确。

</div>

## 副作用清理 {#side-effect-cleanup}

有时我们会在侦听器中执行副作用，例如异步请求：

<div class="composition-api">

```js
watch(id, (newId) => {
  fetch(`/api/${newId}`).then(() => {
    // 回调逻辑
  })
})
```

</div>
<div class="options-api">

```js
export default {
  watch: {
    id(newId) {
      fetch(`/api/${newId}`).then(() => {
        // 回调逻辑
      })
    }
  }
}
```

</div>

但如果在请求完成之前 `id` 发生了变化怎么办？当之前的请求完成时，它仍然会以一个已经过期的 ID 值触发回调。理想情况下，当 `id` 变为新值时，我们希望能够取消这个过期的请求。

我们可以使用 [`onWatcherCleanup()`](/api/reactivity-core#onwatchercleanup) <sup class="vt-badge" data-text="3.5+" /> API 来注册一个清理函数，该函数会在侦听器失效并即将重新运行时被调用：

<div class="composition-api">

```js {10-13}
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // 回调逻辑
  })

  onWatcherCleanup(() => {
    // 中止过期请求
    controller.abort()
  })
})
```

</div>
<div class="options-api">

```js {12-15}
import { onWatcherCleanup } from 'vue'

export default {
  watch: {
    id(newId) {
      const controller = new AbortController()

      fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
        // 回调逻辑
      })

      onWatcherCleanup(() => {
        // 中止过期请求
        controller.abort()
      })
    }
  }
}
```

</div>

请注意，`onWatcherCleanup` 仅在 Vue 3.5+ 中受支持，并且必须在 `watchEffect` 副作用函数或 `watch` 回调函数的同步执行期间调用：你不能在异步函数中的 `await` 语句之后调用它。

另外，`onCleanup` 函数也会作为第 3 个参数传递给侦听器回调<span class="composition-api">，并作为 `watchEffect` 副作用函数的第一个参数传递</span>：

<div class="composition-api">

```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  })
})
```

</div>
<div class="options-api">

```js
export default {
  watch: {
    id(newId, oldId, onCleanup) {
      // ...
      onCleanup(() => {
        // 清理逻辑
      })
    }
  }
}
```

</div>

通过函数参数传入的 `onCleanup` 会绑定到侦听器实例，因此它不受 `onWatcherCleanup` 同步约束的限制。

## 回调刷新时机 {#callback-flush-timing}

当你修改响应式状态时，它可能会同时触发 Vue 组件更新和你创建的侦听器回调。

与组件更新类似，用户创建的侦听器回调会被批量处理，以避免重复调用。例如，如果我们同步向一个被侦听的数组中推入一千个项目，我们大概不希望某个侦听器被触发一千次。

默认情况下，侦听器的回调会在父组件更新之后（如果有的话），以及拥有该侦听器的组件 DOM 更新之前调用。这意味着，如果你尝试在侦听器回调中访问拥有该侦听器的组件自身的 DOM，那么此时 DOM 仍处于更新前状态。

### 后置侦听器 {#post-watchers}

如果你希望在 Vue 更新了拥有该侦听器的组件 DOM **之后**再访问它，就需要指定 `flush: 'post'` 选项：

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

后置刷新（post-flush）的 `watchEffect()` 还提供了一个便捷别名 `watchPostEffect()`：

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

</div>

### 同步侦听器 {#sync-watchers}

也可以创建一个在任何 Vue 管理的更新之前同步触发的侦听器：

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

同步的 `watchEffect()` 还提供了一个便捷别名 `watchSyncEffect()`：

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* 在响应式数据变化时同步执行 */
})
```

</div>

:::warning 谨慎使用
同步侦听器没有批处理，并且会在每次检测到响应式变更时触发。它们适合用于侦听简单的布尔值，但应避免用于可能会被同步多次修改的数据源，例如数组。
:::

<div class="options-api">

## `this.$watch()` \* {#this-watch}

也可以使用 [`$watch()` 实例方法](/api/component-instance#watch)以命令式方式创建侦听器：

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

当你需要有条件地设置侦听器，或者只在用户交互时侦听某些内容时，这非常有用。它也允许你提前停止侦听器。

</div>

## 停止侦听器 {#stopping-a-watcher}

<div class="options-api">

使用 `watch` 选项或 `$watch()` 实例方法声明的侦听器，会在拥有该侦听器的组件卸载时自动停止，因此在大多数情况下你无需担心手动停止侦听器。

在少数需要在拥有该侦听器的组件卸载之前停止它的情况下，`$watch()` API 会返回一个函数供你调用：

```js
const unwatch = this.$watch('foo', callback)

// ...当不再需要这个侦听器时：
unwatch()
```

</div>

<div class="composition-api">

在 `setup()` 或 `<script setup>` 中同步声明的侦听器会绑定到拥有它的组件实例，并会在该组件卸载时自动停止。在大多数情况下，你无需担心手动停止侦听器。

这里的关键是侦听器必须是**同步**创建的：如果侦听器是在异步回调中创建的，它不会绑定到拥有该组件的实例，必须手动停止以避免内存泄漏。下面是一个示例：

```vue
<script setup>
import { watchEffect } from 'vue'

// 这个会被自动停止
watchEffect(() => {})

// ...这个不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

要手动停止侦听器，请使用返回的句柄函数。这对 `watch` 和 `watchEffect` 都适用：

```js
const unwatch = watchEffect(() => {})

// ...稍后，当不再需要时
unwatch()
```

请注意，需要异步创建侦听器的情况应该非常少，并且在可能的情况下应优先使用同步创建。如果你需要等待某些异步数据，可以改为让你的侦听逻辑具备条件判断：

```js
// 要异步加载的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载完成时执行某些操作
  }
})
```

</div>
