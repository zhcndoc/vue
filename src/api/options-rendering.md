# 选项：渲染 {#options-rendering}

## template {#template}

组件的字符串模板。

- **类型**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **详细信息**

  通过 `template` 选项提供的模板会在运行时即时编译。它仅在使用包含模板编译器的 Vue 构建版本时受支持。Vue 中名称包含 `runtime` 的构建版本**不包含**模板编译器，例如 `vue.runtime.esm-bundler.js`。有关不同构建版本的更多细节，请参阅 [dist 文件指南](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use)。

  如果字符串以 `#` 开头，它将被用作 `querySelector`，并使用所选元素的 `innerHTML` 作为模板字符串。这使得可以使用原生 `<template>` 元素来编写源模板。

  如果同一个组件中也存在 `render` 选项，则会忽略 `template`。

  如果应用的根组件没有指定 `template` 或 `render` 选项，Vue 会尝试使用挂载元素的 `innerHTML` 作为模板。

  :::warning 安全提示
  只应使用你信任的模板源。不要将用户提供的内容作为模板使用。更多详情请参阅 [安全指南](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates)。
  :::

## render {#render}

一个以编程方式返回组件虚拟 DOM 树的函数。

- **类型**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **详细信息**

  `render` 是字符串模板的替代方案，它允许你充分利用 JavaScript 的编程能力来声明组件的渲染输出。

  预编译模板，例如单文件组件中的模板，会在构建时被编译到 `render` 选项中。如果组件中同时存在 `render` 和 `template`，`render` 的优先级更高。

- **另请参阅**
  - [渲染机制](/guide/extras/rendering-mechanism)
  - [渲染函数](/guide/extras/render-function)

## compilerOptions {#compileroptions}

配置组件模板的运行时编译器选项。

- **类型**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // 默认值：'condense'
      delimiters?: [string, string] // 默认值：['{{', '}}']
      comments?: boolean // 默认值：false
    }
  }
  ```

- **详细信息**

  此配置项仅在使用完整构建时才会生效（即能够在浏览器中编译模板的独立 `vue.js`）。它支持与应用级 [app.config.compilerOptions](/api/application#app-config-compileroptions) 相同的选项，并且对当前组件具有更高优先级。

- **另请参阅** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

- 仅在 3.3+ 中支持

用于在渲染函数中以编程方式使用插槽时辅助类型推断的选项。

- **详细信息**

  此选项的运行时值不会被使用。实际类型应通过使用 `SlotsType` 类型辅助工具进行类型断言来声明：

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```
