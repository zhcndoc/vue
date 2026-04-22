# 全局 API：通用 {#global-api-general}

## version {#version}

暴露 Vue 的当前版本。

- **类型：** `string`

- **示例**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

用于等待下一次 DOM 更新刷新的工具函数。

- **类型**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **详情**

  当你在 Vue 中修改响应式状态时，产生的 DOM 更新不会同步应用。相反，Vue 会将它们缓冲到“下一次 tick”再统一处理，以确保无论你进行了多少次状态变更，每个组件都只会更新一次。

  `nextTick()` 可在状态变更后立即使用，以等待 DOM 更新完成。你既可以将回调作为参数传入，也可以 await 返回的 Promise。

- **示例**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM  هنوز未更新
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM 现在已更新
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM  अभी未更新
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM 现在已更新
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **另请参见** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

用于定义带有类型推导的 Vue 组件的类型辅助函数。

- **类型**

  ```ts
  // options 语法
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // 函数语法（需要 3.3+）
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > 为了便于阅读，这里对类型进行了简化。

- **详情**

  第一个参数接收一个组件选项对象。返回值将是相同的选项对象，因为该函数本质上只是为了类型推导而存在的运行时空操作。

  请注意，返回类型有些特殊：它将是一个构造器类型，其实例类型是根据选项推导出的组件实例类型。当返回类型在 TSX 中被用作标签时，就会用到这一点来进行类型推导。

  你可以像这样从 `defineComponent()` 的返回类型中提取组件的实例类型（等同于其选项中 `this` 的类型）：

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### 函数签名 {#function-signature}

  - 仅支持 3.3+

  `defineComponent()` 还有另一种签名，旨在与组合式 API 以及 [渲染函数或 JSX](/guide/extras/render-function.html) 一起使用。

  这里传入的不是选项对象，而是一个函数。这个函数与组合式 API 的 [`setup()`](/api/composition-api-setup.html#composition-api-setup) 函数行为相同：它会接收 props 和 setup 上下文。返回值应为一个渲染函数——`h()` 和 JSX 都受支持：

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // 在这里像在 <script setup> 中一样使用组合式 API
      const count = ref(0)

      return () => {
        // 渲染函数或 JSX
        return h('div', count.value)
      }
    },
    // 额外选项，例如声明 props 和 emits
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  这种签名的主要使用场景是 TypeScript（尤其是 TSX），因为它支持泛型：

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // 在这里像在 <script setup> 中一样使用组合式 API
      const count = ref(0)

      return () => {
        // 渲染函数或 JSX
        return <div>{count.value}</div>
      }
    },
    // 目前仍然需要手动声明运行时 props。
    {
      props: ['msg', 'list']
    }
  )
  ```

  未来，我们计划提供一个 Babel 插件，自动推导并注入运行时 props（类似 SFC 中的 `defineProps`），这样就可以省略运行时 props 声明。

  ### 关于 webpack Tree Shaking 的说明 {#note-on-webpack-treeshaking}

  由于 `defineComponent()` 是一个函数调用，对于某些构建工具（例如 webpack）来说，它看起来可能会产生副作用。这会导致即使组件从未被使用，也无法被 tree-shaking 掉。

  要告诉 webpack 这次函数调用可以安全地被 tree-shaking，你可以在函数调用前添加 `/*#__PURE__*/` 注释标记：

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  请注意，如果你使用的是 Vite，这并不是必须的，因为 Rollup（Vite 所使用的底层生产构建工具）足够智能，能够判断 `defineComponent()` 实际上没有副作用，无需手动标注。

- **另请参见** [指南 - 在 TypeScript 中使用 Vue](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

定义一个异步组件，它只会在被渲染时才进行懒加载。该参数可以是一个加载器函数，也可以是一个用于更高级控制加载行为的选项对象。

- **类型**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **另请参见** [指南 - 异步组件](/guide/components/async)
