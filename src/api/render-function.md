# 渲染函数 API {#render-function-apis}

## h() {#h}

创建虚拟 DOM 节点（vnode）。

- **类型**

  ```ts
  // 完整签名
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // 省略 props
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > 为了便于阅读，这里简化了类型。

- **详情**

  第一个参数可以是字符串（用于原生元素）或 Vue 组件定义。第二个参数是要传递的 props，第三个参数是子节点。

  在创建组件 vnode 时，子节点必须以 slot 函数的形式传入。如果组件只接受默认插槽，可以传入单个 slot 函数。否则，必须将 slots 以 slot 函数对象的形式传入。

  为了方便起见，当 children 不是 slots 对象时，可以省略 props 参数。

- **示例**

  创建原生元素：

  ```js
  import { h } from 'vue'

  // 除了 type 之外，所有参数都是可选的
  h('div')
  h('div', { id: 'foo' })

  // props 中既可以使用 attribute，也可以使用 property
  // Vue 会自动选择正确的赋值方式
  h('div', { class: 'bar', innerHTML: 'hello' })

  // class 和 style 支持与模板中相同的对象 / 数组
  // 值
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // 事件监听器应以 onXxx 形式传入
  h('div', { onClick: () => {} })

  // children 可以是字符串
  h('div', { id: 'foo' }, 'hello')

  // 当没有 props 时可以省略 props
  h('div', 'hello')
  h('div', [h('span', 'hello')])

  // children 数组可以混合 vnode 和字符串
  h('div', ['hello', h('span', 'hello')])
  ```

  创建组件：

  ```js
  import Foo from './Foo.vue'

  // 传递 props
  h(Foo, {
    // 等同于 some-prop="hello"
    someProp: 'hello',
    // 等同于 @update="() => {}"
    onUpdate: () => {}
  })

  // 传递单个默认插槽
  h(Foo, () => 'default slot')

  // 传递具名插槽
  // 注意这里必须传入 `null`，以避免
  // slots 对象被当作 props 处理
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **另见** [指南 - 渲染函数 - 创建 VNode](/guide/extras/render-function#creating-vnodes)

## mergeProps() {#mergeprops}

合并多个 props 对象，并对某些 props 做特殊处理。

- **类型**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **详情**

  `mergeProps()` 支持合并多个 props 对象，并对以下 props 做特殊处理：

  - `class`
  - `style`
  - `onXxx` 事件监听器 - 同名的多个监听器会被合并为数组。

  如果你不需要合并行为，而只想进行简单覆盖，可以改用原生对象展开语法。

- **示例**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

克隆一个 vnode。

- **类型**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **详情**

  返回一个克隆后的 vnode，并可选择性地附加额外 props，与原始 vnode 合并。

  vnode 一旦创建就应视为不可变，不应修改已有 vnode 的 props。应改为使用不同 / 额外的 props 克隆它。

  vnode 有特殊的内部属性，因此克隆它们并不像对象展开那样简单。`cloneVNode()` 会处理大部分内部逻辑。

- **示例**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

检查一个值是否为 vnode。

- **类型**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

用于手动按名称解析已注册的组件。

- **类型**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **详情**

  **注意：如果你可以直接导入该组件，就不需要这个。**

  `resolveComponent()` 必须在<span class="composition-api"> `setup()` 中，或者在</span>渲染函数内部调用，才能从正确的组件上下文中解析。

  如果未找到该组件，将发出运行时警告，并返回名称字符串。

- **示例**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **另见** [指南 - 渲染函数 - 组件](/guide/extras/render-function#components)

## resolveDirective() {#resolvedirective}

用于手动按名称解析已注册的指令。

- **类型**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **详情**

  **注意：如果你可以直接导入该指令，就不需要这个。**

  `resolveDirective()` 必须在<span class="composition-api"> `setup()` 中，或者在</span>渲染函数内部调用，才能从正确的组件上下文中解析。

  如果未找到该指令，将发出运行时警告，并返回 `undefined`。

- **另见** [指南 - 渲染函数 - 自定义指令](/guide/extras/render-function#custom-directives)

## withDirectives() {#withdirectives}

用于向 vnode 添加自定义指令。

- **类型**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Directive, value, argument, modifiers]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **详情**

  用自定义指令包装一个已有 vnode。第二个参数是一个自定义指令数组。每个自定义指令也以数组形式表示，格式为 `[Directive, value, argument, modifiers]`。如果不需要，数组后续元素可以省略。

- **示例**

  ```js
  import { h, withDirectives } from 'vue'

  // 一个自定义指令
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **另见** [指南 - 渲染函数 - 自定义指令](/guide/extras/render-function#custom-directives)

## withModifiers() {#withmodifiers}

用于向事件处理函数添加内置 [`v-on` 修饰符](/guide/essentials/event-handling#event-modifiers)。

- **类型**

  ```ts
  function withModifiers(fn: Function, modifiers: ModifierGuardsKeys[]): Function
  ```

- **示例**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // 等同于 v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **另见** [指南 - 渲染函数 - 事件修饰符](/guide/extras/render-function#event-modifiers)
