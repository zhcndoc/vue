# 自定义渲染器 API {#custom-renderer-api}

## createRenderer() {#createrenderer}

创建一个自定义渲染器。通过提供平台特定的节点创建和操作 API，你可以利用 Vue 的核心运行时来适配非 DOM 环境。

- **类型**

  ```ts
  function createRenderer<HostNode, HostElement>(
    options: RendererOptions<HostNode, HostElement>
  ): Renderer<HostElement>

  interface Renderer<HostElement> {
    render: RootRenderFunction<HostElement>
    createApp: CreateAppFunction<HostElement>
  }

  interface RendererOptions<HostNode, HostElement> {
    patchProp(
      el: HostElement,
      key: string,
      prevValue: any,
      nextValue: any,
      namespace?: ElementNamespace,
      parentComponent?: ComponentInternalInstance | null,
    ): void
    insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
    remove(el: HostNode): void
    createElement(
      type: string,
      namespace?: ElementNamespace,
      isCustomizedBuiltIn?: string,
      vnodeProps?: (VNodeProps & { [key: string]: any }) | null,
    ): HostElement
    createText(text: string): HostNode
    createComment(text: string): HostNode
    setText(node: HostNode, text: string): void
    setElementText(node: HostElement, text: string): void
    parentNode(node: HostNode): HostElement | null
    nextSibling(node: HostNode): HostNode | null
    querySelector?(selector: string): HostElement | null
    setScopeId?(el: HostElement, id: string): void
    cloneNode?(node: HostNode): HostNode
    insertStaticContent?(
      content: string,
      parent: HostElement,
      anchor: HostNode | null,
      namespace: ElementNamespace,
      start?: HostNode | null,
      end?: HostNode | null,
    ): [HostNode, HostNode]
  }
  ```

- **示例**

  ```js
  import { createRenderer } from '@vue/runtime-core'

  const { render, createApp } = createRenderer({
    patchProp,
    insert,
    remove,
    createElement
    // ...
  })

  // `render` 是底层 API
  // `createApp` 返回一个应用实例
  export { render, createApp }

  // 重新导出 Vue 核心 API
  export * from '@vue/runtime-core'
  ```

  Vue 自己的 `@vue/runtime-dom` [就是使用相同的 API 实现的](https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/index.ts)。如果想看更简单的实现，可以查看 [`@vue/runtime-test`](https://github.com/vuejs/core/blob/main/packages/runtime-test/src/index.ts)，它是 Vue 自己单元测试所用的一个私有包。
