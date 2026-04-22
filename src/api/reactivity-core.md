# 响应性 API：核心 {#reactivity-api-core}

:::info 另请参阅
为了更好地理解响应性 API，建议阅读指南中的以下章节：

- [响应性基础](/guide/essentials/reactivity-fundamentals)（将 API 偏好设置为 Composition API）
- [深入响应性机制](/guide/extras/reactivity-in-depth)
  :::

## ref() {#ref}

接收一个内部值并返回一个响应式且可变的 ref 对象，该对象只有一个属性 `.value`，指向内部值。

- **类型**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **详细信息**

  ref 对象是可变的——也就是说，你可以为 `.value` 赋予新值。它也是响应式的——也就是说，对 `.value` 的任何读取操作都会被追踪，而写入操作会触发相关副作用。

  如果将对象赋值为 ref 的值，该对象会通过 [reactive()](#reactive) 变为深层响应式。这也意味着，如果对象中包含嵌套的 ref，它们会被深度解包。

  如需避免深层转换，请改用 [`shallowRef()`](./reactivity-advanced#shallowref)。

- **示例**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **另请参阅**
  - [指南 - 使用 `ref()` 的响应性基础](/guide/essentials/reactivity-fundamentals#ref)
  - [指南 - `ref()` 的类型标注](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## computed() {#computed}

接收一个 [getter 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)，并返回一个只读的响应式 [ref](#ref) 对象，其值来自 getter 的返回值。它也可以接收一个带有 `get` 和 `set` 函数的对象，以创建一个可写的 ref 对象。

- **类型**

  ```ts
  // 只读
  function computed<T>(
    getter: (oldValue: T | undefined) => T,
    // 参见下面的“Computed 调试”链接
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // 可写
  function computed<T>(
    options: {
      get: (oldValue: T | undefined) => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **示例**

  创建一个只读 computed ref：

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // error
  ```

  创建一个可写的 computed ref：

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  调试：

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **另请参阅**
  - [指南 - 计算属性](/guide/essentials/computed)
  - [指南 - Computed 调试](/guide/extras/reactivity-in-depth#computed-debugging)
  - [指南 - `computed()` 的类型标注](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />
  - [指南 - 性能 - Computed 稳定性](/guide/best-practices/performance#computed-stability)

## reactive() {#reactive}

返回该对象的响应式代理。

- **类型**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **详细信息**

  响应式转换是“深层”的：它会影响所有嵌套属性。响应式对象也会深度解包任何作为 [ref](#ref) 的属性，同时保持响应性。

  还需要注意的是，当 ref 作为响应式数组的元素或像 `Map` 这样的原生集合类型的元素被访问时，不会进行 ref 解包。

  如需避免深层转换并仅保留根级别的响应性，请改用 [shallowReactive()](./reactivity-advanced#shallowreactive)。

  返回的对象及其嵌套对象都会被 [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 包装，并且**不**等于原始对象。建议始终只使用响应式代理对象，避免依赖原始对象。

- **示例**

  创建一个响应式对象：

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  ref 解包：

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref 将被解包
  console.log(obj.count === count.value) // true

  // 它会更新 `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // 它也会更新 `count` ref
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

  注意，当 refs 作为数组或集合元素被访问时，**不会**被解包：

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // 这里需要 .value
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // 这里需要 .value
  console.log(map.get('count').value)
  ```

  将 [ref](#ref) 赋值给 `reactive` 属性时，该 ref 也会被自动解包：

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **另请参阅**
  - [指南 - 响应性基础](/guide/essentials/reactivity-fundamentals)
  - [指南 - `reactive()` 的类型标注](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

接收一个对象（响应式或普通对象）或一个 [ref](#ref)，并返回其原始值的只读代理。

- **类型**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **详细信息**

  只读代理是深层的：访问到的任何嵌套属性也都会是只读的。它还具有与 `reactive()` 相同的 ref 解包行为，不同的是，解包后的值也会被设为只读。

  如需避免深层转换，请改用 [shallowReadonly()](./reactivity-advanced#shallowreadonly)。

- **示例**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // 用于响应性追踪
    console.log(copy.count)
  })

  // 修改原对象会触发依赖于副本的侦听器
  original.count++

  // 修改副本会失败并产生警告
  copy.count++ // 警告！
  ```

## watchEffect() {#watcheffect}

立即运行一个函数，同时响应式地追踪其依赖，并在依赖变更时重新执行。

- **类型**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): WatchHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  interface WatchHandle {
    (): void // 可调用，与 `stop` 相同
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **详细信息**

  第一个参数是要运行的副作用函数。该副作用函数会接收一个函数，用于注册清理回调。清理回调会在副作用下一次重新运行之前立即调用，可用于清理失效的副作用，例如尚未完成的异步请求（见下方示例）。

  第二个参数是可选的选项对象，可用于调整副作用的刷新时机或调试副作用的依赖。

  默认情况下，侦听器会在组件渲染之前执行。将 `flush: 'post'` 可将侦听器延迟到组件渲染之后执行。更多信息请参见 [回调刷新时机](/guide/essentials/watchers#callback-flush-timing)。在少数情况下，可能需要在响应式依赖变化时立即触发侦听器，例如使缓存失效。这可以通过 `flush: 'sync'` 实现。不过，应谨慎使用此设置，因为当多个属性同时更新时，它可能会导致性能和数据一致性问题。

  返回值是一个句柄函数，可以调用它来停止该副作用再次运行。

- **示例**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> 打印 0

  count.value++
  // -> 打印 1
  ```

  停止侦听器：

  ```js
  const stop = watchEffect(() => {})

  // 当不再需要该侦听器时：
  stop()
  ```

  暂停 / 恢复侦听器：<sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watchEffect(() => {})

  // 暂时暂停侦听器
  pause()

  // 稍后恢复
  resume()

  // 停止
  stop()
  ```

  副作用清理：

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // 当 `id` 变化时会调用 `cancel`，如果之前的请求尚未完成，
    // 就会取消它
    onCleanup(cancel)
    data.value = await response
  })
  ```

  3.5+ 中的副作用清理：

  ```js
  import { onWatcherCleanup } from 'vue'

  watchEffect(async () => {
    const { response, cancel } = doAsyncWork(newId)
    // 当 `id` 变化时会调用 `cancel`，如果之前的请求尚未完成，
    // 就会取消它
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

  选项：

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **另请参阅**
  - [指南 - 侦听器](/guide/essentials/watchers#watcheffect)
  - [指南 - 侦听器调试](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

[`watchEffect()`](#watcheffect) 的别名，使用 `flush: 'post'` 选项。

## watchSyncEffect() {#watchsynceffect}

[`watchEffect()`](#watcheffect) 的别名，使用 `flush: 'sync'` 选项。

## watch() {#watch}

监听一个或多个响应式数据源，并在这些源发生变化时调用回调函数。

- **类型**

  ```ts
  // 监听单个源
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): WatchHandle

  // 监听多个源
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): WatchHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | (T extends object ? T : never) // 响应式对象

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // 默认：false
    deep?: boolean | number // 默认：false
    flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // 默认：false（3.4+）
  }

  interface WatchHandle {
    (): void // 可调用，与 `stop` 相同
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

  > 为了便于阅读，这里的类型已做简化。

- **细节**

  `watch()` 默认是惰性的——也就是说，只有当被监听的源发生变化时，回调才会被调用。

  第一个参数是监听器的**源**。源可以是以下之一：

  - 返回值的 getter 函数
  - 一个 ref
  - 一个响应式对象
  - ……或者以上类型组成的数组。

  第二个参数是当源发生变化时会被调用的回调函数。该回调接收三个参数：新值、旧值，以及一个用于注册副作用清理回调的函数。清理回调会在效果下一次重新执行之前立即调用，可用于清理失效的副作用，例如尚未完成的异步请求。

  当监听多个源时，回调会接收两个数组，分别包含与源数组对应的新值 / 旧值。

  第三个可选参数是一个选项对象，支持以下选项：

  - **`immediate`**：在监听器创建时立即触发回调。第一次调用时旧值为 `undefined`。
  - **`deep`**：如果源是对象，则强制对源进行深层遍历，以便在深层变更时触发回调。在 3.5+ 中，这也可以是一个数字，表示最大遍历深度。参见 [深层监听器](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：调整回调的刷新时机。参见 [回调刷新时机](/guide/essentials/watchers#callback-flush-timing) 和 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：调试监听器的依赖。参见 [监听器调试](/guide/extras/reactivity-in-depth#watcher-debugging)。
  - **`once`**：（3.4+）仅运行一次回调。第一次回调执行后，监听器会自动停止。

  与 [`watchEffect()`](#watcheffect) 相比，`watch()` 允许我们：

  - 惰性地执行副作用；
  - 更明确地指定哪些状态变化应该触发监听器重新执行；
  - 同时访问被监听状态的前一个值和当前值。

- **示例**

  监听 getter：

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  监听 ref：

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  当监听多个源时，回调会接收包含与源数组对应的新值 / 旧值的数组：

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  当使用 getter 作为源时，只有当 getter 的返回值发生变化时，监听器才会触发。如果你希望即使在深层变更时也触发回调，需要显式使用 `{ deep: true }` 将监听器强制设为深层模式。注意在深层模式下，如果回调是由深层变更触发的，新值和旧值将是同一个对象：

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  直接监听响应式对象时，监听器会自动处于深层模式：

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* 对 state 的深层变更会触发 */
  })
  ```

  `watch()` 与 [`watchEffect()`](#watcheffect) 共享相同的刷新时机和调试选项：

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  停止监听器：

  ```js
  const stop = watch(source, callback)

  // 当不再需要该监听器时：
  stop()
  ```

  暂停 / 恢复监听器： <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watch(() => {})

  // 临时暂停监听器
  pause()

  // 稍后恢复
  resume()

  // 停止
  stop()
  ```

  副作用清理：

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // 如果 `id` 发生变化，`cancel` 将被调用，从而取消
    // 尚未完成的上一个请求
    onCleanup(cancel)
    data.value = await response
  })
  ```

  3.5+ 中的副作用清理：

  ```js
  import { onWatcherCleanup } from 'vue'

  watch(id, async (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

- **另请参见**

  - [指南 - 监听器](/guide/essentials/watchers)
  - [指南 - 监听器调试](/guide/extras/reactivity-in-depth#watcher-debugging)

## onWatcherCleanup() <sup class="vt-badge" data-text="3.5+" /> {#onwatchercleanup}

注册一个清理函数，在当前监听器即将重新执行时调用。只能在 `watchEffect` 的 effect 函数或 `watch` 的回调函数同步执行期间调用（也就是说，它不能在异步函数中的 `await` 语句之后调用。）

- **类型**

  ```ts
  function onWatcherCleanup(
    cleanupFn: () => void,
    failSilently?: boolean
  ): void
  ```

- **示例**

  ```ts
  import { watch, onWatcherCleanup } from 'vue'

  watch(id, (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    // 如果 `id` 发生变化，`cancel` 将被调用，从而取消
    // 尚未完成的上一个请求
    onWatcherCleanup(cancel)
  })
  ```
