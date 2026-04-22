# 自定义元素 API {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

此方法接受的参数与 [`defineComponent`](#definecomponent) 相同，但会返回一个原生 [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) 类构造函数。

- **类型**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // 以下选项为 3.5+
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > 为便于阅读，类型已做简化。

- **详情**

  除了普通的组件选项外，`defineCustomElement()` 还支持一些自定义元素专有选项：

  - **`styles`**：用于提供应注入到元素 shadow root 中的内联 CSS 字符串数组。

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>：可用于配置自定义元素的 Vue 应用实例的函数。

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>：`boolean`，默认值为 `true`。设为 `false` 可在不使用 shadow root 的情况下渲染自定义元素。这意味着自定义元素 SFC 中的 `<style>` 将不再被封装。

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>：`string`，如果提供，将作为注入到 shadow root 的 style 标签上的 `nonce` 属性值。

  请注意，这些选项除了可以作为组件本身的一部分传入，也可以通过第二个参数传入：

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  返回值是一个自定义元素构造函数，可使用 [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) 进行注册。

- **示例**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* 组件选项 */
  })

  // 注册自定义元素。
  customElements.define('my-vue-element', MyVueElement)
  ```

- **另请参阅**

  - [指南 - 使用 Vue 构建自定义元素](/guide/extras/web-components#building-custom-elements-with-vue)

  - 另请注意，`defineCustomElement()` 与单文件组件一起使用时需要[特殊配置](/guide/extras/web-components#sfc-as-custom-element)。

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

一个 Composition API 辅助函数，用于返回当前 Vue 自定义元素的宿主元素。

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

一个 Composition API 辅助函数，用于返回当前 Vue 自定义元素的 shadow root。

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

一个 Options API 属性，用于暴露当前 Vue 自定义元素的宿主元素。
