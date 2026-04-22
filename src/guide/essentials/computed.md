# 计算属性 {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Vue.js 计算属性免费课程"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Vue.js 计算属性免费课程"/>
</div>

## 基本示例 {#basic-example}

模板内表达式非常方便，但它们适用于简单操作。在模板中放入过多逻辑会让模板变得臃肿且难以维护。例如，如果我们有一个带有嵌套数组的对象：

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - 高级指南',
          'Vue 3 - 基础指南',
          'Vue 4 - 神秘之作'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - 高级指南',
    'Vue 3 - 基础指南',
    'Vue 4 - 神秘之作'
  ]
})
```

</div>

并且我们希望根据 `author` 是否已经有一些书籍来显示不同的信息：

```vue-html
<p>已发布书籍：</p>
<span>{{ author.books.length > 0 ? '是' : '否' }}</span>
```

到这里，模板已经变得有点杂乱了。我们得先看一眼，才能意识到它是在根据 `author.books` 执行计算。更重要的是，如果我们需要在模板中多次使用这个计算结果，我们大概不想重复编写同样的逻辑。

这就是为什么对于包含响应式数据的复杂逻辑，推荐使用 **计算属性**。下面是重构后的同一示例：

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - 高级指南',
          'Vue 3 - 基础指南',
          'Vue 4 - 神秘之作'
        ]
      }
    }
  },
  computed: {
    // 一个计算属性 getter
    publishedBooksMessage() {
      // `this` 指向组件实例
      return this.author.books.length > 0 ? '是' : '否'
    }
  }
}
```

```vue-html
<p>已发布书籍：</p>
<span>{{ publishedBooksMessage }}</span>
```

[在 Playground 中试一试](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

这里我们声明了一个计算属性 `publishedBooksMessage`。

尝试修改应用程序 `data` 中 `books` 数组的值，你会看到 `publishedBooksMessage` 也会随之变化。

你可以像访问普通属性一样，在模板中将数据绑定到计算属性上。Vue 知道 `this.publishedBooksMessage` 依赖于 `this.author.books`，因此当 `this.author.books` 发生变化时，它会更新所有依赖于 `this.publishedBooksMessage` 的绑定。

另请参见：[计算属性类型标注](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - 高级指南',
    'Vue 3 - 基础指南',
    'Vue 4 - 神秘之作'
  ]
})

// 一个计算引用
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? '是' : '否'
})
</script>

<template>
  <p>已发布书籍：</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[在 Playground 中试一试](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOvRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GttMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm5pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)

这里我们声明了一个计算属性 `publishedBooksMessage`。`computed()` 函数期望接收一个 [getter 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)，返回值是一个 **计算引用**。与普通 ref 类似，你可以通过 `publishedBooksMessage.value` 访问计算结果。计算引用在模板中也会自动解包，因此你可以在模板表达式中直接引用它，而无需 `.value`。

计算属性会自动追踪其响应式依赖。Vue 知道 `publishedBooksMessage` 的计算依赖于 `author.books`，因此当 `author.books` 发生变化时，它会更新所有依赖于 `publishedBooksMessage` 的绑定。

另请参见：[计算属性类型标注](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## 计算缓存 vs. 方法 {#computed-caching-vs-methods}

你可能已经注意到，我们可以通过在表达式中调用方法来达到相同的结果：

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// 在组件中
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? '是' : '否'
  }
}
```

</div>

<div class="composition-api">

```js
// 在组件中
function calculateBooksMessage() {
  return author.books.length > 0 ? '是' : '否'
}
```

</div>

我们可以把同样的函数定义为一个方法，而不是计算属性。就最终结果而言，这两种方式确实完全相同。不过，区别在于 **计算属性会基于其响应式依赖进行缓存。** 只有当某个响应式依赖发生变化时，计算属性才会重新求值。这意味着，只要 `author.books` 没有变化，多次访问 `publishedBooksMessage` 都会立刻返回之前计算的结果，而无需再次运行 getter 函数。

这也意味着下面这个计算属性永远不会更新，因为 `Date.now()` 不是一个响应式依赖：

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

相比之下，只要发生重新渲染，方法调用就会 **总是** 执行函数。

为什么我们需要缓存？想象一下我们有一个昂贵的计算属性 `list`，它需要遍历一个巨大的数组并进行大量计算。然后我们可能还会有其他计算属性，而这些计算属性又依赖于 `list`。如果没有缓存，我们就会比必要次数更多地执行 `list` 的 getter！在你不希望使用缓存的情况下，请改用方法调用。

## 可写计算属性 {#writable-computed}

计算属性默认只有 getter。如果你尝试给一个计算属性赋新值，会收到运行时警告。在少数需要“可写”计算属性的情况下，你可以同时提供 getter 和 setter 来创建它：

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // getter
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set(newValue) {
        // 注意：这里使用了解构赋值语法。
        [this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

现在当你执行 `this.fullName = 'John Doe'` 时，setter 将会被调用，`this.firstName` 和 `this.lastName` 也会相应更新。

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：这里使用了解构赋值语法。
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

现在当你执行 `fullName.value = 'John Doe'` 时，setter 将会被调用，`firstName` 和 `lastName` 也会相应更新。

</div>

## 获取上一个值 {#previous}

- 仅支持 3.4+

<p class="options-api">
如果需要，你可以通过访问 getter 的第二个参数来获取计算属性返回的上一个值：
</p>

<p class="composition-api">
如果需要，你可以通过访问 getter 的第一个参数来获取计算属性返回的上一个值：
</p>

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    // 这个计算属性会在 count 小于或等于 3 时返回 count 的值。
    // 当 count >= 4 时，会返回最后一个满足条件的值，
    // 直到 count 小于或等于 3 为止。
    alwaysSmall(_, previous) {
      if (this.count <= 3) {
        return this.count
      }

      return previous
    }
  }
}
```
</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

// 这个计算属性会在 count 小于或等于 3 时返回 count 的值。
// 当 count >= 4 时，会返回最后一个满足条件的值，
// 直到 count 小于或等于 3 为止。
const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value
  }

  return previous
})
</script>
```
</div>

如果你使用的是可写计算属性：

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    alwaysSmall: {
      get(_, previous) {
        if (this.count <= 3) {
          return this.count
        }

        return previous;
      },
      set(newValue) {
        this.count = newValue * 2
      }
    }
  }
}
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

const alwaysSmall = computed({
  get(previous) {
    if (count.value <= 3) {
      return count.value
    }

    return previous
  },
  set(newValue) {
    count.value = newValue * 2
  }
})
</script>
```

</div>


## 最佳实践 {#best-practices}

### Getter 应该无副作用 {#getters-should-be-side-effect-free}

请记住，计算 getter 函数应只执行纯计算，并且不应产生副作用。例如，**不要修改其他状态、发起异步请求，或在计算 getter 中操作 DOM！** 将计算属性看作一种声明式描述：它根据其他值推导出一个值——它唯一的职责应该是计算并返回该值。在本指南后面，我们将讨论如何使用 [watcher](./watchers) 在状态变化时执行副作用。

### 避免修改计算值 {#avoid-mutating-computed-value}

计算属性返回的值是派生状态。可以把它看作一个临时快照——每当源状态发生变化时，就会创建一个新的快照。修改快照没有意义，因此计算属性的返回值应被视为只读，绝不能被修改——相反，应更新它所依赖的源状态，以触发新的计算。
