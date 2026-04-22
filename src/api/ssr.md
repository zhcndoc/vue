# 服务端渲染 API {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **从 `vue/server-renderer` 导出**

- **类型**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **示例**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### SSR 上下文 {#ssr-context}

  你可以传入一个可选的上下文对象，它可用于在渲染期间记录额外数据，例如[访问 Teleports 的内容](/guide/scaling-up/ssr#teleports)：

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  本页中的大多数其他 SSR API 也都可选择性地接受一个上下文对象。可以通过 [useSSRContext](#usessrcontext) 辅助函数在组件代码中访问该上下文对象。

- **另请参见** [指南 - 服务端渲染](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

将输入渲染为 [Node.js 可读流](https://nodejs.org/api/stream.html#stream_class_stream_readable)。

- **从 `vue/server-renderer` 导出**

- **类型**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **示例**

  ```js
  // 在 Node.js http 处理程序中
  renderToNodeStream(app).pipe(res)
  ```

  :::tip 注意
  该方法不受 `vue/server-renderer` 的 ESM 构建支持，因为它与 Node.js 环境解耦。请改用 [`pipeToNodeWritable`](#pipetonodewritable)。
  :::

## pipeToNodeWritable() {#pipetonodewritable}

将渲染结果输出并管道到一个现有的 [Node.js 可写流](https://nodejs.org/api/stream.html#stream_writable_streams)实例。

- **从 `vue/server-renderer` 导出**

- **类型**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **示例**

  ```js
  // 在 Node.js http 处理程序中
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

将输入渲染为 [Web 可读流](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。

- **从 `vue/server-renderer` 导出**

- **类型**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **示例**

  ```js
  // 在支持 ReadableStream 的环境中
  return new Response(renderToWebStream(app))
  ```

  :::tip 注意
  在全局作用域中不暴露 `ReadableStream` 构造函数的环境中，应改用 [`pipeToWebWritable()`](#pipetowebwritable)。
  :::

## pipeToWebWritable() {#pipetowebwritable}

将渲染结果输出并管道到一个现有的 [Web 可写流](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)实例。

- **从 `vue/server-renderer` 导出**

- **类型**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **示例**

  这通常与 [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) 配合使用：

  ```js
  // TransformStream 可用于 CloudFlare workers 等环境中。
  // 在 Node.js 中，TransformStream 需要显式从 'stream/web' 中导入
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

使用简单的可读接口以流式模式渲染输入。

- **从 `vue/server-renderer` 导出**

- **类型**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **示例**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // 完成
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // 遇到错误
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

一个运行时 API，用于获取传递给 `renderToString()` 或其他服务端渲染 API 的上下文对象。

- **类型**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **示例**

  获取到的上下文可用于附加最终 HTML 渲染所需的信息（例如 head 元数据）。

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // 确保只在 SSR 期间调用它
  // https://vite.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...向上下文附加属性
  }
  </script>
  ```

## data-allow-mismatch <sup class="vt-badge" data-text="3.5+" /> {#data-allow-mismatch}

一个特殊属性，可用于抑制 [hydration mismatch](/guide/scaling-up/ssr#hydration-mismatch) 警告。

- **示例**

  ```html
  <div data-allow-mismatch="text">{{ data.toLocaleString() }}</div>
  ```

  该值可以将允许的不匹配限制为特定类型。允许的值有：

  - `text`
  - `children`（仅允许直接子节点不匹配）
  - `class`
  - `style`
  - `attribute`

  如果未提供值，则允许所有类型的不匹配。
