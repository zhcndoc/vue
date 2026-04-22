# 实用类型 {#utility-types}

:::info
本页仅列出少数几种常用的实用类型，这些类型在使用时可能需要解释。完整的导出类型列表，请查阅 [源代码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131)。
:::

## PropType\<T> {#proptype-t}

在使用运行时 props 声明时，用于为更高级的类型给 prop 添加注解。

- **示例**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // 为 `Object` 提供更具体的类型
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **另见** [指南 - 为组件 Props 添加类型](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

- 仅支持 3.3+ 版本

`T | Ref<T>` 的别名。适合用于给 [组合式函数](/guide/reusability/composables.html) 的参数添加注解。

## MaybeRefOrGetter\<T> {#maybereforgetter}

- 仅支持 3.3+ 版本

`T | Ref<T> | (() => T)` 的别名。适合用于给 [组合式函数](/guide/reusability/composables.html) 的参数添加注解。

## ExtractPropTypes\<T> {#extractproptypes}

从运行时 props 选项对象中提取 prop 类型。提取出的类型是内部使用的，也就是组件接收到的已解析 props。这意味着布尔类型 props 和带默认值的 props 总是已定义的，即使它们不是必需的。

要提取对外公开的 props，也就是父组件被允许传入的 props，请使用 [`ExtractPublicPropTypes`](#extractpublicproptypes)。

- **示例**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

- 仅支持 3.3+ 版本

从运行时 props 选项对象中提取 prop 类型。提取出的类型是对外公开的，也就是父组件被允许传入的 props。

- **示例**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

用于扩展组件实例类型，以支持自定义全局属性。

- **示例**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  扩展必须放在模块 `.ts` 或 `.d.ts` 文件中。更多细节请参见 [类型扩展位置](/guide/typescript/options-api#augmenting-global-properties)。
  :::

- **另见** [指南 - 扩展全局属性](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

用于扩展组件选项类型，以支持自定义选项。

- **示例**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  扩展必须放在模块 `.ts` 或 `.d.ts` 文件中。更多细节请参见 [类型扩展位置](/guide/typescript/options-api#augmenting-global-properties)。
  :::

- **另见** [指南 - 扩展自定义选项](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

用于扩展允许的 TSX props，以便在 TSX 元素上使用未声明的 props。

- **示例**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // 现在即使 hello 不是已声明的 prop 也能正常工作
  <MyComponent hello="world" />
  ```

  :::tip
  扩展必须放在模块 `.ts` 或 `.d.ts` 文件中。更多细节请参见 [类型扩展位置](/guide/typescript/options-api#augmenting-global-properties)。
  :::

## CSSProperties {#cssproperties}

用于扩展样式属性绑定中允许的值。

- **示例**

  允许任何自定义 CSS 属性

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```

  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
扩展必须放在模块 `.ts` 或 `.d.ts` 文件中。更多细节请参见 [类型扩展位置](/guide/typescript/options-api#augmenting-global-properties)。
:::

:::info 另见
SFC `<style>` 标签支持使用 `v-bind` CSS 函数将 CSS 值与动态组件状态关联起来。这使得无需类型扩展也能使用自定义属性。

- [CSS 中的 v-bind() ](/api/sfc-css-features#v-bind-in-css)
  :::
