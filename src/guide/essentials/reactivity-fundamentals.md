---
outline: deep
---

# 响应式基础 {#reactivity-fundamentals}

:::tip API 偏好
本页以及后续指南中的许多其他章节，针对 Options API 和 Composition API 会包含不同内容。你当前的偏好是 <span class="options-api">Options API</span><span class="composition-api">Composition API</span>。你可以使用左侧边栏顶部的“API 偏好”切换来切换 API 风格。
:::

<div class="options-api">

## 声明响应式状态 \* {#declaring-reactive-state}

使用 Options API 时，我们通过 `data` 选项来声明组件的响应式状态。该选项的值应为一个返回对象的函数。Vue 会在创建新的组件实例时调用这个函数，并将返回的对象包装到其响应式系统中。该对象的任何顶层属性都会被代理到组件实例上（即方法和生命周期钩子中的 `this`）：

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` 是一个生命周期钩子，我们稍后会解释
  mounted() {
    // `this` 指向组件实例。
    console.log(this.count) // => 1

    // data 也可以被修改
    this.count = 2
  }
}
```

[在 Playground 中试试](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

这些实例属性只会在实例首次创建时添加，因此你需要确保它们都存在于 `data` 函数返回的对象中。在必要时，对于尚不可用所需值的属性，请使用 `null`、`undefined` 或其他占位值。

可以直接向 `this` 添加新属性，而不将其包含在 `data` 中。不过，以这种方式添加的属性将无法触发响应式更新。

Vue 在通过组件实例暴露其内置 API 时，会使用 `$` 前缀。它还保留 `_` 前缀用于内部属性。你应避免为以这两个字符开头的顶层 `data` 属性命名。

### 响应式代理 vs. 原始对象 \* {#reactive-proxy-vs-original}

在 Vue 3 中，数据通过利用 [JavaScript Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 实现响应式。来自 Vue 2 的用户应注意以下边界情况：

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

当你在赋值后访问 `this.someObject` 时，该值是原始 `newObject` 的一个响应式代理。**与 Vue 2 不同，原始的 `newObject` 会保持不变，并且不会被设为响应式：请务必始终通过 `this` 的属性来访问响应式状态。**

</div>

<div class="composition-api">

## 声明响应式状态 \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

在 Composition API 中，推荐使用 [`ref()`](/api/reactivity-core#ref) 函数来声明响应式状态：

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` 接收参数，并返回一个被包裹在带有 `.value` 属性的 ref 对象中的值：

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> 另见：[Refs 的类型标注](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

要在组件模板中访问 refs，请在组件的 `setup()` 函数中声明并返回它们：

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` 是一个专为 Composition API 设计的特殊钩子。
  setup() {
    const count = ref(0)

    // 将 ref 暴露给模板
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

请注意，在模板中使用 ref 时，我们并不需要附加 `.value`。为了方便起见，refs 在模板中使用时会自动解包（但有一些[注意事项](#caveat-when-unwrapping-in-templates)）。

你也可以在事件处理器中直接修改 ref：

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

对于更复杂的逻辑，我们可以在同一作用域中声明会修改 ref 的函数，并将其作为方法连同状态一起暴露出去：

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // 在 JavaScript 中需要 `.value`
      count.value++
    }

    // 不要忘记同时暴露这个函数。
    return {
      count,
      increment
    }
  }
}
```

随后，暴露的方法就可以作为事件处理器使用：

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

这里有一个无需使用任何构建工具的在线示例，见 [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo)。

### `<script setup>` \*\* {#script-setup}

通过 `setup()` 手动暴露状态和方法可能会显得冗长。幸运的是，在使用[单文件组件（SFC）](/guide/scaling-up/sfc)时，可以避免这种写法。我们可以通过 `<script setup>` 简化用法：

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

在 `<script setup>` 中声明的顶层导入、变量和函数，会自动在同一组件的模板中可用。你可以把模板想象成在同一作用域中声明的 JavaScript 函数——它天然可以访问与之并列声明的所有内容。

:::tip
在本指南的剩余部分中，我们主要会为 Composition API 代码示例使用 SFC + `<script setup>` 语法，因为这对 Vue 开发者来说是最常见的用法。

如果你没有使用 SFC，也仍然可以通过 [`setup()`](/api/composition-api-setup) 选项使用 Composition API。
:::

### 为什么使用 Refs？ \*\* {#why-refs}

你可能会想，为什么我们需要使用带有 `.value` 的 refs，而不是普通变量。要解释这一点，我们需要简要讨论 Vue 的响应式系统是如何工作的。

当你在模板中使用 ref，并在之后更改该 ref 的值时，Vue 会自动检测到变化并相应地更新 DOM。这之所以可行，是因为它采用了基于依赖追踪的响应式系统。当一个组件第一次渲染时，Vue 会**追踪**渲染过程中使用到的每一个 ref。之后，当某个 ref 发生变化时，它会为正在追踪它的组件**触发**重新渲染。

在标准 JavaScript 中，没有办法检测普通变量的访问或变更。不过，我们可以使用 getter 和 setter 方法拦截对象属性的 get 和 set 操作。

`.value` 属性让 Vue 有机会检测 ref 何时被访问或修改。在底层，Vue 会在 getter 中执行追踪，在 setter 中执行触发。从概念上说，你可以把 ref 看作如下对象：

```js
// 伪代码，不是实际实现
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

refs 的另一个优点是，与普通变量不同，你可以把 ref 传入函数，同时仍然保留对最新值和响应式关联的访问。这在将复杂逻辑重构为可复用代码时尤其有用。

响应式系统将在[响应式详解](/guide/extras/reactivity-in-depth)章节中更详细地讨论。
</div>

<div class="options-api">

## 声明方法 \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="免费的 Vue.js Methods 课程"/>

要向组件实例添加方法，我们使用 `methods` 选项。它应该是一个包含所需方法的对象：

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // 方法可以在生命周期钩子或其他方法中调用！
    this.increment()
  }
}
```

Vue 会自动绑定 `methods` 的 `this` 值，使其始终指向组件实例。这确保了方法在作为事件监听器或回调使用时，仍能保留正确的 `this` 值。在定义 `methods` 时应避免使用箭头函数，因为这会阻止 Vue 绑定合适的 `this` 值：

```js
export default {
  methods: {
    increment: () => {
      // 不好：这里无法访问 `this`！
    }
  }
}
```

与组件实例的其他所有属性一样，`methods` 也可以在组件模板中访问。在模板中，它们最常作为事件监听器使用：

```vue-html
<button @click="increment">{{ count }}</button>
```

[在 Playground 中试试](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

在上面的示例中，点击 `<button>` 时会调用方法 `increment`。

</div>

### 深层响应式 {#deep-reactivity}

<div class="options-api">

在 Vue 中，状态默认是深层响应式的。这意味着即使你修改嵌套对象或数组，也可以预期变化会被检测到：

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // 这些将按预期工作。
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

refs 可以持有任何值类型，包括深层嵌套的对象、数组，或像 `Map` 这样的 JavaScript 内置数据结构。

ref 会使其值变为深层响应式。这意味着即使你修改嵌套对象或数组，也可以预期变化会被检测到：

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // 这些将按预期工作。
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

非原始值会通过 [`reactive()`](#reactive) 转换为响应式代理，下面会对此进行讨论。

也可以通过[浅层 refs](/api/reactivity-advanced#shallowref) 来关闭深层响应式。对于浅层 refs，只有对 `.value` 的访问才会被追踪以实现响应式。浅层 refs 可用于通过避免对大型对象的观察开销来优化性能，或用于内部状态由外部库管理的场景。

延伸阅读：

- [为大型不可变结构减少响应式开销](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [与外部状态系统集成](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### DOM 更新时机 {#dom-update-timing}

当你修改响应式状态时，DOM 会自动更新。不过需要注意的是，DOM 更新并不是同步应用的。相反，Vue 会将它们缓冲到更新循环中的“下一个 tick”，以确保无论你进行了多少次状态变更，每个组件都只更新一次。

要在状态变更后等待 DOM 更新完成，可以使用全局 API [nextTick()](/api/general#nexttick)：

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // 现在 DOM 已更新
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // 现在 DOM 已更新
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

还有另一种声明响应式状态的方式，即使用 `reactive()` API。不同于 `ref` 会将内部值包装在一个特殊对象中，`reactive()` 会让对象本身变为响应式：

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> 另见：[Typing Reactive](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

在模板中的用法：

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

响应式对象是 [JavaScript Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，其行为与普通对象完全一致。区别在于，Vue 能够拦截响应式对象所有属性的访问和变更，从而进行依赖追踪和触发更新。

`reactive()` 会深层转换对象：嵌套对象在被访问时也会被 `reactive()` 包裹。当 `ref()` 的值是一个对象时，内部也会调用它。类似于浅层 `ref`，也有 [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) API 可用于关闭深层响应性。

### Reactive Proxy vs. Original \*\* {#reactive-proxy-vs-original-1}

需要注意的是，`reactive()` 返回的是原始对象的 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，它与原始对象并不相等：

```js
const raw = {}
const proxy = reactive(raw)

// proxy 与原始对象并不相等。
console.log(proxy === raw) // false
```

只有代理对象才是响应式的——修改原始对象不会触发更新。因此，在使用 Vue 的响应式系统时，最佳实践是 **只使用状态的代理版本**。

为了确保始终访问到同一个代理，对同一个对象调用 `reactive()` 总会返回同一个代理；对一个已有代理调用 `reactive()` 也会返回这个代理本身：

```js
// 对同一个对象调用 reactive() 会返回同一个代理
console.log(reactive(raw) === proxy) // true

// 对代理对象调用 reactive() 会返回它自身
console.log(reactive(proxy) === proxy) // true
```

这一规则同样适用于嵌套对象。由于深层响应性，响应式对象内部的嵌套对象也是代理：

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### `reactive()` 的局限性 \*\* {#limitations-of-reactive}

`reactive()` API 有几个局限：

1. **值类型有限：** 它只适用于对象类型（对象、数组，以及 [集合类型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections)，例如 `Map` 和 `Set`）。它不能持有 [原始类型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)，例如 `string`、`number` 或 `boolean`。

2. **无法整体替换对象：** 由于 Vue 的响应式追踪是基于属性访问的，我们必须始终保持对响应式对象的同一个引用。这意味着我们不能轻易“替换”一个响应式对象，因为与第一个引用的响应式连接会丢失：

   ```js
   let state = reactive({ count: 0 })

   // 上面的引用 ({ count: 0 }) 已经不再被追踪
   // （响应式连接已丢失！）
   state = reactive({ count: 1 })
   ```

3. **不利于解构：** 当我们把响应式对象中的原始类型属性解构到局部变量中，或者把该属性传递给一个函数时，就会失去响应式连接：

   ```js
   const state = reactive({ count: 0 })

   // 解构后，count 与 state.count 失去连接。
   let { count } = state
   // 不会影响原始状态
   count++

   // 该函数接收的是一个普通数字，
   // 无法追踪对 state.count 的变化
   // 为了保留响应性，我们必须传入整个对象
   callSomeFunction(state.count)
   ```

由于这些局限，我们建议将 `ref()` 作为声明响应式状态的主要 API。

## 额外的 Ref 解包细节 \*\* {#additional-ref-unwrapping-details}

### 作为响应式对象属性 \*\* {#ref-unwrapping-as-reactive-object-property}

当 ref 作为响应式对象的属性被访问或赋值时，会自动解包。换句话说，它的行为就像普通属性：

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果将一个新的 ref 赋值给一个已关联现有 ref 的属性，它会替换旧的 ref：

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 原始 ref 现在已与 state.count 断开连接
console.log(count.value) // 1
```

ref 的解包只会发生在深层响应式对象内部。它被作为 [浅层响应式对象](/api/reactivity-advanced#shallowreactive) 的属性访问时，不会发生解包。

### 数组和集合中的注意事项 \*\* {#caveat-in-arrays-and-collections}

与响应式对象不同，当 ref 被作为响应式数组的元素或 `Map` 这类原生集合类型的元素访问时，**不会**进行解包：

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

### 模板中解包的注意事项 \*\* {#caveat-when-unwrapping-in-templates}

模板中的 ref 解包仅适用于该 ref 是模板渲染上下文中的顶级属性。

在下面的例子中，`count` 和 `object` 是顶级属性，但 `object.id` 不是：

```js
const count = ref(0)
const object = { id: ref(1) }
```

因此，下面这个表达式会按预期工作：

```vue-html
{{ count + 1 }}
```

而这个则 **不会**：

```vue-html
{{ object.id + 1 }}
```

渲染结果将是 `[object Object]1`，因为在求值表达式时 `object.id` 没有被解包，仍然是一个 ref 对象。要修复这一点，我们可以将 `id` 解构为顶级属性：

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

现在渲染结果将是 `2`。

另一个需要注意的是，如果 ref 是文本插值（即 <code v-pre>{{ }}</code> 标签）最终求值的结果，那么它会被解包，因此下面会渲染为 `1`：

```vue-html
{{ object.id }}
```

这只是文本插值的一项便捷特性，等同于 <code v-pre>{{ object.id.value }}</code>。

</div>

<div class="options-api">

### 有状态方法 \* {#stateful-methods}

在某些情况下，我们可能需要动态创建一个方法函数，例如创建一个防抖事件处理器：

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // 使用 Lodash 进行防抖
    click: debounce(function () {
      // ... 响应点击 ...
    }, 500)
  }
}
```

然而，这种方法对于可复用组件来说有问题，因为防抖函数是**有状态的**：它会基于已过去的时间维护一些内部状态。如果多个组件实例共享同一个防抖函数，它们就会互相干扰。

为了让每个组件实例的防抖函数彼此独立，我们可以在 `created` 生命周期钩子中创建防抖版本：

```js
export default {
  created() {
    // 现在每个实例都有自己的一份防抖处理器副本
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // 当组件被移除时
    // 取消定时器也是个好主意
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... 响应点击 ...
    }
  }
}
```

</div>
