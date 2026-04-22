# 选项：生命周期 {#options-lifecycle}

:::info 另请参阅
有关生命周期钩子的共享用法，请参阅 [指南 - 生命周期钩子](/guide/essentials/lifecycle)
:::

## beforeCreate {#beforecreate}

在实例初始化时调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **详情**

  在实例初始化并解析 props 时立即调用。

  然后，props 将被定义为响应式属性，`data()` 或 `computed` 等状态也将被设置。

  请注意，Composition API 的 `setup()` 钩子会在任何 Options API 钩子之前调用，甚至早于 `beforeCreate()`。

## created {#created}

在实例完成所有与状态相关的选项处理后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **详情**

  调用此钩子时，以下内容已经完成设置：响应式数据、计算属性、方法和侦听器。不过，挂载阶段尚未开始，`$el` 属性此时还不可用。

## beforeMount {#beforemount}

在组件即将挂载之前调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **详情**

  调用此钩子时，组件已经完成其响应式状态的设置，但尚未创建任何 DOM 节点。它即将首次执行 DOM 渲染副作用。

  **此钩子不会在服务端渲染期间调用。**

## mounted {#mounted}

在组件挂载完成后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **详情**

  组件在以下情况之后被视为已挂载：

  - 其所有同步子组件都已挂载（不包括异步组件或 `<Suspense>` 树中的组件）。

  - 它自身的 DOM 树已经创建并插入到父容器中。请注意，只有当应用的根容器也在文档中时，才能保证组件的 DOM 树在文档中。

  此钩子通常用于执行需要访问组件渲染后 DOM 的副作用，或者在 [服务端渲染应用](/guide/scaling-up/ssr) 中将与 DOM 相关的代码限制在客户端执行。

  **此钩子不会在服务端渲染期间调用。**

## beforeUpdate {#beforeupdate}

在组件由于响应式状态变化而即将更新其 DOM 树之前调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **详情**

  此钩子可用于在 Vue 更新 DOM 之前访问 DOM 状态。在此钩子中修改组件状态也是安全的。

  **此钩子不会在服务端渲染期间调用。**

## updated {#updated}

在组件由于响应式状态变化而更新其 DOM 树后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **详情**

  父组件的 updated 钩子会在其子组件的 updated 钩子之后调用。

  此钩子会在组件的任何 DOM 更新之后调用，而这些更新可能由不同的状态变化引起。如果你需要在某次特定状态变化后访问更新后的 DOM，请改用 [nextTick()](/api/general#nexttick)。

  **此钩子不会在服务端渲染期间调用。**

  :::warning
  不要在 updated 钩子中修改组件状态——这很可能会导致无限更新循环！
  :::

## beforeUnmount {#beforeunmount}

在组件实例即将卸载之前调用。

- **类型**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **详情**

  调用此钩子时，组件实例仍然完全可用。

  **此钩子不会在服务端渲染期间调用。**

## unmounted {#unmounted}

在组件卸载完成后调用。

- **类型**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **详情**

  组件在以下情况之后被视为已卸载：

  - 其所有子组件都已卸载。

  - 其所有相关的响应式副作用（渲染副作用以及在 `setup()` 期间创建的 computed / watchers）都已停止。

  使用此钩子清理手动创建的副作用，例如定时器、DOM 事件监听器或服务器连接。

  **此钩子不会在服务端渲染期间调用。**

## errorCaptured {#errorcaptured}

当捕获到从后代组件传播上来的错误时调用。

- **类型**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
  ```

- **详情**

  可从以下来源捕获错误：

  - 组件渲染
  - 事件处理器
  - 生命周期钩子
  - `setup()` 函数
  - 侦听器
  - 自定义指令钩子
  - 过渡钩子

  该钩子接收三个参数：错误、触发该错误的组件实例，以及用于指定错误来源类型的信息字符串。

  :::tip
  在生产环境中，第 3 个参数（`info`）将是缩短后的代码，而不是完整的信息字符串。你可以在 [生产环境错误代码参考](/error-reference/#runtime-errors) 中找到代码到字符串的映射。
  :::

  你可以在 `errorCaptured()` 中修改组件状态，向用户显示错误状态。不过，重要的是错误状态不应渲染导致错误的原始内容；否则组件将陷入无限渲染循环。

  该钩子可以返回 `false` 来阻止错误继续向上传播。详见下方错误传播规则。

  **错误传播规则**

  - 默认情况下，所有错误仍会发送到应用级别的 [`app.config.errorHandler`](/api/application#app-config-errorhandler)（如果已定义），以便这些错误仍可在一个地方报告给分析服务。

  - 如果组件继承链或父链上存在多个 `errorCaptured` 钩子，它们都会按自下而上的顺序针对同一个错误被调用。这类似于原生 DOM 事件的冒泡机制。

  - 如果 `errorCaptured` 钩子自身抛出错误，则该错误和最初捕获到的错误都会发送到 `app.config.errorHandler`。

  - `errorCaptured` 钩子可以返回 `false`，以阻止错误继续传播。本质上，这相当于表示“这个错误已经被处理，应被忽略”。这将阻止该错误触发任何额外的 `errorCaptured` 钩子或 `app.config.errorHandler`。

  **错误捕获注意事项**
  
  - 在具有异步 `setup()` 函数（使用顶层 `await`）的组件中，即使 `setup()` 抛出了错误，Vue **始终** 会尝试渲染组件模板。这很可能会导致更多错误，因为在渲染过程中组件模板可能会尝试访问失败的 `setup()` 上下文中不存在的属性。在捕获此类组件中的错误时，要准备同时处理异步 `setup()` 失败（它们总是会先发生）和渲染过程失败这两类错误。

  - <sup class="vt-badge" data-text="仅 SSR"></sup> 在 `<Suspense>` 内部深层的父组件中替换出错的子组件，会导致 SSR 中的 hydration 不匹配。作为替代，尝试将可能会抛出错误的逻辑从子组件的 `setup()` 中拆分到单独的函数里，并在父组件的 `setup()` 中执行它，在那里你可以安全地使用 `try/catch` 处理执行过程，并在实际渲染子组件之前根据需要进行替换。

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

当某个响应式依赖被组件的渲染副作用追踪时调用。

**此钩子仅在开发模式下调用，并且不会在服务端渲染期间调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **另请参阅** [响应式深度解析](/guide/extras/reactivity-in-depth)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered}

当某个响应式依赖触发组件的渲染副作用重新运行时调用。

**此钩子仅在开发模式下调用，并且不会在服务端渲染期间调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

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

- **另请参阅** [响应式深度解析](/guide/extras/reactivity-in-depth)

## activated {#activated}

在组件实例作为由 [`<KeepAlive>`](/api/built-in-components#keepalive) 缓存的树的一部分插入到 DOM 后调用。

**此钩子不会在服务端渲染期间调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **另请参阅** [指南 - 缓存实例的生命周期](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## deactivated {#deactivated}

在组件实例作为由 [`<KeepAlive>`](/api/built-in-components#keepalive) 缓存的树的一部分从 DOM 中移除后调用。

**此钩子不会在服务端渲染期间调用。**

- **类型**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **另请参阅** [指南 - 缓存实例的生命周期](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="仅 SSR" /> {#serverprefetch}

在组件实例即将于服务器上渲染之前要解析的异步函数。

- **类型**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **详情**

  如果该钩子返回一个 Promise，服务器渲染器会等待该 Promise 解析后再渲染组件。

  这个钩子只会在服务端渲染期间被调用，可用于执行仅限服务器端的数据获取。

- **示例**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // 组件会作为初始请求的一部分被渲染
      // 在服务器上预先获取数据，因为它比在客户端更快
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // 如果在挂载时 data 为 null，说明该组件
        // 是在客户端动态渲染的。改为执行
        // 客户端数据获取。
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **另请参见** [服务器端渲染](/guide/scaling-up/ssr)
