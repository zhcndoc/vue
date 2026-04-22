# 提供 / 注入 {#provide-inject}

> 本页假设你已经阅读过 [组件基础](/guide/essentials/component-basics)。如果你是组件新手，请先阅读那一页。

## Prop 逐级传递 {#prop-drilling}

通常，当我们需要将数据从父组件传递给子组件时，会使用 [props](/guide/components/props)。然而，设想这样一种情况：我们有一个很大的组件树，而某个深层嵌套的组件需要来自远处祖先组件的某些内容。仅靠 props，我们就不得不把同一个 prop 一路传过整个父链：

![prop drilling diagram](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

请注意，虽然 `<Footer>` 组件可能根本不关心这些 props，但它仍然需要声明并继续传递它们，只是为了让 `<DeepChild>` 能够访问到它们。如果父链更长，那么沿途会有更多组件受到影响。这被称为“prop 逐级传递（props drilling）”，处理起来确实不太愉快。

我们可以通过 `provide` 和 `inject` 来解决 prop 逐级传递的问题。父组件可以作为所有后代组件的**依赖提供者**。后代树中的任何组件，无论嵌套多深，都可以注入由其父链上方组件提供的依赖。

![Provide/inject scheme](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## 提供 {#provide}

<div class="composition-api">

要向组件的后代提供数据，请使用 [`provide()`](/api/composition-api-dependency-injection#provide) 函数：

```vue
<script setup>
import { provide } from 'vue'

provide(/* key */ 'message', /* value */ 'hello!')
</script>
```

如果不使用 `<script setup>`，请确保在 `setup()` 内同步调用 `provide()`：

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* key */ 'message', /* value */ 'hello!')
  }
}
```

`provide()` 函数接受两个参数。第一个参数称为**注入键**，可以是字符串或 `Symbol`。子组件会使用这个注入键来查找要注入的目标值。单个组件可以通过不同的注入键多次调用 `provide()`，以提供不同的值。

第二个参数是所提供的值。这个值可以是任意类型，包括诸如 refs 之类的响应式状态：

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

提供响应式值可以让使用该值的后代组件与提供者组件建立响应式连接。

</div>

<div class="options-api">

要向组件的后代提供数据，请使用 [`provide`](/api/options-composition#provide) 选项：

```js
export default {
  provide: {
    message: 'hello!'
  }
}
```

对于 `provide` 对象中的每个属性，键会被子组件用来定位正确的注入值，而值则是最终被注入的内容。

如果我们需要提供每个实例自己的状态，例如通过 `data()` 声明的数据，那么 `provide` 必须使用函数值：

```js{7-12}
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // 使用函数语法，这样我们才能访问 `this`
    return {
      message: this.message
    }
  }
}
```

不过，请注意这**不会**使注入保持响应式。我们会在下面讨论[让注入保持响应式](#working-with-reactivity)。

</div>

## 应用级提供 {#app-level-provide}

除了在组件中提供数据之外，我们还可以在应用级别提供：

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* key */ 'message', /* value */ 'hello!')
```

应用级提供可以在应用中渲染的所有组件中使用。这在编写 [插件](/guide/reusability/plugins) 时尤其有用，因为插件通常无法通过组件来提供值。

## 注入 {#inject}

<div class="composition-api">

要注入由祖先组件提供的数据，请使用 [`inject()`](/api/composition-api-dependency-injection#inject) 函数：

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

如果多个父级使用相同的键提供数据，inject 会解析为组件父链中最近的父级所提供的值。

如果提供的值是一个 ref，它会原样注入，并且**不会**自动解包。这使得注入组件能够保持与提供者组件的响应式连接。

[完整的带响应式的 provide + inject 示例](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

同样地，如果不使用 `<script setup>`，`inject()` 也应只在 `setup()` 内同步调用：

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

要注入由祖先组件提供的数据，请使用 [`inject`](/api/options-composition#inject) 选项：

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // 注入的值
  }
}
```

注入值会在组件自身状态之前解析，所以你可以在 `data()` 中访问注入的属性：

```js
export default {
  inject: ['message'],
  data() {
    return {
      // 基于注入值的初始数据
      fullMessage: this.message
    }
  }
}
```

如果多个父级使用相同的键提供数据，inject 会解析为组件父链中最近的父级所提供的值。

[完整的 provide + inject 示例](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### 注入别名 \* {#injection-aliasing}

当使用 `inject` 的数组语法时，被注入的属性会使用相同的键暴露在组件实例上。在上面的例子中，这个属性是以 `"message"` 为键提供的，并被注入为 `this.message`。本地键与注入键相同。

如果我们想用不同的本地键来注入该属性，就需要为 `inject` 选项使用对象语法：

```js
export default {
  inject: {
    /* local key */ localMessage: {
      from: /* injection key */ 'message'
    }
  }
}
```

这里，组件会查找键为 `"message"` 的提供属性，然后将其暴露为 `this.localMessage`。

</div>

### 注入默认值 {#injection-default-values}

默认情况下，`inject` 假定注入键已经在父链中的某处被提供。如果该键未被提供，将会出现运行时警告。

如果我们希望注入的属性在可选提供者存在时也能正常工作，就需要像 props 一样声明默认值：

<div class="composition-api">

```js
// 如果没有提供与 "message" 匹配的数据
// `value` 将会是 "default value"
const value = inject('message', 'default value')
```

在某些情况下，默认值可能需要通过调用函数或实例化一个新类来创建。为了避免在可选值未被使用时产生不必要的计算或副作用，我们可以使用工厂函数来创建默认值：

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

第三个参数表示默认值应被视为工厂函数。

</div>

<div class="options-api">

```js
export default {
  // 声明注入默认值时
  // 必须使用对象语法
  inject: {
    message: {
      from: 'message', // 如果注入使用相同的键，这一项是可选的
      default: 'default value'
    },
    user: {
      // 对于代价高昂的非原始值，或需要每个组件实例都唯一的值，
      // 使用工厂函数
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## 处理响应性 {#working-with-reactivity}

<div class="composition-api">

在使用响应式的 provide / inject 值时，**建议尽可能将对响应式状态的任何修改都保留在_提供者_内部**。这样可以确保所提供的状态及其可能的修改都位于同一个组件中，便于将来维护。

有时我们可能需要从注入组件中更新数据。在这种情况下，我们建议提供一个负责修改状态的函数：

```vue{7-9,13}
<!-- 在提供者组件内 -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- 在注入者组件中 -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

最后，如果你想确保通过 `provide` 传递的数据不能被注入组件修改，可以用 [`readonly()`](/api/reactivity-core#readonly) 包裹提供的值。

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

为了让注入值与提供者保持响应式关联，我们需要使用 [computed()](/api/reactivity-core#computed) 函数提供一个计算属性：

```js{12}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // 显式提供一个计算属性
      message: computed(() => this.message)
    }
  }
}
```

[完整的带响应式的 provide + inject 示例](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

`computed()` 函数通常用于 Composition API 组件，但也可以用于补充 Options API 中的某些使用场景。你可以通过阅读将 API 偏好设置为 Composition API 时的 [响应式基础](/guide/essentials/reactivity-fundamentals) 和 [计算属性](/guide/essentials/computed) 了解更多用法。

</div>

## 使用 Symbol 键 {#working-with-symbol-keys}

到目前为止，我们在示例中一直使用字符串注入键。如果你正在开发一个拥有许多依赖提供者的大型应用，或者你正在编写会被其他开发者使用的组件，那么最好使用 [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 注入键，以避免潜在的冲突。

建议将这些 Symbols 导出到一个专门的文件中：

```js [keys.js]
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// 在提供者组件中
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* 要提供的数据 */
})
```

```js
// 在注入者组件中
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

另请参见：[类型化 Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// 在提供者组件中
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* 要提供的数据 */
      }
    }
  }
}
```

```js
// 在注入者组件中
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
