# Composition API：生命周期钩子 {#composition-api-lifecycle-hooks}

:::info 使用说明
本页列出的所有 API 都必须在组件的 `setup()` 阶段同步调用。更多详情请参见 [指南 - 生命周期钩子](/guide/essentials/lifecycle)。
:::

## onMounted() {#onmounted}

注册一个回调，在组件挂载完成后调用。

- **类型**

  ```ts
  function onMounted(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **详情**

  组件在以下条件都满足后被视为已挂载：

  - 其所有同步子组件都已挂载（不包括异步组件或 `<Suspense>` 树中的组件）。

  - 其自身的 DOM 树已创建并插入父容器。请注意，只有当应用的根容器也在文档中时，才能保证组件的 DOM 树位于文档中。

  这个钩子通常用于执行需要访问组件渲染后 DOM 的副作用，或在 [服务端渲染应用](/guide/scaling-up/ssr) 中将 DOM 相关代码限制在客户端执行。

  **此钩子不会在服务端渲染期间调用。**

- **示例**

  通过模板 ref 访问元素：

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated() {#onupdated}

注册一个回调，在组件因响应式状态变更而更新其 DOM 树后调用。

- **类型**

  ```ts
  function onUpdated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **详情**

  父组件的 updated 钩子会在其子组件之后调用。

  这个钩子会在组件的任何 DOM 更新后调用，这些更新可能由不同的状态变化引起，因为出于性能考虑，多个状态变化可能会被批量处理到单个渲染周期中。如果你需要在特定状态变化后访问更新后的 DOM，请改用 [nextTick()](/api/general#nexttick)。

  **此钩子不会在服务端渲染期间调用。**

  :::warning
  不要在 updated 钩子中修改组件状态——这很可能导致无限更新循环！
  :::

- **示例**

  访问更新后的 DOM：

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // 文本内容应与当前 `count.value` 相同
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted() {#onunmounted}

注册一个回调，在组件卸载完成后调用。

- **类型**

  ```ts
  function onUnmounted(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **详情**

  组件在以下条件都满足后被视为已卸载：

  - 其所有子组件都已卸载。

  - 其所有关联的响应式副作用（渲染副作用以及在 `setup()` 中创建的 computed / watcher）都已停止。

  使用这个钩子来清理手动创建的副作用，例如定时器、DOM 事件监听器或服务器连接。

  **此钩子不会在服务端渲染期间调用。**

- **示例**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount() {#onbeforemount}

注册一个钩子，在组件即将挂载之前调用。

- **类型**

  ```ts
  function onBeforeMount(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **详情**

  当这个钩子被调用时，组件已经完成了响应式状态的设置，但还没有创建任何 DOM 节点。它即将第一次执行其 DOM 渲染副作用。

  **此钩子不会在服务端渲染期间调用。**

## onBeforeUpdate() {#onbeforeupdate}

注册一个钩子，在组件即将因响应式状态变更而更新其 DOM 树之前调用。

- **类型**

  ```ts
  function onBeforeUpdate(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **详情**

  这个钩子可用于在 Vue 更新 DOM 之前访问 DOM 状态。在此钩子中修改组件状态也是安全的。

  **此钩子不会在服务端渲染期间调用。**

## onBeforeUnmount() {#onbeforeunmount}

注册一个钩子，在组件实例即将卸载之前调用。

- **类型**

  ```ts
  function onBeforeUnmount(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **详情**

  当这个钩子被调用时，组件实例仍然完全可用。

  **此钩子不会在服务端渲染期间调用。**

## onErrorCaptured() {#onerrorcaptured}

注册一个钩子，当来自后代组件的错误被捕获时调用。

- **类型**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **详情**

  可以从以下来源捕获错误：

  - 组件渲染
  - 事件处理器
  - 生命周期钩子
  - `setup()` 函数
  - watcher
  - 自定义指令钩子
  - 过渡钩子

  该钩子接收三个参数：错误、触发错误的组件实例，以及指定错误来源类型的信息字符串。

  :::tip
  在生产环境中，第 3 个参数（`info`）将是简短代码，而不是完整的信息字符串。你可以在 [生产环境错误代码参考](/error-reference/#runtime-errors) 中找到代码与字符串的映射。
  :::

  你可以在 `onErrorCaptured()` 中修改组件状态，以向用户显示错误状态。然而，错误状态不应渲染导致错误的原始内容；否则组件将陷入无限渲染循环。

  该钩子可以返回 `false` 来阻止错误继续向上传播。详见下方错误传播规则。

  **错误传播规则**

  - 默认情况下，所有错误仍会发送到应用级别的 [`app.config.errorHandler`](/api/application#app-config-errorhandler)（如果已定义），这样这些错误仍然可以在一个地方上报给分析服务。

  - 如果组件的继承链或父链上存在多个 `errorCaptured` 钩子，则它们都会针对同一个错误被调用，顺序为自下而上。这类似于原生 DOM 事件的冒泡机制。

  - 如果 `errorCaptured` 钩子本身抛出错误，则该错误和原始捕获到的错误都会发送到 `app.config.errorHandler`。

  - `errorCaptured` 钩子可以返回 `false` 来阻止错误进一步传播。本质上这表示“该错误已被处理，应被忽略”。这将阻止任何额外的 `errorCaptured` 钩子或 `app.config.errorHandler` 针对此错误被调用。

## onRenderTracked() <sup class="vt-badge dev-only" /> {#onrendertracked}

注册一个调试钩子，当响应式依赖被组件的渲染副作用追踪时调用。

**此钩子仅在开发模式下调用，不会在服务端渲染期间调用。**

- **类型**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **另见** [深入理解响应式系统](/guide/extras/reactivity-in-depth)

## onRenderTriggered() <sup class="vt-badge dev-only" /> {#onrendertriggered}

注册一个调试钩子，当响应式依赖触发组件的渲染副作用重新运行时调用。

**此钩子仅在开发模式下调用，不会在服务端渲染期间调用。**

- **类型**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **另见** [深入理解响应式系统](/guide/extras/reactivity-in-depth)

## onActivated() {#onactivated}

注册一个回调，在作为 [`<KeepAlive>`](/api/built-in-components#keepalive) 缓存树一部分的组件实例插入 DOM 后调用。

**此钩子不会在服务端渲染期间调用。**

- **类型**

  ```ts
  function onActivated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **另见** [指南 - 缓存实例的生命周期](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onDeactivated() {#ondeactivated}

注册一个回调，在作为 [`<KeepAlive>`](/api/built-in-components#keepalive) 缓存树一部分的组件实例从 DOM 中移除后调用。

**此钩子不会在服务端渲染期间调用。**

- **类型**

  ```ts
  function onDeactivated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **另见** [指南 - 缓存实例的生命周期](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onServerPrefetch() <sup class="vt-badge" data-text="仅 SSR" /> {#onserverprefetch}

注册一个异步函数，在组件实例即将在服务端渲染之前解析完成。

- **类型**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **详情**

  如果回调返回一个 Promise，服务端渲染器会等待该 Promise 解析后再渲染组件。

  这个钩子仅会在服务端渲染期间调用，可用于执行仅在服务端进行的数据获取。

- **示例**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // 组件作为初始请求的一部分被渲染
    // 由于比客户端更快，因此在服务端预先获取数据
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // 如果挂载时 data 为 null，说明组件
      // 是在客户端动态渲染的。改为执行
      // 客户端获取。
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **另见** [服务端渲染](/guide/scaling-up/ssr)
