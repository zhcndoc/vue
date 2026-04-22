# \<script setup> {#script-setup}

`<script setup>` 是一种在单文件组件（SFC）中使用 Composition API 的编译期语法糖。如果你同时使用 SFC 和 Composition API，推荐使用这种语法。与普通的 `<script>` 语法相比，它具有许多优点：

- 代码更简洁，样板代码更少
- 能够使用纯 TypeScript 声明 props 和触发的事件
- 更好的运行时性能（模板会在同一作用域内编译为渲染函数，没有中间代理）
- 更好的 IDE 类型推断性能（语言服务器从代码中提取类型的工作更少）

## 基础语法 {#basic-syntax}

要启用该语法，只需在 `<script>` 块上添加 `setup` 属性：

```vue
<script setup>
console.log('hello script setup')
</script>
```

其中的代码会被编译为组件 `setup()` 函数的内容。这意味着，与只会在组件首次导入时执行一次的普通 `<script>` 不同，`<script setup>` 中的代码会**在组件每次创建实例时执行**。

### 顶层绑定会暴露给模板 {#top-level-bindings-are-exposed-to-template}

使用 `<script setup>` 时，任何在 `<script setup>` 内声明的顶层绑定（包括变量、函数声明和导入）都可以直接在模板中使用：

```vue
<script setup>
// 变量
const msg = 'Hello!'

// 函数
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

导入项也会以同样的方式暴露。这意味着你可以直接在模板表达式中使用导入的辅助函数，而无需通过 `methods` 选项将其暴露出来：

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## 响应式 {#reactivity}

响应式状态需要使用 [Reactivity APIs](./reactivity-core) 显式创建。与 `setup()` 函数返回的值类似，在模板中引用 `ref` 时会自动解包：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## 使用组件 {#using-components}

`<script setup>` 作用域中的值也可以直接用作自定义组件标签名：

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

可以把 `MyComponent` 理解为一个变量引用。如果你使用过 JSX，这里的心智模型是类似的。其对应的 kebab-case 形式 `<my-component>` 也能在模板中工作——不过为了保持一致性，强烈建议使用 PascalCase 组件标签。这也有助于将其与原生自定义元素区分开来。

### 动态组件 {#dynamic-components}

由于组件是作为变量引用的，而不是以字符串键注册的，因此在 `<script setup>` 中使用动态组件时，我们应该使用动态的 `:is` 绑定：

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

注意组件可以像变量一样用于三元表达式中。

### 递归组件 {#recursive-components}

SFC 可以通过其文件名隐式地引用自身。例如，名为 `FooBar.vue` 的文件可以在模板中以 `<FooBar/>` 的形式引用自己。

请注意，这个优先级低于导入的组件。如果你有一个命名导入与组件推断出的名称冲突，可以给该导入起别名：

```js
import { FooBar as FooBarChild } from './components'
```

### 带命名空间的组件 {#namespaced-components}

你可以使用带点号的组件标签，例如 `<Foo.Bar>`，来引用对象属性下嵌套的组件。当你从同一个文件中导入多个组件时，这很有用：

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## 使用自定义指令 {#using-custom-directives}

全局注册的自定义指令可以正常工作。本地自定义指令不需要在 `<script setup>` 中显式注册，但它们必须遵循 `vNameOfDirective` 的命名规则：

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 对元素做一些处理
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

如果你从其他地方导入一个指令，也可以将其重命名为符合所需的命名规则：

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() & defineEmits() {#defineprops-defineemits}

为了以完整的类型推断支持来声明 `props` 和 `emits` 等选项，我们可以使用 `defineProps` 和 `defineEmits` API，它们在 `<script setup>` 中会自动可用：

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup 代码
</script>
```

- `defineProps` 和 `defineEmits` 是**编译器宏**，只能在 `<script setup>` 中使用。它们不需要导入，并且在处理 `<script setup>` 时会被编译掉。

- `defineProps` 接受与 `props` 选项相同的值，而 `defineEmits` 接受与 `emits` 选项相同的值。

- `defineProps` 和 `defineEmits` 会基于传入的选项提供正确的类型推断。

- 传给 `defineProps` 和 `defineEmits` 的选项会被提升到 setup 之外的模块作用域。因此，这些选项不能引用在 setup 作用域中声明的局部变量。这样做会导致编译错误。不过，它们**可以**引用导入的绑定，因为导入项同样位于模块作用域中。

### 仅类型的 props/emit 声明<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

Props 和 emits 也可以通过纯类型语法来声明，只需向 `defineProps` 或 `defineEmits` 传入字面量类型参数：

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+：另一种更简洁的语法
const emit = defineEmits<{
  change: [id: number] // 命名元组语法
  update: [value: string]
}>()
```

- `defineProps` 或 `defineEmits` 只能使用运行时声明或类型声明中的一种。两者同时使用会导致编译错误。

- 使用类型声明时，会通过静态分析自动生成等效的运行时声明，从而避免重复声明，同时仍能确保正确的运行时行为。

  - 在开发模式下，编译器会尝试从类型中推断对应的运行时校验。例如，这里会根据 `foo: string` 推断出 `foo: String`。只要安装了 TypeScript 作为 peer dependency，也会解析导入的类型。

  - 在生产模式下，编译器会生成数组格式的声明以减小打包体积（这里的 props 会被编译为 `['foo', 'bar']`）

- 在 3.2 及以下版本中，`defineProps()` 的泛型类型参数仅限于类型字面量或本地接口的引用。

  这个限制在 3.3 中已被解决。Vue 的最新版本支持在类型参数位置引用导入的类型以及一小部分复杂类型。然而，由于类型到运行时的转换仍然基于 AST，因此一些需要实际类型分析的复杂类型，例如条件类型，不受支持。你可以将条件类型用于单个 prop 的类型，但不能用于整个 props 对象。

### 响应式 Props 解构 <sup class="vt-badge" data-text="3.5+" /> {#reactive-props-destructure}

在 Vue 3.5 及以上版本中，从 `defineProps` 的返回值中解构出的变量是响应式的。Vue 的编译器会在同一个 `<script setup>` 块中的代码访问从 `defineProps` 解构出的变量时，自动在前面加上 `props.`：

```ts
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // 在 3.5 之前只会执行一次
  // 在 3.5+ 中，当 "foo" prop 变化时会重新执行
  console.log(foo)
})
```

上面的代码会被编译为如下等价形式：

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` 被编译器转换为 `props.foo`
  console.log(props.foo)
})
```

此外，你可以使用 JavaScript 原生的默认值语法来为 props 声明默认值。这在使用基于类型的 props 声明时尤其有用：

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

### 使用类型声明时的默认 props 值 <sup class="vt-badge ts" /> {#default-props-values-when-using-type-declaration}

在 3.5 及以上版本中，使用 Reactive Props Destructure 时可以自然地声明默认值。但在 3.4 及以下版本中，Reactive Props Destructure 默认未启用。为了使用基于类型的声明来声明 props 默认值，需要使用 `withDefaults` 编译器宏：

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

这会被编译为等效的运行时 props `default` 选项。此外，`withDefaults` 辅助函数会对默认值进行类型检查，并确保返回的 `props` 类型中，已经声明默认值的属性会移除可选标记。

:::info
请注意，可变引用类型（如数组或对象）的默认值在使用 `withDefaults` 时应包裹在函数中，以避免意外修改和外部副作用。这可以确保每个组件实例都拥有默认值的独立副本。在使用解构默认值时，这**不是**必需的。
:::

## defineModel() {#definemodel}

- 仅在 3.4+ 中可用

这个宏可用于声明一个双向绑定 prop，父组件可以通过 `v-model` 使用它。示例用法也在 [组件 `v-model`](/guide/components/v-model) 指南中有讨论。

在底层，这个宏会声明一个模型 prop 以及对应的值更新事件。如果第一个参数是字面量字符串，它将被用作 prop 名称；否则，prop 名称默认为 `"modelValue"`。在这两种情况下，你也可以传入一个额外对象，其中可以包含 prop 的选项以及模型 ref 的值转换选项。

```js
// 声明 "modelValue" prop，由父组件通过 v-model 使用
const model = defineModel()
// 或：声明带选项的 "modelValue" prop
const model = defineModel({ type: String })

// 在变更时发出 "update:modelValue"
model.value = 'hello'

// 声明 "count" prop，由父组件通过 v-model:count 使用
const count = defineModel('count')
// 或：声明带选项的 "count" prop
const count = defineModel('count', { type: Number, default: 0 })

function inc() {
  // 在变更时发出 "update:count"
  count.value++
}
```

:::warning
如果你为 `defineModel` prop 设置了 `default` 值，并且父组件没有为这个 prop 提供任何值，那么可能会导致父组件和子组件之间不同步。在下面的例子中，父组件的 `myRef` 是 undefined，但子组件的 `model` 是 1：

```vue [Child.vue]
<script setup>
const model = defineModel({ default: 1 })
</script>
```

```vue [Parent.vue]
<script setup>
const myRef = ref()
</script>

<template>
  <Child v-model="myRef"></Child>
</template>
```

:::

### 修饰符与转换器 {#modifiers-and-transformers}

要访问与 `v-model` 指令一起使用的修饰符，我们可以像这样对 `defineModel()` 的返回值进行解构：

```js
const [modelValue, modelModifiers] = defineModel()

// 对应于 v-model.trim
if (modelModifiers.trim) {
  // ...
}
```

当存在修饰符时，我们通常需要在读取值或将其同步回父组件时转换这个值。我们可以通过使用 `get` 和 `set` 转换器选项来实现这一点：

```js
const [modelValue, modelModifiers] = defineModel({
  // 这里省略了 get()，因为不需要
  set(value) {
    // 如果使用了 .trim 修饰符，则返回去除空白后的值
    if (modelModifiers.trim) {
      return value.trim()
    }
    // 否则，按原样返回该值
    return value
  }
})
```

### 与 TypeScript 一起使用 <sup class="vt-badge ts" /> {#usage-with-typescript}

和 `defineProps`、`defineEmits` 一样，`defineModel` 也可以接收类型参数，以指定模型值和修饰符的类型：

```ts
const modelValue = defineModel<string>()
//    ^? Ref<string | undefined>

// 带选项的默认模型，required 会移除可能的 undefined 值
const modelValue = defineModel<string>({ required: true })
//    ^? Ref<string>

const [modelValue, modifiers] = defineModel<string, 'trim' | 'uppercase'>()
//                 ^? Record<'trim' | 'uppercase', true | undefined>
```

## defineExpose() {#defineexpose}

使用 `<script setup>` 的组件默认是**封闭的**——也就是说，通过模板 ref 或 `$parent` 链获取到的组件公共实例，**不会**暴露 `<script setup>` 中声明的任何绑定。

要在 `<script setup>` 组件中显式暴露属性，请使用 `defineExpose` 编译器宏：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板 ref 获取到该组件实例时，拿到的实例形状将是 `{ a: number, b: number }`（refs 会像在普通实例上一样被自动解包）。

## defineOptions() {#defineoptions}

- 仅在 3.3+ 中受支持

这个宏可用于直接在 `<script setup>` 内声明组件选项，而无需使用单独的 `<script>` 块：

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- 这是一个宏。选项会被提升到模块作用域，并且不能访问 `<script setup>` 中那些不是字面量常量的局部变量。

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

- 仅在 3.3+ 中受支持

这个宏可用于向 IDE 提供插槽名称和 props 类型检查的类型提示。

`defineSlots()` 只接受类型参数，不接受运行时参数。类型参数应是一个类型字面量，其中属性键是插槽名称，属性值类型是插槽函数。函数的第一个参数是插槽期望接收的 props，它的类型将用于模板中的插槽 props。当前返回类型会被忽略，可以是 `any`，但将来我们可能会利用它进行插槽内容检查。

它还会返回 `slots` 对象，这与在 setup 上下文中暴露的 `slots` 对象或 `useSlots()` 返回的对象等价。

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

## `useSlots()` & `useAttrs()` {#useslots-useattrs}

在 `<script setup>` 内部使用 `slots` 和 `attrs` 的情况相对少见，因为你可以在模板中直接通过 `$slots` 和 `$attrs` 访问它们。如果确实需要使用，请分别使用 `useSlots` 和 `useAttrs` 辅助函数：

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` 和 `useAttrs` 是真正的运行时函数，返回的分别等同于 `setupContext.slots` 和 `setupContext.attrs`。它们也可以在普通的组合式 API 函数中使用。

## 与普通 `<script>` 一起使用 {#usage-alongside-normal-script}

`<script setup>` 可以和普通 `<script>` 一起使用。在以下情况中可能需要普通 `<script>`：

- 声明无法在 `<script setup>` 中表达的选项，例如 `inheritAttrs`，或通过插件启用的自定义选项（在 3.3+ 中可由 [`defineOptions`](/api/sfc-script-setup#defineoptions) 替代）。
- 声明具名导出。
- 执行副作用或创建只应执行一次的对象。

```vue
<script>
// 普通 <script>，在模块作用域中执行（只执行一次）
runSideEffectOnce()

// 声明额外选项
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// 在 setup() 作用域中执行（每个实例都会执行）
</script>
```

将 `<script setup>` 和 `<script>` 组合在同一个组件中的支持仅限于上述场景。具体来说：

- **不要** 为那些已经可以使用 `<script setup>` 定义的选项单独使用 `<script>` 部分，例如 `props` 和 `emits`。
- 在 `<script setup>` 中创建的变量不会作为属性添加到组件实例上，因此从 Options API 中无法访问它们。强烈不建议以这种方式混用 API。

如果你发现自己处于不受支持的场景之一，那么应考虑改用显式的 [`setup()`](/api/composition-api-setup) 函数，而不是使用 `<script setup>`。

## 顶层 `await` {#top-level-await}

可以在 `<script setup>` 中使用顶层 `await`。生成的代码将被编译为 `async setup()`：

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

此外，被等待的表达式会自动编译成一种格式，以便在 `await` 之后保留当前组件实例上下文。

:::warning 注意
`async setup()` 必须与 [`Suspense`](/guide/built-ins/suspense.html) 一起使用，而后者目前仍是实验性功能。我们计划在未来版本中将其完善并文档化——但如果你现在就想了解，可以参考它的 [tests](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) 来看看它是如何工作的。
:::

## 导入语句 {#imports-statements}

Vue 中的导入语句遵循 [ECMAScript 模块规范](https://nodejs.org/api/esm.html)。
此外，你还可以使用构建工具配置中定义的别名：

```vue
<script setup>
import { ref } from 'vue'
import { componentA } from './Components'
import { componentB } from '@/Components'
import { componentC } from '~/Components'
</script>
```

## 泛型 <sup class="vt-badge ts" /> {#generics}

可以通过 `<script>` 标签上的 `generic` 属性声明泛型类型参数：

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

`generic` 的值与 TypeScript 中 `<...>` 之间的参数列表完全相同。例如，你可以使用多个参数、`extends` 约束、默认类型，以及引用导入的类型：

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

当你想在 `ref` 中使用泛型组件的引用时，需要使用 [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) 库，因为 `InstanceType` 不会生效。

```vue
<script
  setup
  lang="ts"
>
import componentWithoutGenerics from '../component-without-generics.vue';
import genericComponent from '../generic-component.vue';

import type { ComponentExposed } from 'vue-component-type-helpers';

// 适用于不带泛型的组件
ref<InstanceType<typeof componentWithoutGenerics>>();

ref<ComponentExposed<typeof genericComponent>>();
```

## 限制 {#restrictions}

- 由于模块执行语义的差异，`<script setup>` 内的代码依赖于 SFC 的上下文。将其移动到外部 `.js` 或 `.ts` 文件时，可能会让开发者和工具都感到困惑。因此，**`<script setup>`** 不能与 `src` 属性一起使用。
- `<script setup>` 不支持 In-DOM Root Component Template。([相关讨论](https://github.com/vuejs/core/issues/8391))
