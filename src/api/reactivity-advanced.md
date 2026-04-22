# 响应式 API：进阶 {#reactivity-api-advanced}

## shallowRef() {#shallowref}

[`ref()`](./reactivity-core#ref) 的浅层版本。

- **类型**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **详细信息**

  与 `ref()` 不同，浅层 ref 的内部值会按原样存储和暴露，不会被深层响应式化。只有 `.value` 的访问是响应式的。

  `shallowRef()` 通常用于大型数据结构的性能优化，或与外部状态管理系统集成。

- **示例**

  ```js
  const state = shallowRef({ count: 1 })

  // 不会触发变更
  state.value.count = 2

  // 会触发变更
  state.value = { count: 2 }
  ```

- **另请参阅**
  - [指南 - 为大型不可变结构降低响应式开销](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
  - [指南 - 与外部状态系统集成](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## triggerRef() {#triggerref}

强制触发依赖于 [shallow ref](#shallowref) 的副作用。通常用于对浅层 ref 的内部值进行深层修改之后。

- **类型**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **示例**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // 第一次运行时输出一次 "Hello, world"
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // 由于 ref 是浅层的，这不会触发该副作用
  shallow.value.greet = 'Hello, universe'

  // 输出 "Hello, universe"
  triggerRef(shallow)
  ```

## customRef() {#customref}

创建一个自定义 ref，可以显式控制其依赖跟踪和更新触发。

- **类型**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **详细信息**

  `customRef()` 期望传入一个工厂函数，该函数接收 `track` 和 `trigger` 作为参数，并应返回一个包含 `get` 和 `set` 方法的对象。

  一般来说，`track()` 应在 `get()` 内调用，`trigger()` 应在 `set()` 内调用。不过，你可以完全控制它们何时调用，或者是否调用。

- **示例**

  创建一个防抖 ref，仅在最近一次 set 调用之后经过某个超时时间后才更新值：

  ```js
  import { customRef } from 'vue'

  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  在组件中使用：

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [在 Playground 中试试](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

  :::warning 谨慎使用
  使用 customRef 时，我们应当谨慎对待其 getter 的返回值，尤其是在 getter 每次运行时都会生成新的对象类型时。这会影响父组件和子组件之间的关系，尤其是当这样的 customRef 作为 prop 传入时。

  父组件的渲染函数可能会因其他响应式状态的变化而被触发。在重新渲染期间，我们的 customRef 的值会被重新求值，并作为 prop 向子组件返回一个新的对象类型。这个 prop 会与子组件中上一次的值进行比较，而由于它们不同，customRef 的响应式依赖会在子组件中被触发。与此同时，父组件中的响应式依赖不会运行，因为 customRef 的 setter 没有被调用，因此它们的依赖也不会被触发。

  [在 Playground 中查看](https://play.vuejs.org/#eNqFVEtP3DAQ/itTS9Vm1ZCt1J6WBZUiDvTQIsoNcwiOkzU4tmU7+9Aq/71jO1mCWuhlN/PyfPP45kAujCk2HSdLsnLMCuPBcd+Zc6pEa7T1cADWOa/bW17nYMPPtvRsDT3UVrcww+DZ0flStybpKSkWQQqPU0IVVUwr58FYvdvDWXgpu6ek1pqSHL0fS0vJw/z0xbN1jUPHY/Ys87Zkzzl4K5qG2zmcnUN2oAqg4T6bQ/wENKNXNk+CxWKsSlmLTSk7XlhedYxnWclYDiK+MkQCoK4wnVtnIiBJuuEJNA2qPof7hzkEoc8DXgg9yzYTBBFgNr4xyY4FbaK2p6qfI0iqFgtgulOe27HyQRy69Dk1JXY9C03JIeQ6wg4xWvJCqFpnlNytOcyC2wzYulQNr0Ao+Mhw0KnTTEttl/CIaIJiMz8NGBHFtYetVrPwa58/IL48Zag4N0ssquNYLYBoW16J0vOkC3VQtVqk7cG9QcHz1kj0QAlgVYkNMFk6d0bJ1pbGYKUkmtD42HmvFfi94WhOEiXwjUnBnlEz9OLTJwy5qCo44D4O7en71SIFjI/F9VuG4jEy/GHQKq5hQrJAKOc4uNVighBF5/cygS0GgOMoK+HQb7+EWvLdMM7weVIJy5kXWi0Rj+xaNRhLKRp1IvB9hxYegA6WJ1xkUe9PcF4e9a+suA3YwYiC5MQ79KlFUzw5rZCZEUtoRWuE5PaXCXmxtuWIkpJSSr39EXXHQcWYNWfP/9A/uV3QUXJjueN2E1ZhtPnSIqGS+er3T77D76Ox1VUn0fsd4y3HfewCxuT2vVMVwp74RbTX8WQI1dy5qx12xI1Fpa1K5AreeEHCCN8q/QXul+LrSC3s4nh93jltkVPDIYt5KJkcIKStCReo4rVQ/CZI6dyEzToCCJu7hAtry/1QH/qXncQB400KJwqPxZHxEyona0xS/E3rt1m9Ld1rZl+uhaxecRtP3EjtgddCyimtXyj9H/Ii3eId7uOGTkyk/wOEbQ9h)

  :::

## shallowReactive() {#shallowreactive}

[`reactive()`](./reactivity-core#reactive) 的浅层版本。

- **类型**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **详细信息**

  与 `reactive()` 不同，不会进行深层转换：浅层响应式对象只有根级别的属性是响应式的。属性值会按原样存储和暴露——这也意味着具有 ref 值的属性不会被自动解包。

  :::warning 谨慎使用
  浅层数据结构应只用于组件的根级状态。避免将其嵌套在深层响应式对象中，因为这会创建一个响应式行为不一致的树，可能很难理解和调试。
  :::

- **示例**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // 修改 state 自身的属性是响应式的
  state.foo++

  // ...但不会转换嵌套对象
  isReactive(state.nested) // false

  // 不响应式
  state.nested.bar++
  ```

## shallowReadonly() {#shallowreadonly}

[`readonly()`](./reactivity-core#readonly) 的浅层版本。

- **类型**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **详细信息**

  与 `readonly()` 不同，不会进行深层转换：只有根级别的属性会被设为只读。属性值会按原样存储和暴露——这也意味着具有 ref 值的属性不会被自动解包。

  :::warning 谨慎使用
  浅层数据结构应只用于组件的根级状态。避免将其嵌套在深层响应式对象中，因为这会创建一个响应式行为不一致的树，可能很难理解和调试。
  :::

- **示例**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // 修改 state 自身的属性会失败
  state.foo++

  // ...但对嵌套对象有效
  isReadonly(state.nested) // false

  // 可用
  state.nested.bar++
  ```

## toRaw() {#toraw}

返回 Vue 创建的代理对象的原始对象。

- **类型**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **详细信息**

  `toRaw()` 可以返回由 [`reactive()`](./reactivity-core#reactive)、[`readonly()`](./reactivity-core#readonly)、[`shallowReactive()`](#shallowreactive) 或 [`shallowReadonly()`](#shallowreadonly) 创建的代理对象对应的原始对象。

  这是一种逃生通道，可用于临时读取而不产生代理访问 / 跟踪开销，或在写入时不触发变更。不建议长期持有原始对象的引用。请谨慎使用。

- **示例**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

标记一个对象，使其永远不会被转换为代理对象。返回对象本身。

- **类型**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **示例**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // 嵌套在其他响应式对象中时也同样有效
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning 谨慎使用
  `markRaw()` 和诸如 `shallowReactive()` 之类的浅层 API，允许你有选择地跳过默认的深层响应式 / 只读转换，并在你的状态图中嵌入原始的、未被代理的对象。它们可用于多种场景：

  - 有些值本身就不应该被设为响应式，例如复杂的第三方类实例，或 Vue 组件对象。

  - 跳过代理转换可以在渲染具有不可变数据源的大型列表时提升性能。

  它们之所以被视为进阶用法，是因为原始对象的排除只发生在根级别，所以如果你把一个嵌套的、未被标记为原始的对象放入响应式对象中，然后再次访问它，你得到的会是代理后的版本。这可能导致 **身份危害** —— 即执行依赖对象身份的操作，却同时使用同一个对象的原始版本和代理版本：

  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // 尽管 `foo` 被标记为原始对象，foo.nested 不是。
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  身份危害通常并不常见。不过，要正确使用这些 API，同时安全地避免身份危害，需要对响应式系统的工作原理有扎实的理解。

  :::

## effectScope() {#effectscope}

创建一个 effect scope 对象，它可以捕获在其中创建的响应式效果（即 computed 和 watchers），从而可以将这些效果一起释放。有关此 API 的详细使用场景，请参阅其对应的 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)。

- **类型**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // 如果 scope 处于非激活状态，则返回 undefined
    stop(): void
  }
  ```

- **示例**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('计数：', doubled.value))
  })

  // 用于释放 scope 中的所有效果
  scope.stop()
  ```

## getCurrentScope() {#getcurrentscope}

如果存在当前激活的 [effect scope](#effectscope)，则返回它。

- **类型**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose() {#onscopedispose}

在当前激活的 [effect scope](#effectscope) 上注册一个释放回调。该回调会在关联的 effect scope 被停止时调用。

在可复用的组合式函数中，这个方法可以作为不与组件绑定的 `onUnmounted` 替代方案，因为每个 Vue 组件的 `setup()` 函数本身也是在一个 effect scope 中调用的。

如果在没有激活的 effect scope 时调用此函数，将抛出警告。在 3.5+ 中，可以通过将第二个参数传入 `true` 来抑制此警告。

- **类型**

  ```ts
  function onScopeDispose(fn: () => void, failSilently?: boolean): void
  ```
