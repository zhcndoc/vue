# 响应性语法转换 {#reactivity-transform}

:::danger 已移除的实验性特性
Reactivity Transform 曾是一个实验性特性，并且已经在最新的 3.4 版本中移除。请阅读[这里的原因说明](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028)。

如果你仍然打算使用它，现在可以通过 [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) 插件来使用。
:::

:::tip 仅适用于 Composition API
Reactivity Transform 是一个仅适用于 Composition API 的特性，并且需要构建步骤。
:::

## Refs 与响应式变量 {#refs-vs-reactive-variables}

自从 Composition API 引入以来，一个长期悬而未决的主要问题就是该使用 refs 还是 reactive 对象。对 reactive 对象进行解构时很容易丢失响应性，而使用 refs 时又可能不得不在各处都写 `.value`，这也会显得很繁琐。另外，如果没有类型系统，`.value` 也很容易被遗漏。

[Vue Reactivity Transform](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) 是一种编译时转换，它允许我们写出如下代码：

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

这里的 `$ref()` 方法是一个**编译期宏**：它并不是一个会在运行时被调用的真实方法。相反，Vue 编译器会把它当作一个提示，将得到的 `count` 变量视为一个**响应式变量**。

响应式变量可以像普通变量一样被访问和重新赋值，但这些操作会被编译为带有 `.value` 的 refs。例如，上面组件的 `<script>` 部分会被编译为：

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

所有返回 refs 的响应式 API 都会有一个以 `$` 为前缀的等价宏。这些 API 包括：

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

这些宏是全局可用的，在启用 Reactivity Transform 时无需导入，但如果你希望更显式一些，也可以选择从 `vue/macros` 中导入它们：

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## 使用 `$()` 进行解构 {#destructuring-with}

组合式函数返回一个 refs 对象，并通过解构来取出这些 refs，是很常见的用法。为此，响应性语法转换提供了 **`$()`** 宏：

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

编译结果：

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

请注意，如果 `x` 本身已经是一个 ref，那么 `toRef(__temp, 'x')` 会直接原样返回它，不会额外创建新的 ref。如果解构出的值不是 ref（例如一个函数），它仍然可以正常工作——该值会被包裹在一个 ref 中，从而使其余代码按预期运行。

`$()` 的解构既适用于响应式对象，也适用于包含 refs 的普通对象。

## 使用 `$()` 将已有 refs 转换为响应式变量 {#convert-existing-refs-to-reactive-variables-with}

在某些情况下，我们可能会把函数包装起来，而这些函数也会返回 refs。然而，Vue 编译器无法提前知道某个函数会返回 ref。在这种情况下，也可以使用 `$()` 宏把已有 refs 转换为响应式变量：

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## 响应式 Props 解构 {#reactive-props-destructure}

当前在 `<script setup>` 中使用 `defineProps()` 有两个痛点：

1. 和 `.value` 类似，你需要始终通过 `props.x` 来访问 props，才能保留响应性。这意味着你不能解构 `defineProps`，因为解构后的变量并不是响应式的，也不会更新。

2. 使用 [仅类型声明的 props 声明](/api/sfc-script-setup#type-only-props-emit-declarations) 时，没有简单的方法为 props 声明默认值。我们曾专门为此引入 `withDefaults()` API，但使用起来仍然比较笨重。

当 `defineProps` 与解构一起使用时，我们可以应用编译时转换来解决这些问题，类似于前面看到的 `$()`：

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // 默认值可以直接生效
    count = 1,
    // 局部别名同样可以直接生效
    // 这里我们把 `props.foo` 起别名为 `bar`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // 只要 props 变化就会打印
    console.log(msg, count, bar)
  })
</script>
```

上面的代码会被编译为如下等价的运行时声明：

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## 在函数边界间保留响应性 {#retaining-reactivity-across-function-boundaries}

虽然响应式变量让我们不必在各处使用 `.value`，但当我们把响应式变量跨越函数边界传递时，就会产生“响应性丢失”的问题。这种情况可能出现在两种场景中：

### 作为参数传入函数 {#passing-into-function-as-argument}

假设有一个函数期望接收一个 ref 作为参数，例如：

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x changed!')
  })
}

let count = $ref(0)
trackChange(count) // 不起作用！
```

上面的情况不会按预期工作，因为它会被编译为：

```ts
let count = ref(0)
trackChange(count.value)
```

这里传入的 `count.value` 是一个数字，而 `trackChange` 期望的是一个真正的 ref。可以在传递之前先用 `$$()` 包裹 `count` 来修复这个问题：

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

上面的代码会被编译为：

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

可以看到，`$$()` 是一个充当**逃逸提示**的宏：`$$()` 中的响应式变量不会再附加 `.value`。

### 在函数作用域内返回 {#returning-inside-function-scope}

如果在返回表达式中直接使用响应式变量，也会导致响应性丢失：

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // 监听 mousemove...

  // 不起作用！
  return {
    x,
    y
  }
}
```

上面的 return 语句会被编译为：

```ts
return {
  x: x.value,
  y: y.value
}
```

为了保留响应性，我们应该返回真正的 refs，而不是返回时刻的当前值。

同样地，我们可以使用 `$$()` 来修复这个问题。在这种情况下，`$$()` 可以直接用于返回的对象上——`$$()` 调用内部对响应式变量的任何引用，都会保留对其底层 refs 的引用：

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // 监听 mousemove...

  // 已修复
  return $$({
    x,
    y
  })
}
```

### 在解构后的 props 上使用 `$$()` {#using-on-destructured-props}

`$$()` 也适用于解构后的 props，因为它们同样是响应式变量。编译器会为了效率将其转换为 `toRef`：

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

会被编译为：

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## TypeScript 集成 <sup class="vt-badge ts" /> {#typescript-integration}

Vue 为这些宏提供了类型定义（全局可用），并且所有类型都会按预期工作。它与标准 TypeScript 语义没有任何不兼容之处，因此这种语法可以与所有现有工具链配合使用。

这也意味着，这些宏可以在任何允许合法 JS / TS 的文件中使用——不仅仅是在 Vue SFC 中。

由于这些宏是全局可用的，它们的类型需要被显式引用（例如在 `env.d.ts` 文件中）：

```ts
/// <reference types="vue/macros-global" />
```

当你从 `vue/macros` 中显式导入这些宏时，无需声明全局类型也可以正常工作。

## 显式启用 {#explicit-opt-in}

:::danger 核心中已不再支持
以下内容仅适用于 Vue 3.3 及以下版本。Vue core 3.4 及以上版本以及 `@vitejs/plugin-vue` 5.0 及以上版本已移除此支持。如果你打算继续使用该转换，请迁移到 [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html)。
:::

### Vite {#vite}

- 需要 `@vitejs/plugin-vue@>=2.0.0`
- 适用于 SFCs 以及 js(x)/ts(x) 文件。在应用转换前，会先对文件进行快速的使用情况检查，因此对于未使用这些宏的文件不会有性能开销。
- 注意 `reactivityTransform` 现在是插件根级别选项，而不是嵌套在 `script.refSugar` 下，因为它影响的不只是 SFCs。

```js [vite.config.js]
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- 当前仅影响 SFCs
- 需要 `vue-loader@>=17.0.0`

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### 普通 `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- 当前仅影响 SFCs
- 需要 `vue-loader@>=17.0.0`

```js [webpack.config.js]
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```
