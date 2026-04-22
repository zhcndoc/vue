# 应用 API {#application-api}

## createApp() {#createapp}

创建一个应用实例。

- **类型**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **详情**

  第一个参数是根组件。第二个可选参数是要传递给根组件的 props。

- **示例**

  使用内联根组件：

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* 根组件选项 */
  })
  ```

  使用导入的组件：

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **另请参阅** [指南 - 创建 Vue 应用](/guide/essentials/application)

## createSSRApp() {#createssrapp}

创建一个处于 [SSR Hydration](/guide/scaling-up/ssr#client-hydration) 模式下的应用实例。用法与 `createApp()` 完全相同。

## app.mount() {#app-mount}

将应用实例挂载到一个容器元素中。

- **类型**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **详情**

  参数可以是实际的 DOM 元素，也可以是 CSS 选择器（将使用第一个匹配到的元素）。返回根组件实例。

  如果组件定义了模板或渲染函数，它将替换容器内现有的任何 DOM 节点。否则，如果运行时编译器可用，则会使用容器的 `innerHTML` 作为模板。

  在 SSR hydration 模式下，它会对容器内现有的 DOM 节点进行 hydration。如果存在 [不匹配](/guide/scaling-up/ssr#hydration-mismatch)，现有的 DOM 节点将被调整以匹配预期输出。

  对于每个应用实例，`mount()` 只能调用一次。

- **示例**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  也可以挂载到实际的 DOM 元素：

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

卸载已挂载的应用实例，触发应用组件树中所有组件的卸载生命周期钩子。

- **类型**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.onUnmount() <sup class="vt-badge" data-text="3.5+" /> {#app-onunmount}

注册一个回调函数，在应用卸载时调用。

- **类型**

  ```ts
  interface App {
    onUnmount(callback: () => any): void
  }
  ```

## app.component() {#app-component}

如果同时传入名称字符串和组件定义，则注册一个全局组件；如果只传入名称，则获取已注册的组件。

- **类型**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **示例**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // 注册一个选项对象
  app.component('MyComponent', {
    /* ... */
  })

  // 获取已注册的组件
  const MyComponent = app.component('MyComponent')
  ```

- **另请参阅** [组件注册](/guide/components/registration)

## app.directive() {#app-directive}

如果同时传入名称字符串和指令定义，则注册一个全局自定义指令；如果只传入名称，则获取已注册的指令。

- **类型**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **示例**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // 注册（对象形式指令）
  app.directive('myDirective', {
    /* 自定义指令钩子 */
  })

  // 注册（函数形式指令简写）
  app.directive('myDirective', () => {
    /* ... */
  })

  // 获取已注册的指令
  const myDirective = app.directive('myDirective')
  ```

- **另请参阅** [自定义指令](/guide/reusability/custom-directives)

## app.use() {#app-use}

安装一个 [插件](/guide/reusability/plugins)。

- **类型**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **详情**

  第一个参数应为插件，第二个参数为可选的插件选项。

  插件可以是带有 `install()` 方法的对象，也可以只是一个将被用作 `install()` 方法的函数。选项（`app.use()` 的第二个参数）会被传递给插件的 `install()` 方法。

  当对同一个插件多次调用 `app.use()` 时，该插件只会被安装一次。

- **示例**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **另请参阅** [插件](/guide/reusability/plugins)

## app.mixin() {#app-mixin}

应用一个全局混入（作用域限定为该应用）。全局混入会将其包含的选项应用到应用中的每个组件实例。

:::warning 不推荐
Vue 3 支持 mixin 主要是为了向后兼容，因为生态系统库中广泛使用了它们。应避免在应用代码中使用 mixin，尤其是全局 mixin。

对于逻辑复用，建议改用 [组合式函数](/guide/reusability/composables)。
:::

- **类型**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

提供一个值，使其可被应用内所有后代组件注入。

- **类型**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **详情**

  第一个参数应为注入键，第二个参数为提供的值。返回应用实例本身。

- **示例**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  在应用中的某个组件内部：

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'hello'
    }
  }
  ```

  </div>

- **另请参阅**
  - [Provide / Inject](/guide/components/provide-inject)
  - [应用级 Provide](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

## app.runWithContext() {#app-runwithcontext}

- 仅在 3.3+ 中支持

使用当前应用作为注入上下文执行一个回调。

- **类型**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **详情**

  需要传入一个回调函数，并立即执行该回调。在回调的同步调用期间，即使当前没有活动的组件实例，`inject()` 调用也能够从当前应用提供的值中查找注入内容。回调的返回值也会被返回。

- **示例**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

提供创建该应用时所使用的 Vue 版本。这在 [插件](/guide/reusability/plugins) 中很有用，因为你可能需要根据不同的 Vue 版本编写条件逻辑。

- **类型**

  ```ts
  interface App {
    version: string
  }
  ```

- **示例**

  在插件内部进行版本检查：

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('此插件需要 Vue 3')
      }
    }
  }
  ```

- **另请参阅** [全局 API - version](/api/general#version)

## app.config {#app-config}

每个应用实例都会暴露一个 `config` 对象，其中包含该应用的配置设置。你可以在挂载应用之前修改其属性（如下所述）。

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

为从应用内部向外传播的未捕获错误分配一个全局处理器。

- **类型**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` 是 Vue 特有的错误信息，
      // 例如错误是在什么生命周期钩子中抛出的
      info: string
    ) => void
  }
  ```

- **详情**

  错误处理器接收三个参数：错误、触发错误的组件实例，以及指定错误来源类型的信息字符串。

  它可以捕获来自以下来源的错误：

  - 组件渲染
  - 事件处理器
  - 生命周期钩子
  - `setup()` 函数
  - 侦听器
  - 自定义指令钩子
  - 过渡钩子

  :::tip
  在生产环境中，第三个参数（`info`）将会是缩短后的代码，而不是完整的信息字符串。你可以在[生产环境错误代码参考](/error-reference/#runtime-errors)中找到代码与字符串的对应关系。
  :::

- **示例**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // 处理错误，例如上报到服务端
  }
  ```

- **默认值**

  默认错误处理器会在开发环境中重新抛出错误，并在生产环境中记录错误。
  你可以使用 [throwUnhandledErrorInProduction](#app-config-throwunhandlederrorinproduction) 属性进行配置。

## app.config.warnHandler {#app-config-warnhandler}

为来自 Vue 的运行时警告分配一个自定义处理器。

- **类型**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **详情**

  警告处理器接收警告信息作为第一个参数，来源组件实例作为第二个参数，组件追踪字符串作为第三个参数。

  它可用于过滤特定警告，以减少控制台输出的冗余信息。所有 Vue 警告都应在开发期间被处理，因此这仅建议在调试过程中使用，以便从众多警告中聚焦于特定警告，并且在调试完成后应将其移除。

  :::tip
  警告只在开发环境中生效，因此此配置在生产模式下会被忽略。
  :::

- **示例**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` 是组件层级追踪信息
  }
  ```

## app.config.performance {#app-config-performance}

将其设置为 `true` 可在浏览器开发者工具的性能/时间线面板中启用组件初始化、编译、渲染和 patch 性能追踪。仅在开发模式下有效，并且只适用于支持 [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) API 的浏览器。

- **类型:** `boolean`

- **另请参阅** [指南 - 性能](/guide/best-practices/performance)

## app.config.compilerOptions {#app-config-compileroptions}

配置运行时编译器选项。设置在此对象上的值会传递给浏览器内模板编译器，并影响已配置应用中的每个组件。注意，你也可以使用 [`compilerOptions` 选项](/api/options-rendering#compileroptions)按组件单独覆盖这些选项。

::: warning 重要
此配置项仅在使用完整构建版本时才会生效（即能够在浏览器中编译模板的独立 `vue.js`）。如果你使用的是基于构建工具的仅运行时构建版本，则必须通过构建工具配置将编译器选项传递给 `@vue/compiler-dom`。

- 对于 `vue-loader`：[通过 `compilerOptions` loader 选项传递](https://vue-loader.vuejs.org/options.html#compileroptions)。另请参阅[如何在 `vue-cli` 中配置它](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)。

- 对于 `vite`：[通过 `@vitejs/plugin-vue` 选项传递](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options)。
  :::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

指定一个检查方法，用于识别原生自定义元素。

- **类型:** `(tag: string) => boolean`

- **详情**

  如果该标签应被视为原生自定义元素，则应返回 `true`。对于匹配的标签，Vue 会将其渲染为原生元素，而不是尝试将其解析为 Vue 组件。

  原生 HTML 和 SVG 标签不需要在此函数中匹配——Vue 的解析器会自动识别它们。

- **示例**

  ```js
  // 将所有以 'ion-' 开头的标签视为自定义元素
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **另请参阅** [Vue 和 Web Components](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

调整模板空白字符处理行为。

- **类型:** `'condense' | 'preserve'`

- **默认值:** `'condense'`

- **详情**

  Vue 会移除 / 压缩模板中的空白字符，以生成更高效的编译输出。默认策略为 "condense"，其行为如下：

  1. 元素内部开头 / 结尾的空白字符会被压缩为一个空格。
  2. 含有换行的元素之间的空白字符会被移除。
  3. 文本节点中的连续空白字符会被压缩为一个空格。

  将此选项设置为 `'preserve'` 将禁用第 (2) 和 (3) 项。

- **示例**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

调整模板中用于文本插值的分隔符。

- **类型:** `[string, string]`

- **默认值:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **详情**

  这通常用于避免与同样使用 mustache 语法的服务端框架发生冲突。

- **示例**

  ```js
  // 分隔符改为 ES6 模板字符串风格
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

调整模板中 HTML 注释的处理方式。

- **类型:** `boolean`

- **默认值:** `false`

- **详情**

  默认情况下，Vue 会在生产环境中移除注释。将此选项设置为 `true` 将强制 Vue 即使在生产环境中也保留注释。开发环境中始终会保留注释。此选项通常用于 Vue 与其他依赖 HTML 注释的库配合使用时。

- **示例**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

一个可用于注册全局属性的对象，这些属性可在应用内任意组件实例上访问。

- **类型**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **详情**

  这是 Vue 2 中 `Vue.prototype` 的替代品，在 Vue 3 中已不再存在。和所有全局内容一样，应谨慎使用。

  如果全局属性与组件自身属性冲突，则组件自身属性的优先级更高。

- **用法**

  ```js
  app.config.globalProperties.msg = 'hello'
  ```

  这会使 `msg` 可在应用中任意组件模板内访问，也可在任意组件实例的 `this` 上访问：

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'hello'
    }
  }
  ```

- **另请参阅** [指南 - 扩展全局属性](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

用于定义自定义组件选项合并策略的对象。

- **类型**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **详情**

  某些插件 / 库会通过注入全局混入来为自定义组件选项提供支持。这些选项在同一选项需要从多个来源（例如 mixins 或组件继承）进行“合并”时，可能需要特殊的合并逻辑。

  可以通过在 `app.config.optionMergeStrategies` 对象上以选项名称作为键来注册某个自定义选项的合并策略函数。

  合并策略函数接收分别定义在父实例和子实例上的该选项值，作为第一个和第二个参数。

- **示例**

  ```js
  const app = createApp({
    // 来自自身的选项
    msg: 'Vue',
    // 来自 mixin 的选项
    mixins: [
      {
        msg: 'Hello '
      }
    ],
    mounted() {
      // 合并后的选项会暴露在 this.$options 上
      console.log(this.$options.msg)
    }
  })

  // 为 `msg` 定义自定义合并策略
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // 输出 'Hello Vue'
  ```

- **另请参阅** [组件实例 - `$options`](/api/component-instance#options)

## app.config.idPrefix <sup class="vt-badge" data-text="3.5+" /> {#app-config-idprefix}

为此应用内通过 [useId()](/api/composition-api-helpers.html#useid) 生成的所有 ID 配置前缀。

- **类型:** `string`

- **默认值:** `undefined`

- **示例**

  ```js
  app.config.idPrefix = 'myApp'
  ```

  ```js
  // 在组件中：
  const id1 = useId() // 'myApp:0'
  const id2 = useId() // 'myApp:1'
  ```

## app.config.throwUnhandledErrorInProduction <sup class="vt-badge" data-text="3.5+" /> {#app-config-throwunhandlederrorinproduction}

强制在生产环境中抛出未处理的错误。

- **类型:** `boolean`

- **默认值:** `false`

- **详情**

  默认情况下，Vue 应用内部抛出但未被显式处理的错误，在开发模式和生产模式下的行为不同：

  - 在开发环境中，错误会被抛出，并可能导致应用崩溃。这么做是为了让错误更加醒目，以便在开发过程中被注意到并修复。

  - 在生产环境中，错误只会被记录到控制台，以尽量减少对终端用户的影响。不过，这也可能导致仅在生产环境中发生的错误无法被错误监控服务捕获。

  通过将 `app.config.throwUnhandledErrorInProduction` 设置为 `true`，即使在生产模式下也会抛出未处理的错误。
