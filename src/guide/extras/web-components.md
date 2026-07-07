# Vue 和 Web Components {#vue-and-web-components}

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 是一个总称，指一组原生 Web API，允许开发者创建可复用的自定义元素。

我们认为 Vue 和 Web Components 主要是互补的技术。Vue 对于消费和创建自定义元素都提供了出色的支持。无论你是在将自定义元素集成到现有的 Vue 应用中，还是使用 Vue 来构建和发布自定义元素，你都来对地方了。

## 在 Vue 中使用自定义元素 {#using-custom-elements-in-vue}

Vue 在 [Custom Elements Everywhere 测试中得分 100%](https://custom-elements-everywhere.com/libraries/vue/results/results.html)。在 Vue 应用中使用自定义元素，整体上与使用原生 HTML 元素类似，但有几件事需要注意：

### 跳过组件解析 {#skipping-component-resolution}

默认情况下，Vue 会先尝试将非原生 HTML 标签解析为已注册的 Vue 组件，然后才会回退为将其渲染为自定义元素。这会导致 Vue 在开发环境中发出“无法解析组件”的警告。为了让 Vue 知道某些元素应当被视为自定义元素并跳过组件解析，我们可以指定 [`compilerOptions.isCustomElement` 选项](/api/application#app-config-compileroptions)。

如果你在使用带构建步骤的 Vue，这个选项应通过构建配置传入，因为它是一个编译时选项。

#### 浏览器内配置示例 {#example-in-browser-config}

```js
// 仅在使用浏览器内编译时有效。
// 如果使用构建工具，请看下面的配置示例。
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Vite 配置示例 {#example-vite-config}

```js [vite.config.js]
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有带有连字符的标签视为自定义元素
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Vue CLI 配置示例 {#example-vue-cli-config}

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // 将任何以 ion- 开头的标签视为自定义元素
          isCustomElement: (tag) => tag.startsWith('ion-')
        }
      }))
  }
}
```

### 传递 DOM 属性 {#passing-dom-properties}

由于 DOM 属性只能是字符串，我们需要将复杂数据作为 DOM 属性传递给自定义元素。在为自定义元素设置 props 时，Vue 3 会自动使用 `in` 运算符检查 DOM 属性是否存在，并在键存在时优先将值作为 DOM 属性设置。这意味着，在大多数情况下，如果自定义元素遵循 [推荐的最佳实践](https://web.dev/custom-elements-best-practices/)，你就不需要为此操心。

不过，在少数情况下，数据必须作为 DOM 属性传递，但自定义元素没有正确地定义/反映该属性（导致 `in` 检查失败）。在这种情况下，你可以使用 `.prop` 修饰符强制将 `v-bind` 绑定设置为 DOM 属性：

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- 简写等价写法 -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## 使用 Vue 构建自定义元素 {#building-custom-elements-with-vue}

自定义元素的主要优点是它们可以与任何框架一起使用，甚至不需要框架。这使它们非常适合用于分发组件，因为最终使用者可能不会使用相同的前端技术栈，或者当你希望将最终应用与其所使用组件的实现细节隔离开来时。

### defineCustomElement {#definecustomelement}

Vue 支持通过 [`defineCustomElement`](/api/custom-elements#definecustomelement) 方法，使用完全相同的 Vue 组件 API 来创建自定义元素。该方法接受与 [`defineComponent`](/api/general#definecomponent) 相同的参数，但返回的是一个扩展自 `HTMLElement` 的自定义元素构造函数：

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 这里是普通 Vue 组件选项
  props: {},
  emits: {},
  template: `...`,

  // 仅 defineCustomElement：注入到 shadow root 中的 CSS
  styles: [`/* 内联 css */`]
})

// 注册自定义元素。
// 注册后，页面上所有 `<my-vue-element>` 标签
// 都会被升级。
customElements.define('my-vue-element', MyVueElement)

// 你也可以以编程方式实例化该元素：
// （只能在注册之后进行）
document.body.appendChild(
  new MyVueElement({
    // 初始 props（可选）
  })
)
```

#### 生命周期 {#lifecycle}

- 当元素的 [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) 第一次被调用时，Vue 自定义元素会在其 shadow root 内挂载一个内部 Vue 组件实例。

- 当元素的 `disconnectedCallback` 被调用时，Vue 会在一个微任务 tick 之后检查该元素是否已经从文档中移除。

  - 如果元素仍在文档中，那就是一次移动，组件实例将被保留；

  - 如果元素已从文档中移除，那就是一次删除，组件实例将被卸载。

#### Props {#props}

- 所有使用 `props` 选项声明的 props 都会以属性的形式定义在自定义元素上。Vue 会在适当的情况下自动处理属性 / 属性值之间的反射。

  - 属性始终会反射到对应的属性。

  - 具有原始值（`string`、`boolean` 或 `number`）的属性会反射为属性。

- 当以属性形式设置时，Vue 还会自动将使用 `Boolean` 或 `Number` 类型声明的 props 转换为期望的类型（它们始终是字符串）。例如，给定如下 props 声明：

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  以及如下自定义元素用法：

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  在组件中，`selected` 会被转换为 `true`（布尔值），而 `index` 会被转换为 `1`（数字）。

#### 事件 {#events}

通过 `this.$emit` 或 setup `emit` 发出的事件，会作为原生 [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) 派发到自定义元素上。额外的事件参数（payload）会以数组形式暴露在 CustomEvent 对象的 `detail` 属性中。

#### 插槽 {#slots}

在组件内部，可以像往常一样使用 `<slot/>` 元素来渲染插槽。不过，在消费生成的元素时，它只接受 [原生插槽语法](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)：

- 不支持 [作用域插槽](/guide/components/slots#scoped-slots)。

- 传递具名插槽时，请使用 `slot` 属性而不是 `v-slot` 指令：

  ```vue-html
  <my-element>
    <div slot="named">你好</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

[Provide / Inject API](/guide/components/provide-inject#provide-inject) 及其 [Composition API 等价方案](/api/composition-api-dependency-injection#provide) 也可以在 Vue 定义的自定义元素之间工作。不过请注意，这种方式 **仅在自定义元素之间** 生效。也就是说，Vue 定义的自定义元素无法注入由非自定义元素 Vue 组件提供的属性。

#### 应用级配置 <sup class="vt-badge" data-text="3.5+" /> {#app-level-config}

你可以使用 `configureApp` 选项来配置 Vue 自定义元素的应用实例：

```js
defineCustomElement(MyComponent, {
  configureApp(app) {
    app.config.errorHandler = (err) => {
      /* ... */
    }
  }
})
```

### 作为自定义元素的 SFC {#sfc-as-custom-element}

`defineCustomElement` 也可用于 Vue 单文件组件（SFC）。不过，在默认工具链设置下，SFC 中的 `<style>` 在生产构建时仍会被提取并合并为一个单独的 CSS 文件。当将 SFC 用作自定义元素时，通常更希望将 `<style>` 标签注入到自定义元素的 shadow root 中。

官方的 SFC 工具支持以“自定义元素模式”导入 SFC（需要 `@vitejs/plugin-vue@^1.4.0` 或 `vue-loader@^16.5.0`）。以自定义元素模式加载的 SFC 会将其 `<style>` 标签内联为 CSS 字符串，并通过组件的 `styles` 选项暴露出来。`defineCustomElement` 会接收这些内容，并在实例化时将其注入到元素的 shadow root 中。

要启用此模式，只需将组件文件名以 `.ce.vue` 结尾：

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* 内联 css */"]

// 转换为自定义元素构造函数
const ExampleElement = defineCustomElement(Example)

// 注册
customElements.define('my-example', ExampleElement)
```

如果你希望自定义哪些文件应以自定义元素模式导入（例如，将 _所有_ SFC 都视为自定义元素），可以将 `customElement` 选项传递给相应的构建插件：

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Vue 自定义元素库的建议 {#tips-for-a-vue-custom-elements-library}

使用 Vue 构建自定义元素时，这些元素将依赖 Vue 的运行时。其基础体积开销约为 16kb，具体取决于所使用的功能数量。这意味着，如果你只发布单个自定义元素，使用 Vue 并不理想——你可能会希望使用原生 JavaScript、[petite-vue](https://github.com/vuejs/petite-vue) 或专注于小运行时体积的框架。不过，如果你要发布的是一组具有复杂逻辑的自定义元素，那么这个基础体积就很有价值，因为 Vue 能让每个组件用更少的代码来编写。你一起发布的元素越多，这种权衡就越划算。

如果这些自定义元素会在同样使用 Vue 的应用中使用，你可以选择在构建产物中将 Vue 外部化，这样这些元素就会使用宿主应用中的同一份 Vue 副本。

建议导出单独的元素构造函数，这样你的用户就可以灵活地按需导入它们，并用所需的标签名注册它们。你也可以导出一个便捷函数来自动注册所有元素。下面是一个 Vue 自定义元素库的入口示例：

```js [elements.js]

import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// 导出单独的元素
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

使用者可以在 Vue 文件中使用这些元素：

```vue
<script setup>
import { register } from 'path/to/elements.js'
register()
</script>

<template>
  <my-foo ...>
    <my-bar ...></my-bar>
  </my-foo>
</template>
```

或者在任何其他框架中使用，比如带有 JSX 的框架，并使用自定义名称：

```jsx
import { MyFoo, MyBar } from 'path/to/elements.js'

customElements.define('some-foo', MyFoo)
customElements.define('some-bar', MyBar)

export function MyComponent() {
  return <>
    <some-foo ... >
      <some-bar ... ></some-bar>
    </some-foo>
  </>
}
```

### 基于 Vue 的 Web Components 和 TypeScript {#web-components-and-typescript}

在编写 Vue SFC 模板时，你可能希望对 Vue 组件进行 [类型检查](/guide/scaling-up/tooling.html#typescript)，包括那些被定义为自定义元素的组件。

自定义元素会通过浏览器内置 API 在全局注册，默认情况下在 Vue 模板中使用时不会获得类型推断。为了让注册为自定义元素的 Vue 组件获得类型支持，我们可以通过扩展 [`GlobalComponents` 接口](https://github.com/vuejs/language-tools/wiki/Global-Component-Types) 来注册全局组件类型，以便在 Vue 模板中进行类型检查（JSX 用户则可以扩展 [JSX.IntrinsicElements](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) 类型，这里不作展示）。

以下是如何定义一个使用 Vue 制作的自定义元素类型：

```typescript
import { defineCustomElement } from 'vue'

// 导入 Vue 组件。
import SomeComponent from './src/components/SomeComponent.ce.vue'

// 将 Vue 组件转换为 Custom Element 类。
export const SomeElement = defineCustomElement(SomeComponent)

// 记得向浏览器注册该元素类。
customElements.define('some-element', SomeElement)

// 将新的元素类型添加到 Vue 的 GlobalComponents 类型中。
declare module 'vue' {
  interface GlobalComponents {
    // 请务必在这里传入 Vue 组件类型 
    // （SomeComponent，而不是 SomeElement）。
    // Custom Elements 的名称必须包含连字符， 
    // 因此这里请使用带连字符的元素名。
    'some-element': typeof SomeComponent
  }
}
```

## 非 Vue 的 Web Components 和 TypeScript {#non-vue-web-components-and-typescript}

下面是为非用 Vue 构建的自定义元素在 SFC 模板中启用类型检查的推荐方式。

:::tip 注意
这种方法是一种可行方案，但具体实现可能会因用于创建自定义元素的框架而有所不同。
:::

假设我们有一个带有一些 JS 属性和事件定义的自定义元素，它被打包在一个名为 `some-lib` 的库中：

```ts [some-lib/src/SomeElement.ts]
// 定义一个带有类型化 JS 属性的类。
export class SomeElement extends HTMLElement {
  foo: number = 123
  bar: string = 'blah'

  lorem: boolean = false

  // 这个方法不应该暴露给模板类型。
  someMethod() {
    /* ... */
  }

  // ... 此处省略实现细节 ...
  // ... 假设该元素会派发名为 "apple-fell" 的事件 ...
}

customElements.define('some-element', SomeElement)

// 这是 SomeElement 属性的列表，这些属性会被选中用于框架模板
// （例如 Vue SFC 模板）的类型检查。其他任何
// 属性都不会被暴露。
export type SomeElementAttributes = 'foo' | 'bar'

// 定义 SomeElement 派发的事件类型。
export type SomeElementEvents = {
  'apple-fell': AppleFellEvent
}

export class AppleFellEvent extends Event {
  /* ... 细节省略 ... */
}
```

实现细节已被省略，但重要的是我们为两类内容提供了类型定义：属性类型和事件类型。

让我们为在 Vue 中轻松注册自定义元素类型定义创建一个类型辅助工具：

```ts [some-lib/src/DefineCustomElement.ts]
// 我们可以为需要定义的每个元素复用这个类型辅助工具。
type DefineCustomElement<
  ElementType extends HTMLElement,
  Events extends EventMap = {},
  SelectedAttributes extends keyof ElementType = keyof ElementType
> = new () => ElementType & {
  // 使用 $props 来定义暴露给模板类型检查的属性。Vue
  // 会专门从 `$props` 类型中读取属性定义。注意我们将元素的属性与全局 HTML 属性和 Vue 的特殊
  // 属性组合在一起。
  /** @deprecated 不要在自定义元素 ref 上使用 $props 属性，
    这仅用于模板属性类型。 */
  $props: HTMLAttributes &
    Partial<Pick<ElementType, SelectedAttributes>> &
    PublicProps

  // 使用 $emit 来专门定义事件类型。Vue 会专门从 `$emit` 类型中读取事件
  // 类型。注意 `$emit` 需要一种特定格式，
  // 我们会将 `Events` 映射为这种格式。
  /** @deprecated 不要在自定义元素 ref 上使用 $emit 属性，
    这仅用于模板属性类型。 */
  $emit: VueEmit<Events>
}

type EventMap = {
  [event: string]: Event
}

// 这会把 EventMap 映射为 Vue 的 $emit 类型所期望的格式。
type VueEmit<T extends EventMap> = EmitFn<{
  [K in keyof T]: (event: T[K]) => void
}>
```

:::tip 注意
我们将 `$props` 和 `$emit` 标记为已弃用，这样当我们获取自定义元素的 `ref` 时，就不会想要使用这些属性，因为这些属性仅在自定义元素的类型检查场景中有用。这些属性实际上并不存在于自定义元素实例上。
:::

使用这个类型辅助工具，我们现在可以选择应在 Vue 模板中暴露用于类型检查的 JS 属性：

```ts [some-lib/src/SomeElement.vue.ts]
import {
  SomeElement,
  SomeElementAttributes,
  SomeElementEvents
} from './SomeElement.js'
import type { Component } from 'vue'
import type { DefineCustomElement } from './DefineCustomElement'

// 将新的元素类型添加到 Vue 的 GlobalComponents 类型中。
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElement,
      SomeElementAttributes,
      SomeElementEvents
    >
  }
}
```

假设 `some-lib` 会把其源 TypeScript 文件构建到 `dist/` 文件夹中。`some-lib` 的用户就可以导入 `SomeElement` 并在 Vue SFC 中这样使用它：

```vue [SomeElementImpl.vue]
<script setup lang="ts">
// 这将创建并在浏览器中注册该元素。
import 'some-lib/dist/SomeElement.js'

// 使用 TypeScript 和 Vue 的用户还应额外导入
// Vue 特定的类型定义（使用其他框架的用户可以导入其他
// 框架特定的类型定义）。
import type {} from 'some-lib/dist/SomeElement.vue.js'

import { useTemplateRef, onMounted } from 'vue'

const el = useTemplateRef('el')

onMounted(() => {
  console.log(
    el.value!.foo,
    el.value!.bar,
    el.value!.lorem,
    el.value!.someMethod()
  )

  // 不要使用这些属性，它们的值是 `undefined`
  // IDE 会将它们显示为删除线
  el.$props
  el.$emit
})
</script>

<template>
  <!-- 现在我们可以使用这个元素，并获得类型检查： -->
  <some-element
    ref="el"
    :foo="456"
    :blah="'hello'"
    @apple-fell="
      (event) => {
        // 这里推断出的 `event` 类型是 `AppleFellEvent`
      }
    "
  ></some-element>
</template>
```

如果某个元素没有类型定义，也可以用更手动的方式定义其属性和事件类型：

```vue [SomeElementImpl.vue]
<script setup lang="ts">
// 假设 `some-lib` 是没有类型定义的纯 JS，TypeScript
// 无法推断这些类型：
import { SomeElement } from 'some-lib'

// 我们会使用和之前相同的类型辅助工具。
import { DefineCustomElement } from './DefineCustomElement'

type SomeElementProps = { foo?: number; bar?: string }
type SomeElementEvents = { 'apple-fell': AppleFellEvent }
interface AppleFellEvent extends Event {
  /* ... */
}

// 将新的元素类型添加到 Vue 的 GlobalComponents 类型中。
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElementProps,
      SomeElementEvents
    >
  }
}

// ... 与前面相同，使用对该元素的引用 ...
</script>

<template>
  <!-- ... 与前面相同，在模板中使用该元素 ... -->
</template>
```

自定义元素作者不应当从其库中自动导出框架特定的自定义元素类型定义，例如，不应当从一个同时还导出库其余内容的 `index.ts` 文件中导出这些定义，否则用户会遇到意料之外的模块增强错误。用户应当导入他们所需的框架特定类型定义文件。

## Web Components 与 Vue 组件 {#web-components-vs-vue-components}

有些开发者认为应当避免使用框架专有的组件模型，并且只使用自定义元素就能让应用“面向未来”。这里我们会尝试说明，为什么我们认为这种看法过于简单化了。

自定义元素和 Vue 组件之间确实存在一定程度的功能重叠：它们都允许我们定义可复用组件，并支持数据传递、事件触发和生命周期管理。然而，Web Components 的 API 相对来说更底层，也更简陋。要构建一个真正的应用，我们还需要许多平台并未覆盖的能力：

- 一个声明式且高效的模板系统；

- 一个响应式状态管理系统，便于提取和复用跨组件逻辑；

- 一种高性能的方式来在服务端渲染组件并在客户端进行 hydration（SSR），这对于 SEO 和 [Web Vitals 指标，例如 LCP](https://web.dev/vitals/) 很重要。原生自定义元素的 SSR 通常需要在 Node.js 中模拟 DOM，然后序列化被修改后的 DOM，而 Vue SSR 在可能的情况下会编译成字符串拼接，这样效率要高得多。

Vue 的组件模型正是围绕这些需求作为一个统一系统来设计的。

如果有一支能力足够强的工程团队，你也许可以在原生自定义元素之上构建出类似的方案——但这也意味着你要承担自研框架的长期维护成本，同时失去像 Vue 这样成熟框架所带来的生态和社区优势。

也有一些框架以自定义元素为其组件模型的基础，但它们最终都不可避免地必须引入自己专有的解决方案来处理上面列出的问题。使用这些框架就意味着你要接受它们在这些问题上的技术决策——而且，尽管它们可能会宣称自己可以避免这一切，但这并不意味着你就自动免于未来可能发生的变更成本。

我们还认为自定义元素在以下一些方面存在局限：

- 提前执行 slot 评估会妨碍组件组合。Vue 的 [作用域插槽](/guide/components/slots#scoped-slots) 是一种强大的组件组合机制，但由于原生 slot 的急切特性，自定义元素无法支持它。急切的 slot 还意味着接收组件无法控制何时或是否渲染一段 slot 内容。

- 如今若要把带有 shadow DOM 作用域 CSS 的自定义元素一起发布，就需要把 CSS 内嵌到 JavaScript 中，这样它们才能在运行时被注入到 shadow root 中。在 SSR 场景下，这也会导致标记中出现重复样式。这个领域正在推进一些[平台特性](https://github.com/whatwg/html/pull/4898/)——但截至目前它们还没有获得普遍支持，并且仍有生产环境性能 / SSR 方面的问题需要解决。与此同时，Vue SFC 提供了 [CSS 作用域机制](/api/sfc-css-features)，支持将样式提取为普通 CSS 文件。

Vue 将始终跟进 Web 平台的最新标准，并且如果平台提供的能力能让我们的工作更轻松，我们也会很乐意加以利用。然而，我们的目标是提供今天就能良好工作的解决方案。这意味着我们必须以审慎的态度引入新的平台特性——在标准尚未完善的时候，我们也需要补齐这些缺口。
