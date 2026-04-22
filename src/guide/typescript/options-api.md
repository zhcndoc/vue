# 使用 Options API 的 TypeScript {#typescript-with-options-api}

> 本页假设你已经阅读过 [在 Vue 中使用 TypeScript](./overview) 的概览。

:::tip
虽然 Vue 确实支持在 Options API 中使用 TypeScript，但仍建议通过 Composition API 在 Vue 中使用 TypeScript，因为它提供了更简单、更高效且更健壮的类型推断。
:::

## 为组件 Props 添加类型 {#typing-component-props}

在 Options API 中，对 props 的类型推断需要用 `defineComponent()` 包裹组件。这样一来，Vue 就能够根据 `props` 选项推断出 props 的类型，并考虑 `required: true` 和 `default` 等额外选项：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 已启用类型推断
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // 类型: string | undefined
    this.id // 类型: number | string | undefined
    this.msg // 类型: string
    this.metadata // 类型: any
  }
})
```

不过，运行时的 `props` 选项只支持使用构造函数作为 prop 的类型——无法指定诸如带有嵌套属性的对象或函数调用签名这类复杂类型。

要为复杂的 props 类型添加注释，我们可以使用 `PropType` 工具类型：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // 为 `Object` 提供更具体的类型
      type: Object as PropType<Book>,
      required: true
    },
    // 也可以为函数添加注释
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS 错误：类型为 'string' 的参数
    // 不能分配给类型为 'number' 的参数
    this.callback?.('123')
  }
})
```

### 注意事项 {#caveats}

如果你的 TypeScript 版本低于 `4.7`，在使用 `validator` 和 `default` prop 选项的函数值时要格外小心——请务必使用箭头函数：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // 如果你的 TypeScript 版本低于 4.7，请务必使用箭头函数
      default: () => ({
        title: '箭头函数表达式'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

这可以避免 TypeScript 需要推断这些函数内部 `this` 的类型，而这不幸可能导致类型推断失败。这曾是一个先前的 [设计限制](https://github.com/microsoft/TypeScript/issues/38845)，而现在已在 [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods) 中得到改进。

## 为组件 Emits 添加类型 {#typing-component-emits}

我们可以使用 `emits` 选项的对象语法来声明某个已发出事件的预期 payload 类型。此外，所有未声明的已发出事件在调用时都会抛出类型错误：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // 执行运行时校验
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // 类型错误！
      })

      this.$emit('non-declared-event') // 类型错误！
    }
  }
})
```

## 为计算属性添加类型 {#typing-computed-properties}

计算属性会根据其返回值推断类型：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // 类型: string
  }
})
```

在某些情况下，你可能希望显式注解计算属性的类型，以确保其实现正确：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // 显式注解返回类型
    greeting(): string {
      return this.message + '!'
    },

    // 为可写计算属性添加注解
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

在某些边缘情况下，由于循环推断链，TypeScript 无法推断计算属性的类型，此时也可能需要显式注解。

## 为事件处理函数添加类型 {#typing-event-handlers}

处理原生 DOM 事件时，正确地为传入处理函数的参数添加类型可能会很有用。让我们看一个例子：

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` 会被隐式地视为 `any` 类型
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

如果不进行类型注解，`event` 参数会隐式具有 `any` 类型。如果在 `tsconfig.json` 中使用 `"strict": true` 或 `"noImplicitAny": true`，这也会导致 TS 错误。因此建议显式为事件处理函数的参数添加注解。此外，在访问 `event` 的属性时，你可能需要使用类型断言：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## 扩展全局属性 {#augmenting-global-properties}

某些插件会通过 [`app.config.globalProperties`](/api/application#app-config-globalproperties) 向所有组件实例安装全局可用属性。例如，我们可能会安装 `this.$http` 用于数据请求，或安装 `this.$translate` 用于国际化。为了让这与 TypeScript 配合良好，Vue 提供了一个 `ComponentCustomProperties` 接口，专门用于通过 [TypeScript 模块扩展](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) 进行增强：

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

另请参阅：

- [用于组件类型扩展的 TypeScript 单元测试](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

### 类型扩展的放置位置 {#type-augmentation-placement}

我们可以把这个类型扩展放在一个 `.ts` 文件中，或者放在项目级别的 `*.d.ts` 文件中。无论哪种方式，都要确保它已包含在 `tsconfig.json` 中。对于库 / 插件作者，这个文件应在 `package.json` 的 `types` 属性中指定。

为了利用模块扩展，你需要确保该扩展放在一个 [TypeScript 模块](https://www.typescriptlang.org/docs/handbook/modules.html) 中。也就是说，文件中至少需要包含一个顶层的 `import` 或 `export`，即使只是 `export {}`。如果扩展被放在模块外部，它会覆盖原始类型，而不是对其进行扩展！

```ts
// 不能工作，会覆盖原始类型。
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// 可以正常工作
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## 扩展自定义选项 {#augmenting-custom-options}

某些插件，例如 `vue-router`，支持自定义组件选项，例如 `beforeRouteEnter`：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

如果没有正确的类型扩展，这个钩子的参数会隐式具有 `any` 类型。我们可以扩展 `ComponentCustomOptions` 接口来支持这些自定义选项：

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

现在 `beforeRouteEnter` 选项就会有正确的类型了。注意这只是一个示例——像 `vue-router` 这样类型定义良好的库应该会在它们自己的类型定义中自动执行这些扩展。

这种扩展的放置位置受与 [全局属性扩展](#type-augmentation-placement) 相同的限制。

另请参阅：

- [用于组件类型扩展的 TypeScript 单元测试](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d-tsx)

## 为全局自定义指令添加类型 {#typing-global-custom-directives}

参见：[为自定义全局指令添加类型](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />
