# SFC 语法规范 {#sfc-syntax-specification}

## 概述 {#overview}

Vue 单文件组件（Single-File Component，SFC），通常使用 `*.vue` 文件扩展名，是一种使用类似 HTML 语法来描述 Vue 组件的自定义文件格式。Vue SFC 在语法上与 HTML 兼容。

每个 `*.vue` 文件由三种顶层语言块组成：`<template>`、`<script>` 和 `<style>`，并且还可以选择性地包含额外的自定义块：

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  例如，这里可以是组件的文档。
</custom1>
```

## 语言块 {#language-blocks}

### `<template>` {#template}

- 每个 `*.vue` 文件最多可以包含一个顶层 `<template>` 块。

- 其内容将被提取并传递给 `@vue/compiler-dom`，预编译为 JavaScript 渲染函数，并作为组件导出的 `render` 选项附加到组件上。

### `<script>` {#script}

- 每个 `*.vue` 文件最多可以包含一个 `<script>` 块（不包括 [`<script setup>`](/api/sfc-script-setup)）。

- 该脚本会作为 ES 模块执行。

- **默认导出** 应该是一个 Vue 组件选项对象，可以是普通对象，也可以是 [defineComponent](/api/general#definecomponent) 的返回值。

### `<script setup>` {#script-setup}

- 每个 `*.vue` 文件最多可以包含一个 `<script setup>` 块（不包括普通 `<script>`）。

- 该脚本会经过预处理，并作为组件的 `setup()` 函数使用，这意味着它会为**组件的每个实例**执行一次。`<script setup>` 中的顶层绑定会自动暴露给模板。更多细节请参见 [关于 `<script setup>` 的专门文档](/api/sfc-script-setup)。

### `<style>` {#style}

- 单个 `*.vue` 文件可以包含多个 `<style>` 标签。

- `<style>` 标签可以带有 `scoped` 或 `module` 属性（更多细节请参见 [SFC 样式特性](/api/sfc-css-features)），以帮助将样式封装到当前组件中。具有不同封装模式的多个 `<style>` 标签可以在同一个组件中混合使用。

### 自定义块 {#custom-blocks}

可以在 `*.vue` 文件中包含额外的自定义块，以满足任何项目特定需求，例如 `<docs>` 块。自定义块的一些真实世界示例包括：

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#i18n-custom-block)

自定义块的处理将取决于工具链——如果你想构建自己的自定义块集成，请参阅 [SFC 自定义块集成工具部分](/guide/scaling-up/tooling#sfc-custom-block-integrations) 了解更多细节。

## 自动名称推断 {#automatic-name-inference}

在以下情况下，SFC 会根据其**文件名**自动推断组件名称：

- 开发环境警告格式化
- DevTools 检查
- 递归自引用，例如名为 `FooBar.vue` 的文件可以在其模板中以 `<FooBar/>` 的形式引用自身。这一优先级低于显式注册/导入的组件。

## 预处理器 {#pre-processors}

块可以使用 `lang` 属性声明预处理器语言。最常见的情况是将 TypeScript 用于 `<script>` 块：

```vue-html
<script lang="ts">
  // 使用 TypeScript
</script>
```

`lang` 可以应用于任何块——例如，我们可以将 `<style>` 与 [Sass](https://sass-lang.com/) 一起使用，将 `<template>` 与 [Pug](https://pugjs.org/api/getting-started.html) 一起使用：

```vue-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

请注意，与各种预处理器的集成可能会因工具链而异。有关示例，请查看相应文档：

- [Vite](https://vite.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## `src` 导入 {#src-imports}

如果你更喜欢将 `*.vue` 组件拆分为多个文件，可以使用 `src` 属性为某个语言块导入外部文件：

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

请注意，`src` 导入遵循与 webpack 模块请求相同的路径解析规则，这意味着：

- 相对路径需要以 `./` 开头
- 你可以从 npm 依赖中导入资源：

```vue
<!-- 从已安装的 "todomvc-app-css" npm 包中导入文件 -->
<style src="todomvc-app-css/index.css" />
```

`src` 导入也适用于自定义块，例如：

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

:::warning 注意
在 `src` 中使用别名时，不要以 `~` 开头，后面的内容都会被解释为模块请求。这意味着你可以引用 node_modules 中的资源：
```vue
<img src="~some-npm-package/foo.png">
```
:::

## 注释 {#comments}

在每个块内部，你应当使用所用语言的注释语法（HTML、CSS、JavaScript、Pug 等）。对于顶层注释，请使用 HTML 注释语法：`<!-- comment contents here -->`
