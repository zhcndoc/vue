---
outline: deep
---

# Vue 与 TypeScript 的使用 {#using-vue-with-typescript}

像 TypeScript 这样的类型系统可以在构建时通过静态分析检测许多常见错误。这降低了生产环境中运行时错误的概率，也让我们在大型应用中更有信心地重构代码。TypeScript 还通过在 IDE 中基于类型的自动补全提升了开发体验。

Vue 本身就是用 TypeScript 编写的，并提供一流的 TypeScript 支持。所有官方 Vue 包都附带了类型声明，开箱即用。

## 项目设置 {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue) 是官方的项目脚手架工具，提供了创建一个由 [Vite](https://vite.dev/) 驱动、支持 TypeScript 的 Vue 项目的选项。

### 概述 {#overview}

在基于 Vite 的设置中，开发服务器和打包器只负责转译，不进行任何类型检查。这确保了即使使用 TypeScript，Vite 开发服务器也能保持极快的速度。

- 在开发过程中，我们建议依赖一个优秀的 [IDE 配置](#ide-support)，以便即时获得类型错误反馈。

- 如果使用 SFC，请使用 [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) 工具进行命令行类型检查和类型声明生成。`vue-tsc` 是对 `tsc` 的封装，而 `tsc` 是 TypeScript 自带的命令行接口。它的工作方式与 `tsc` 基本相同，不同之处在于它除了支持 TypeScript 文件之外，还支持 Vue SFC。你可以在开发服务器旁边以 watch 模式运行 `vue-tsc`，或者使用类似 [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) 的 Vite 插件，它会在单独的 worker 线程中运行检查。

- Vue CLI 也提供 TypeScript 支持，但不再推荐使用。请参见[下方说明](#note-on-vue-cli-and-ts-loader)。

### IDE 支持 {#ide-support}

- 强烈推荐使用 [Visual Studio Code](https://code.visualstudio.com/)（VS Code），因为它对 TypeScript 提供了极佳的开箱即用支持。

  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（以前称为 Volar）是官方的 VS Code 扩展，为 Vue SFC 内提供 TypeScript 支持，同时还提供许多其他优秀功能。

    :::tip
    Vue - Official 扩展替代了 [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)，后者是我们之前为 Vue 2 提供的官方 VS Code 扩展。如果你当前安装了 Vetur，请确保在 Vue 3 项目中将其禁用。
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) 也对 TypeScript 和 Vue 提供了开箱即用的支持。其他 JetBrains IDE 也支持它们，要么开箱即用，要么通过[一个免费插件](https://plugins.jetbrains.com/plugin/9442-vue-js)。截至 2023.2 版本，WebStorm 和 Vue Plugin 已内置支持 Vue Language Server。你可以在 Settings > Languages & Frameworks > TypeScript > Vue 下，将 Vue 服务设置为在所有 TypeScript 版本上使用 Volar 集成。默认情况下，TypeScript 版本 5.0 及以上将使用 Volar。

### 配置 `tsconfig.json` {#configuring-tsconfig-json}

通过 `create-vue` 脚手架生成的项目已经包含预配置好的 `tsconfig.json`。基础配置被抽象在 [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) 包中。在项目内部，我们使用 [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) 来确保运行于不同环境中的代码类型正确（例如，应用代码和测试代码应拥有不同的全局变量）。

手动配置 `tsconfig.json` 时，一些值得注意的选项包括：

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) 被设为 `true`，因为 Vite 使用 [esbuild](https://esbuild.github.io/) 来转译 TypeScript，并受单文件转译限制的影响。[`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) 是 [`isolatedModules` 的超集](https://github.com/microsoft/TypeScript/issues/53601)，也是一个不错的选择——这也是 [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) 所使用的设置。

- 如果你使用的是 Options API，你需要将 [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) 设置为 `true`（或者至少启用 [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis)，它是 `strict` 标志的一部分），以便利用组件选项中 `this` 的类型检查。否则 `this` 会被视为 `any`。

- 如果你在构建工具中配置了解析器别名，例如 `create-vue` 项目默认配置的 `@/*` 别名，你还需要通过 [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) 为 TypeScript 进行配置。

- 如果你打算在 Vue 中使用 TSX，请将 [`compilerOptions.jsx`](https://www.typescriptlang.org/tsconfig#jsx) 设置为 `"preserve"`，并将 [`compilerOptions.jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) 设置为 `"vue"`。

另请参见：

- [TypeScript 官方编译器选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript 编译注意事项](https://esbuild.github.io/content-types/#typescript-caveats)

### 关于 Vue CLI 和 `ts-loader` 的说明 {#note-on-vue-cli-and-ts-loader}

在像 Vue CLI 这样的基于 webpack 的设置中，通常会在模块转换流水线中执行类型检查，例如使用 `ts-loader`。不过，这并不是一个干净的解决方案，因为类型系统需要了解整个模块图才能进行类型检查。单个模块的转换步骤并不是执行这项任务的合适位置。这会导致以下问题：

- `ts-loader` 只能检查转换后的代码类型。这与我们在 IDE 中或通过 `vue-tsc` 看到的错误并不一致，后者会直接映射回源代码。

- 类型检查可能很慢。当它与代码转换在同一个线程 / 进程中执行时，会显著影响整个应用的构建速度。

- 我们的 IDE 中已经在单独的进程里进行类型检查了，因此为了开发体验而牺牲速度，这种权衡并不划算。

如果你目前正在通过 Vue CLI 使用 Vue 3 + TypeScript，我们强烈建议迁移到 Vite。我们也在开发 CLI 选项，以启用仅转译的 TS 支持，这样你就可以改用 `vue-tsc` 进行类型检查。

## 通用使用说明 {#general-usage-notes}

### `defineComponent()` {#definecomponent}

为了让 TypeScript 正确推断组件选项中的类型，我们需要使用 [`defineComponent()`](/api/general#definecomponent) 来定义组件：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用类型推断
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // 类型：string | undefined
    this.msg // 类型：string
    this.count // 类型：number
  }
})
```

在使用不带 `<script setup>` 的 Composition API 时，`defineComponent()` 也支持推断传递给 `setup()` 的 props：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用类型推断
  props: {
    message: String
  },
  setup(props) {
    props.message // 类型：string | undefined
  }
})
```

另请参见：

- [关于 webpack Tree Shaking 的说明](/api/general#note-on-webpack-treeshaking)
- [`defineComponent` 的类型测试](https://github.com/vuejs/core/blob/main/packages-private/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` 也能为使用纯 JavaScript 定义的组件启用类型推断。
:::

### 在单文件组件中的使用 {#usage-in-single-file-components}

要在 SFC 中使用 TypeScript，请为 `<script>` 标签添加 `lang="ts"` 属性。当存在 `lang="ts"` 时，所有模板表达式也会享受更严格的类型检查。

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- 启用类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` 也可以与 `<script setup>` 一起使用：

```vue
<script setup lang="ts">
// 已启用 TypeScript
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- 启用类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```

### 模板中的 TypeScript {#typescript-in-templates}

当使用 `<script lang="ts">` 或 `<script setup lang="ts">` 时，`<template>` 也支持绑定表达式中的 TypeScript。这在你需要在模板表达式中进行类型转换时很有用。

下面是一个刻意构造的示例：

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- 因为 x 可能是字符串，所以这里会报错 -->
  {{ x.toFixed(2) }}
</template>
```

可以通过内联类型转换来规避这个问题：

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
如果使用 Vue CLI 或基于 webpack 的设置，模板表达式中的 TypeScript 需要 `vue-loader@^16.8.0`。
:::

### 与 TSX 一起使用 {#usage-with-tsx}

Vue 也支持使用 JSX / TSX 编写组件。详情请参见 [渲染函数与 JSX](/guide/extras/render-function.html#jsx-tsx) 指南。

## 泛型组件 {#generic-components}

泛型组件支持以下两种情况：

- 在 SFC 中：[`<script setup>` 的 `generic` 属性](/api/sfc-script-setup.html#generics)
- 渲染函数 / JSX 组件：[`defineComponent()` 的函数签名](/api/general.html#function-signature)

## API 特定示例 {#api-specific-recipes}

- [Composition API 中的 TS](./composition-api)
- [Options API 中的 TS](./options-api)
