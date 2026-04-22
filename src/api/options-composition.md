# 选项：组合式 {#options-composition}

## provide {#provide}

提供可由后代组件注入的值。

- **类型**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **详细信息**

  `provide` 和 [`inject`](#inject) 一起使用，允许祖先组件作为其所有后代的依赖注入器，而不管组件层级有多深，只要它们处于同一父链中即可。

  `provide` 选项应为一个对象，或者返回对象的函数。这个对象包含可供其后代注入的属性。你可以在这个对象中使用 Symbols 作为键。

- **示例**

  基本用法：

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  使用函数为每个组件提供状态：

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  注意，在上面的示例中，提供的 `msg` **不会**是响应式的。更多细节请参见[处理响应式](/guide/components/provide-inject#working-with-reactivity)。

- **另请参见** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

声明要通过从祖先提供者中查找而注入到当前组件的属性。

- **类型**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **详细信息**

  `inject` 选项应为以下两种形式之一：

  - 字符串数组，或
  - 一个对象，其中键是本地绑定名，值则是以下之一：
    - 用于在可用注入中查找的键（字符串或 Symbol），或
    - 一个对象，其中：
      - `from` 属性是用于在可用注入中查找的键（字符串或 Symbol），并且
      - `default` 属性用作回退值。与 props 默认值类似，对于对象类型需要使用工厂函数，以避免多个组件实例之间共享值。

  如果既没有提供匹配的属性，也没有提供默认值，那么注入的属性将是 `undefined`。

  请注意，注入的绑定**不是**响应式的。这是有意为之。不过，如果注入的值是一个响应式对象，那么该对象上的属性仍然会保持响应式。更多细节请参见[处理响应式](/guide/components/provide-inject#working-with-reactivity)。

- **示例**

  基本用法：

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  将注入的值作为 prop 的默认值：

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  将注入的值作为 data 项：

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  注入可以带有默认值，从而成为可选项：

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  如果需要从一个不同名称的属性中注入，请使用 `from` 来表示源属性：

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  与 prop 默认值类似，对于非原始值，你需要使用工厂函数：

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **另请参见** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

要混入当前组件的一个选项对象数组。

- **类型**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **详细信息**

  `mixins` 选项接受一个 mixin 对象数组。这些 mixin 对象可以像普通实例对象一样包含实例选项，并且它们会通过特定的选项合并逻辑与最终选项进行合并。例如，如果你的 mixin 包含一个 `created` 钩子，而组件本身也有一个，那么这两个函数都会被调用。

  mixin 钩子会按照提供的顺序调用，并且在组件自身的钩子之前调用。

  :::warning 不再推荐
  在 Vue 2 中，mixin 是创建可复用组件逻辑块的主要机制。虽然 Vue 3 仍然支持 mixin，但现在在组件之间复用代码时，[使用 Composition API 的组合式函数](/guide/reusability/composables)是更推荐的方法。
  :::

- **示例**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

一个要继承的“基类”组件。

- **类型**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **详细信息**

  允许一个组件扩展另一个组件，并继承其组件选项。

  从实现角度看，`extends` 几乎与 `mixins` 完全相同。由 `extends` 指定的组件会被视为第一个 mixin。

  不过，`extends` 和 `mixins` 表达的意图不同。`mixins` 选项主要用于组合功能块，而 `extends` 主要关注继承。

  与 `mixins` 一样，任何选项（`setup()` 除外）都会使用相应的合并策略进行合并。

- **示例**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning 不建议在 Composition API 中使用
  `extends` 是为 Options API 设计的，并不处理 `setup()` 钩子的合并。

  在 Composition API 中，更推荐的逻辑复用思维模型是“组合”而不是“继承”。如果你有某个组件中的逻辑需要在另一个组件中复用，可以考虑将相关逻辑提取到一个[组合式函数](/guide/reusability/composables#composables)中。

  如果你仍然打算使用 Composition API 来“扩展”某个组件，可以在扩展组件的 `setup()` 中调用基组件的 `setup()`：

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // 本地绑定
      }
    }
  }
  ```
  :::
