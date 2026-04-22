# 组件实例 {#component-instance}

:::info
本页记录了组件公共实例上暴露的内置属性和方法，也就是 `this`。

本页列出的所有属性都是只读的（`$data` 中的嵌套属性除外）。
:::

## $data {#data}

由 [`data`](./options-state#data) 选项返回的对象，经过组件处理后变为响应式。组件实例会代理对其 data 对象属性的访问。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

表示组件当前已解析 props 的对象。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **详细信息**

  只会包含通过 [`props`](./options-state#props) 选项声明的 props。组件实例会代理对其 props 对象属性的访问。

## $el {#el}

组件实例正在管理的根 DOM 节点。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $el: any
  }
  ```

- **详细信息**

  在组件被 [挂载](./options-lifecycle#mounted) 之前，`$el` 将是 `undefined`。

  - 对于只有单个根元素的组件，`$el` 将指向该元素。
  - 对于文本根节点的组件，`$el` 将指向该文本节点。
  - 对于具有多个根节点的组件，`$el` 将是 Vue 用来跟踪组件在 DOM 中位置的占位 DOM 节点（一个文本节点，或者在 SSR hydration 模式下是一个注释节点）。

  :::tip
  为保持一致性，建议使用[模板引用](/guide/essentials/template-refs)直接访问元素，而不要依赖 `$el`。
  :::

## $options {#options}

用于实例化当前组件实例的已解析组件选项。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **详细信息**

  `$options` 对象暴露了当前组件的已解析选项，它是以下可能来源的合并结果：

  - 全局混入
  - 组件 `extends` 基础选项
  - 组件混入

  它通常用于支持自定义组件选项：

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **另请参阅** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

父实例，如果当前实例有父实例的话。根实例本身则为 `null`。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

当前组件树的根组件实例。如果当前实例没有父级，则此值就是它自身。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

表示父组件传递的[插槽](/guide/components/slots)的对象。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **详细信息**

  通常在手动编写[渲染函数](/guide/extras/render-function)时使用，但也可用于检测某个插槽是否存在。

  每个插槽都会在 `this.$slots` 上以一个函数形式暴露，该函数会返回对应插槽名称键下的 vnode 数组。默认插槽会以 `this.$slots.default` 暴露。

  如果某个插槽是[作用域插槽](/guide/components/slots#scoped-slots)，传递给插槽函数的参数会作为该插槽的 slot props 提供给插槽。

- **另请参阅** [渲染函数 - 渲染插槽](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

通过[模板引用](/guide/essentials/template-refs)注册的 DOM 元素和组件实例对象。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **另请参阅**

  - [模板引用](/guide/essentials/template-refs)
  - [特殊 Attribute - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

包含组件透传 attribute 的对象。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **详细信息**

  [透传 Attribute](/guide/components/attrs) 是由父组件传递的 attribute 和事件监听器，但没有被子组件声明为 prop 或已发出的事件。

  默认情况下，如果只有单个根元素，`$attrs` 中的所有内容都会自动继承到组件的根元素上。如果组件有多个根节点，此行为会被禁用，也可以通过 [`inheritAttrs`](./options-misc#inheritattrs) 选项显式禁用。

- **另请参阅**

  - [透传 Attribute](/guide/components/attrs)

## $watch() {#watch}

用于创建侦听器的命令式 API。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // 默认：false
    deep?: boolean // 默认：false
    flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **详细信息**

  第一个参数是侦听源。它可以是组件属性名字符串、简单的点分隔路径字符串，或者一个[getter 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)。

  第二个参数是回调函数。该回调会接收被侦听源的新值和旧值。

  - **`immediate`**：在侦听器创建时立即触发回调。第一次调用时旧值将为 `undefined`。
  - **`deep`**：如果源是对象，则强制对其进行深层遍历，以便在深层变化时触发回调。参见[深层侦听器](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：调整回调的刷新时机。参见[回调刷新时机](/guide/essentials/watchers#callback-flush-timing) 和 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：调试侦听器的依赖。参见[侦听器调试](/guide/extras/reactivity-in-depth#watcher-debugging)。

- **示例**

  侦听属性名：

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  侦听点分隔路径：

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  对于更复杂的表达式，使用 getter：

  ```js
  this.$watch(
    // 每当表达式 `this.a + this.b`
    // 得到不同结果时，处理函数就会被调用。
    // 这就像我们在侦听一个计算属性，
    // 但并没有定义这个计算属性本身。
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  停止侦听器：

  ```js
  const unwatch = this.$watch('a', cb)

  // 稍后...
  unwatch()
  ```

- **另请参阅**
  - [选项 - `watch`](/api/options-state#watch)
  - [指南 - 侦听器](/guide/essentials/watchers)

## $emit() {#emit}

在当前实例上触发一个自定义事件。任何额外参数都会传入监听器的回调函数中。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **示例**

  ```js
  export default {
    created() {
      // 仅事件
      this.$emit('foo')
      // 带额外参数
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **另请参阅**

  - [组件 - 事件](/guide/components/events)
  - [`emits` 选项](./options-state#emits)

## $forceUpdate() {#forceupdate}

强制组件实例重新渲染。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **详细信息**

  鉴于 Vue 完全自动化的响应式系统，通常很少需要这样做。只有在你使用高级响应式 API 显式创建了非响应式的组件状态时，才可能需要它。

## $nextTick() {#nexttick}

绑定到实例的全局 [`nextTick()`](./general#nexttick) 版本。

- **类型**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **详细信息**

  与全局版本的 `nextTick()` 唯一的区别在于，传递给 `this.$nextTick()` 的回调，其 `this` 上下文会绑定到当前组件实例。

- **另请参阅** [`nextTick()`](./general#nexttick)
