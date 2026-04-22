# 使用 Composition API 的 TypeScript {#typescript-with-composition-api}

<ScrimbaLink href="https://scrimba.com/links/vue-ts-composition-api" title="免费的 Vue.js Composition API TypeScript 课程" type="scrimba">
  在 Scrimba 上观看交互式视频课程
</ScrimbaLink>

> 本页假设你已经阅读过 [在 Vue 中使用 TypeScript](./overview) 的概述。

## 为组件 Props 添加类型 {#typing-component-props}

### 使用 `<script setup>` {#using-script-setup}

使用 `<script setup>` 时，`defineProps()` 宏支持根据其参数推断 props 类型：

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

这被称为“运行时声明”，因为传递给 `defineProps()` 的参数会被用作运行时的 `props` 选项。

不过，通常使用泛型类型参数通过纯类型来定义 props 会更直接：

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

这被称为“基于类型的声明”。编译器会尽最大努力根据类型参数推断出等价的运行时选项。在这个例子中，第二个示例编译后的运行时选项与第一个示例完全相同。

你可以使用基于类型的声明或运行时声明，但不能同时使用两者。

我们也可以把 props 类型放到单独的接口中：

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

如果 `Props` 是从其他文件导入的，这同样可行，例如相对路径导入、路径别名（如 `@/types`），或外部依赖（如 `node_modules`）。此功能要求 TypeScript 作为 Vue 的同级依赖。

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### 语法限制 {#syntax-limitations}

在 3.2 及以下版本中，`defineProps()` 的泛型类型参数仅限于类型字面量或对本地接口的引用。

这个限制在 3.3 中得到了修复。Vue 的最新版本支持在类型参数位置引用导入的类型，以及一部分复杂类型。不过，由于类型到运行时的转换仍然基于 AST，因此某些需要真正类型分析的复杂类型，例如条件类型，并不受支持。你可以将条件类型用于单个 prop 的类型，但不能用于整个 props 对象。

### Props 默认值 {#props-default-values}

使用基于类型的声明时，我们会失去为 props 声明默认值的能力。可以通过使用 [Reactive Props Destructure](/guide/components/props#reactive-props-destructure) <sup class="vt-badge" data-text="3.5+" /> 来解决：

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

在 3.4 及以下版本中，Reactive Props Destructure 默认未启用。另一种方法是使用 `withDefaults` 编译器宏：

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

这会被编译为等价的运行时 props `default` 选项。此外，`withDefaults` 辅助函数会对默认值进行类型检查，并确保返回的 `props` 类型中，对于那些已声明默认值的属性，会移除其可选标记。

:::info
请注意，可变引用类型（如数组或对象）的默认值在使用 `withDefaults` 时应包裹在函数中，以避免意外修改和外部副作用。这可以确保每个组件实例都拥有自己的默认值副本。使用解构时的默认值则**不需要**这样做。
:::

### 不使用 `<script setup>` {#without-script-setup}

如果不使用 `<script setup>`，则需要使用 `defineComponent()` 来启用 props 类型推断。传递给 `setup()` 的 props 对象类型会根据 `props` 选项推断出来。

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- 类型：string
  }
})
```

### 复杂的 prop 类型 {#complex-prop-types}

使用基于类型的声明时，prop 可以像其他类型一样使用复杂类型：

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

对于运行时声明，我们可以使用 `PropType` 工具类型：

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

如果我们直接指定 `props` 选项，工作方式也大致相同：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

`props` 选项更常与 Options API 一起使用，因此在 [TypeScript 与 Options API](/guide/typescript/options-api#typing-component-props) 的指南中你会找到更详细的示例。上述示例中展示的技巧也同样适用于使用 `defineProps()` 的运行时声明。

## 为组件 Emits 添加类型 {#typing-component-emits}

在 `<script setup>` 中，`emit` 函数也可以通过运行时声明或类型声明来添加类型：

```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于选项
const emit = defineEmits({
  change: (id: number) => {
    // 返回 `true` 或 `false` 以表示
    // 校验通过 / 失败
  },
  update: (value: string) => {
    // 返回 `true` 或 `false` 以表示
    // 校验通过 / 失败
  }
})

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+：另一种更简洁的语法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

类型参数可以是以下几种之一：

1. 一个可调用函数类型，但要写成带有 [调用签名](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures) 的类型字面量。它将被用作返回的 `emit` 函数的类型。
2. 一个类型字面量，其中键为事件名，值为数组 / 元组类型，表示该事件额外接受的参数。上面的示例使用的是命名元组，因此每个参数都可以有明确的名称。

如你所见，类型声明让我们能够对触发的事件的类型约束进行更细粒度的控制。

在不使用 `<script setup>` 时，`defineComponent()` 能够推断在 setup 上下文中暴露的 `emit` 函数所允许的事件：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- 类型检查 / 自动补全
  }
})
```

## 为 `ref()` 添加类型 {#typing-ref}

Ref 会根据初始值推断类型：

```ts
import { ref } from 'vue'

// 推断类型：Ref<number>
const year = ref(2020)

// => TS 错误：类型 'string' 不能赋值给类型 'number'。
year.value = '2020'
```

有时我们可能需要为 ref 的内部值指定复杂类型。可以使用 `Ref` 类型来做到这一点：

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 可以！
```

或者，在调用 `ref()` 时传入泛型参数，以覆盖默认推断：

```ts
// 结果类型：Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // 可以！
```

如果你指定了泛型类型参数，但省略初始值，结果类型将是包含 `undefined` 的联合类型：

```ts
// 推断类型：Ref<number | undefined>
const n = ref<number>()
```

## 为 `reactive()` 添加类型 {#typing-reactive}

`reactive()` 也会根据其参数隐式推断类型：

```ts
import { reactive } from 'vue'

// 推断类型：{ title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

要显式为 `reactive` 属性添加类型，我们可以使用接口：

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip
不建议使用 `reactive()` 的泛型参数，因为返回类型（它负责处理嵌套 ref 的解包）与泛型参数类型并不相同。
:::

## 为 `computed()` 添加类型 {#typing-computed}

`computed()` 会根据 getter 的返回值推断其类型：

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// 推断类型：ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS 错误：属性 'split' 不存在于类型 'number' 上
const result = double.value.split('')
```

你也可以通过泛型参数显式指定类型：

```ts
const double = computed<number>(() => {
  // 如果这里没有返回一个 number，就会报类型错误
})
```

## 为事件处理器添加类型 {#typing-event-handlers}

处理原生 DOM 事件时，正确为传递给处理器的参数添加类型会很有用。让我们看一下这个例子：

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` 隐式具有 `any` 类型
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

如果不加类型注解，`event` 参数将会隐式具有 `any` 类型。如果在 `tsconfig.json` 中使用了 `"strict": true` 或 `"noImplicitAny": true`，这也会导致 TS 错误。因此建议显式为事件处理器的参数添加类型注解。此外，在访问 `event` 的属性时，你可能还需要使用类型断言：

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## 输入 / 注入的类型标注 {#typing-provide-inject}

provide 和 inject 通常在不同的组件中执行。为了正确地为注入值添加类型，Vue 提供了 `InjectionKey` 接口，它是一个扩展自 `Symbol` 的泛型类型。它可用于在提供者和消费者之间同步注入值的类型：

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 提供非字符串值会导致错误

const foo = inject(key) // foo 的类型：string | undefined
```

建议将注入 key 放在单独的文件中，这样可以在多个组件中导入。

当使用字符串注入 key 时，注入值的类型将是 `unknown`，并且需要通过泛型类型参数显式声明：

```ts
const foo = inject<string>('foo') // 类型：string | undefined
```

请注意，注入值仍然可能是 `undefined`，因为运行时无法保证提供者一定会提供这个值。

可以通过提供默认值来移除 `undefined` 类型：

```ts
const foo = inject<string>('foo', 'bar') // 类型：string
```

如果你确定该值总是会被提供，也可以强制类型转换：

```ts
const foo = inject('foo') as string
```

## 模板引用的类型标注 {#typing-template-refs}

在 Vue 3.5 和 `@vue/language-tools` 2.1（同时支持 IDE 语言服务和 `vue-tsc`）中，SFC 里通过 `useTemplateRef()` 创建的 ref 类型，可以根据匹配的 `ref` 属性所使用的元素，针对静态 ref **自动推断**。

在无法自动推断的情况下，你仍然可以通过泛型参数将模板 ref 转换为显式类型：

```ts
const el = useTemplateRef<HTMLInputElement>('el')
```

<details>
<summary>3.5 之前的用法</summary>

模板 ref 应使用显式的泛型类型参数，并将初始值设为 `null` 创建：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

</details>

要获取正确的 DOM 接口，你可以查看像 [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#technical_summary) 这样的页面。

请注意，为了严格的类型安全，在访问 `el.value` 时需要使用可选链或类型守卫。这是因为在组件挂载之前，初始 ref 值是 `null`，并且如果被 `v-if` 引用的元素被卸载，它也可能被设为 `null`。

## 组件模板引用的类型标注 {#typing-component-template-refs}

在 Vue 3.5 和 `@vue/language-tools` 2.1（同时支持 IDE 语言服务和 `vue-tsc`）中，SFC 里通过 `useTemplateRef()` 创建的 ref 类型，可以根据匹配的 `ref` 属性所使用的元素或组件，针对静态 ref **自动推断**。

在无法自动推断的情况下（例如非 SFC 用法或动态组件），你仍然可以通过泛型参数将模板 ref 转换为显式类型。

为了获取导入组件的实例类型，我们需要先通过 `typeof` 获取其类型，然后使用 TypeScript 内置的 `InstanceType` 工具类型来提取其实例类型：

```vue{6,7} [App.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

在组件的确切类型不可用或并不重要的情况下，可以改用 `ComponentPublicInstance`。这只会包含所有组件共享的属性，例如 `$el`：

```ts
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance>('child')
```

在被引用的组件是一个[泛型组件](/guide/typescript/overview.html#generic-components)时，例如 `MyGenericModal`：

```vue [MyGenericModal.vue]
<script setup lang="ts" generic="ContentType extends string | number">
import { ref } from 'vue'

const content = ref<ContentType | null>(null)

const open = (newContent: ContentType) => (content.value = newContent)

defineExpose({
  open
})
</script>
```

需要使用 [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) 库中的 `ComponentExposed` 来引用，因为 `InstanceType` 不起作用。

```vue [App.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MyGenericModal from './MyGenericModal.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

const modal =
  useTemplateRef<ComponentExposed<typeof MyGenericModal>>('modal')

const openModal = () => {
  modal.value?.open('newValue')
}
</script>
```

请注意，在 `@vue/language-tools` 2.1+ 中，静态模板 ref 的类型可以自动推断，上面的写法只在边缘情况下才需要。

## 全局自定义指令的类型标注 {#typing-global-custom-directives}

为了获得通过 `app.directive()` 声明的全局自定义指令的类型提示和类型检查，你可以扩展 `GlobalDirectives`

```ts [src/directives/highlight.ts]
import type { Directive } from 'vue'

export type HighlightDirective = Directive<HTMLElement, string>

declare module 'vue' {
  export interface GlobalDirectives {
    // 前缀加 v（v-highlight）
    vHighlight: HighlightDirective
  }
}

export default {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value
  }
} satisfies HighlightDirective
```

```ts [main.ts]
import highlight from './directives/highlight'
// ...其他代码
const app = createApp(App)
app.directive('highlight', highlight)
```

在组件中的使用

```vue [App.vue]
<template>
  <p v-highlight="'blue'">This sentence is important!</p>
</template>
```
