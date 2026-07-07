# 选项：状态 {#options-state}

## data {#data}

返回组件实例初始响应式状态的函数。

- **类型**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **详细说明**

  该函数应返回一个普通的 JavaScript 对象，Vue 会将其变为响应式。实例创建后，可通过 `this.$data` 访问该响应式数据对象。组件实例还会代理数据对象上的所有属性，因此 `this.a` 将等同于 `this.$data.a`。

  所有顶层数据属性都必须包含在返回的数据对象中。可以向 `this.$data` 添加新属性，但**不**推荐这样做。如果某个属性的期望值尚不可用，则应包含一个空值（如 `undefined` 或 `null`）作为占位符，以确保 Vue 知道该属性存在。

  以 `_` 或 `$` 开头的属性**不会**在组件实例上被代理，因为它们可能与 Vue 的内部属性和 API 方法冲突。你需要通过 `this.$data._property` 来访问它们。

  **不**推荐返回带有自身状态行为的对象，例如浏览器 API 对象和原型属性。返回的对象理想情况下应是一个仅表示组件状态的普通对象。

- **示例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  注意，如果你在 `data` 属性中使用箭头函数，`this` 将不会指向组件实例，但你仍然可以通过函数的第一个参数访问实例：

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **另请参阅** [响应式原理详解](/guide/extras/reactivity-in-depth)

## props {#props}

声明组件的 props。

- **类型**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown, rawProps: object) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > 为了便于阅读，类型已做简化。

- **详细说明**

  在 Vue 中，所有组件 props 都需要显式声明。组件 props 可以用两种形式声明：

  - 使用字符串数组的简单形式
  - 使用对象的完整形式，其中每个属性键是 prop 的名称，值是 prop 的类型（构造函数）或高级选项

  使用基于对象的语法时，每个 prop 还可以进一步定义以下选项：

  - **`type`**：可以是以下原生构造函数之一：`String`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`，以及任意自定义构造函数或它们的数组。在开发模式下，Vue 会检查 prop 的值是否匹配声明的类型，如果不匹配会抛出警告。更多详情请参见 [Prop Validation](/guide/components/props#prop-validation)。

    另请注意，`Boolean` 类型的 prop 会同时影响开发环境和生产环境中的值类型转换行为。更多详情请参见 [Boolean Casting](/guide/components/props#boolean-casting)。

  - **`default`**：当父组件未传入该 prop，或其值为 `undefined` 时，为其指定默认值。对象或数组类型的默认值必须通过工厂函数返回。该工厂函数也会接收原始 props 对象作为参数。

  - **`required`**：定义该 prop 是否必需。在非生产环境中，如果该值为真且 prop 未传入，将会抛出控制台警告。

  - **`validator`**：自定义验证函数，以 prop 值和 props 对象作为参数。在开发模式下，如果该函数返回假值（即验证失败），将会抛出控制台警告。

- **示例**

  简单声明：

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  带验证的对象声明：

  ```js
  export default {
    props: {
      // 类型检查
      height: Number,
      // 类型检查加其他验证
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **另请参阅**
  - [Guide - Props](/guide/components/props)
  - [Guide - Typing Component Props](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

声明要暴露在组件实例上的计算属性。

- **类型**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance,
    previous?: T
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **详细说明**

  该选项接受一个对象，其中键为计算属性的名称，值可以是一个计算 getter，或一个包含 `get` 和 `set` 方法的对象（用于可写计算属性）。

  所有 getter 和 setter 的 `this` 上下文都会自动绑定到组件实例。

  注意，如果你在计算属性中使用箭头函数，`this` 将不会指向组件实例，但你仍然可以通过函数的第一个参数访问实例：

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **示例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // 只读
      aDouble() {
        return this.a * 2
      },
      // 可写
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **另请参阅**
  - [指南 - 计算属性](/guide/essentials/computed)
  - [指南 - 计算属性的类型声明](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

Declare methods to be mixed into the component instance.

- **Type**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **Details**

  Declared methods can be directly accessed on the component instance, and can also be used in template expressions. The `this` context of all methods is automatically bound to the component instance, even when they are passed around.

  Avoid using arrow functions when declaring methods, because they cannot access the component instance through `this`.

- **Example**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **See also** [Event Handling](/guide/essentials/event-handling)

## watch {#watch}

声明在数据变化时调用的 watch 回调。

- **类型**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // 默认值：false
    deep?: boolean // 默认值：false
    flush?: 'pre' | 'post' | 'sync' // 默认值：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > 为了便于阅读，类型已做简化。

- **详细说明**

  `watch` 选项期望接收一个对象，其中键是要监听的响应式组件实例属性（例如通过 `data` 或 `computed` 声明的属性），值是对应的回调函数。回调函数会接收被监听源的新值和旧值。

  除了根级属性外，键也可以是一个由点号分隔的简单路径，例如 `a.b.c`。请注意，这种用法**不**支持复杂表达式——只支持点号分隔的路径。如果你需要监听复杂的数据源，请改用命令式的 [`$watch()`](/api/component-instance#watch) API。

  值还可以是一个方法名字符串（通过 `methods` 声明），或者一个包含额外选项的对象。使用对象语法时，回调应在 `handler` 字段下声明。附加选项包括：

  - **`immediate`**：在 watcher 创建时立即触发回调。首次调用时旧值将为 `undefined`。
  - **`deep`**：如果源是对象或数组，则强制对其进行深度遍历，以便在深层变更时触发回调。参见 [Deep Watchers](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：调整回调的刷新时机。参见 [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) 和 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：调试 watcher 的依赖。参见 [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging)。

  声明 watch 回调时应避免使用箭头函数，因为它们无法通过 `this` 访问组件实例。

- **示例**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // 监听顶层属性
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // 字符串形式的方法名
      b: 'someMethod',
      // 无论被监听对象属性的嵌套深度如何，只要任意属性变化，回调都会被调用
      c: {
        handler(val, oldVal) {
          console.log('c changed')
        },
        deep: true
      },
      // 监听单个嵌套属性：
      'c.d': function (val, oldVal) {
        // 执行一些操作
      },
      // 回调会在观察开始后立即被调用
      e: {
        handler(val, oldVal) {
          console.log('e changed')
        },
        immediate: true
      },
      // 你可以传入回调数组，它们会依次被调用
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 triggered')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 triggered')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b changed')
      },
      handle1() {
        console.log('handle 1 triggered')
      }
    },
    created() {
      this.a = 3 // => new: 3, old: 1
    }
  }
  ```

- **另请参阅** [Watchers](/guide/essentials/watchers)

## emits {#emits}

声明组件所触发的自定义事件。

- **类型**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **详情**

  触发的事件可以用两种形式声明：

  - 使用字符串数组的简单形式
  - 使用对象的完整形式，其中每个属性键是事件名，值要么是 `null`，要么是一个验证函数。

  验证函数会接收传递给组件 `$emit` 调用的额外参数。例如，如果调用了 `this.$emit('foo', 1)`，那么 `foo` 对应的验证器将接收参数 `1`。验证函数应返回一个布尔值，用于表示事件参数是否有效。

  请注意，`emits` 选项影响的是哪些事件监听器会被视为组件事件监听器，而不是原生 DOM 事件监听器。已声明事件的监听器会从组件的 `$attrs` 对象中移除，因此不会透传到组件的根元素。更多细节请参见 [透传 Attributes](/guide/components/attrs)。

- **示例**

  数组语法：

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  对象语法：

  ```js
  export default {
    emits: {
      // 无需校验
      click: null,

      // 带校验
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`无效的 submit 事件负载！`)
          return false
        }
      }
    }
  }
  ```

- **另请参阅**
  - [指南 - 透传 Attributes](/guide/components/attrs)
  - [指南 - 为组件 emits 添加类型](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

Declares the public properties to be exposed when the component instance is accessed by the parent via template refs.

- **类型**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **详情**

  By default, when a component instance is accessed through `$parent`, `$root`, or a template ref, the component exposes all instance properties to the parent. This may not be ideal, because components often include internal state or methods that should remain private to avoid excessive coupling.

  The `expose` option accepts a list of property name strings. When `expose` is used, only the explicitly listed properties are exposed on the component's public instance.

  `expose` only affects user-defined properties—it does not filter out built-in component instance properties.

- **示例**

  ```js
  export default {
    // Only `publicMethod` will be available on the public instance
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```
