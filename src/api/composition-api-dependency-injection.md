# 组合式 API：<br>依赖注入 {#composition-api-dependency-injection}

## provide() {#provide}

提供一个值，后代组件可以注入该值。

- **类型**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **详情**

  `provide()` 接受两个参数：键，可以是字符串或符号，以及要注入的值。

  在使用 TypeScript 时，键可以是强制转换为 `InjectionKey` 的符号——这是 Vue 提供的一个工具类型，扩展自 `Symbol`，可用于在 `provide()` 和 `inject()` 之间同步值的类型。

  与生命周期钩子注册 API 类似，`provide()` 必须在组件的 `setup()` 阶段同步调用。

- **示例**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // 提供静态值
  provide('path', '/project/')

  // 提供响应式值
  const count = ref(0)
  provide('count', count)

  // 使用 Symbol 键提供
  provide(countSymbol, count)
  </script>
  ```

- **另请参阅**
  - [指南 - 提供 / 注入](/guide/components/provide-inject)
  - [指南 - 类型化提供 / 注入](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

注入由祖先组件或应用（通过 `app.provide()`）提供的值。

- **类型**

  ```ts
  // 没有默认值
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // 有默认值
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // 使用工厂函数
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **详情**

  第一个参数是注入键。Vue 会沿着父级链向上查找具有匹配键的已提供值。如果父级链中的多个组件提供了相同的键，那么距离注入组件最近的那个会“覆盖”链上更高层的提供值，并使用它的值。如果没有找到匹配键的值，`inject()` 将返回 `undefined`，除非提供了默认值。

  第二个参数是可选的，是在未找到匹配值时使用的默认值。

  第二个参数也可以是一个工厂函数，用于返回创建成本较高的值。在这种情况下，必须将 `true` 作为第三个参数传入，以表明该函数应作为工厂而不是值本身来使用。

  与生命周期钩子注册 API 类似，`inject()` 必须在组件的 `setup()` 阶段同步调用。

  在使用 TypeScript 时，键可以是 `InjectionKey` 类型——这是 Vue 提供的一个工具类型，扩展自 `Symbol`，可用于在 `provide()` 和 `inject()` 之间同步值的类型。

- **示例**

  假设父组件已按前面的 `provide()` 示例提供了值：

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // 注入没有默认值的静态值
  const path = inject('path')

  // 注入响应式值
  const count = inject('count')

  // 使用 Symbol 键注入
  const count2 = inject(countSymbol)

  // 注入带默认值
  const bar = inject('path', '/default-path')

  // 注入函数默认值
  const fn = inject('function', () => {})

  // 注入默认值工厂
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```
  
- **另请参阅**
  - [指南 - 提供 / 注入](/guide/components/provide-inject)
  - [指南 - 类型化提供 / 注入](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## hasInjectionContext() {#has-injection-context}

- 仅支持 3.3+

如果 [inject()](#inject) 可以在不提示“调用位置错误”（例如在 `setup()` 外部）警告的情况下使用，则返回 true。此方法专为希望在内部使用 `inject()` 但又不向最终用户触发警告的库而设计。

- **类型**

  ```ts
  function hasInjectionContext(): boolean
  ```
