# 内置特殊属性 {#built-in-special-attributes}

## key {#key}

`key` 这个特殊属性主要用于作为 Vue 虚拟 DOM 算法的提示，在将新节点列表与旧节点列表进行 diff 时，用于识别 vnode。

- **期望类型：** `number | string | symbol`

- **详情**

  如果没有 key，Vue 会使用一种算法，尽量减少元素移动，并尝试尽可能在原地对相同类型的元素进行 patch / 复用。使用 key 后，Vue 会根据 key 的顺序变化来重新排序元素，而那些不再存在 key 的元素总是会被移除 / 销毁。

  同一个父节点下的子节点必须具有**唯一的 key**。重复的 key 会导致渲染错误。

  最常见的用法是与 `v-for` 配合：

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  它也可以用于强制替换一个元素 / 组件，而不是复用它。这在你想要以下情况时会很有用：

  - 正确触发组件的生命周期钩子
  - 触发过渡

  例如：

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  当 `text` 变化时，`<span>` 总是会被替换而不是被 patch，因此会触发过渡。

- **另见** [指南 - 列表渲染 - 使用 `key` 维护状态](/guide/essentials/list#maintaining-state-with-key)

## ref {#ref}

表示一个 [模板 ref](/guide/essentials/template-refs)。

- **期望类型：** `string | Function`

- **详情**

  `ref` 用于注册对元素或子组件的引用。

  在 Options API 中，该引用会注册到组件的 `this.$refs` 对象下：

  ```vue-html
  <!-- stored as this.$refs.p -->
  <p ref="p">hello</p>
  ```

  在 Composition API 中，该引用会存储在一个同名的 ref 中：

  ```vue
  <script setup>
  import { useTemplateRef } from 'vue'

  const pRef = useTemplateRef('p')
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  如果用于普通 DOM 元素，引用就是该元素本身；如果用于子组件，引用就是子组件实例。

  另外，`ref` 也可以接受一个函数值，从而完全控制将引用存储到哪里：

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  关于 ref 注册时机，有一个重要注意事项：由于 ref 本身是在渲染函数执行时创建的，因此你必须等到组件挂载后才能访问它们。

  `this.$refs` 也是非响应式的，因此不要尝试在模板中将其用于数据绑定。

- **另见**
  - [指南 - 模板 ref](/guide/essentials/template-refs)
  - [指南 - 类型化模板 ref](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [指南 - 类型化组件模板 ref](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

用于绑定 [动态组件](/guide/essentials/component-basics#dynamic-components)。

- **期望类型：** `string | Component`

- **在原生元素上的用法**
 
  - 仅在 3.1+ 中支持

  当 `is` 属性用于原生 HTML 元素时，它会被解释为一个 [自定义内置元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)，这是原生 Web 平台特性。

  不过，在某些场景下，你可能需要 Vue 将原生元素替换为 Vue 组件，如 [DOM 内模板解析注意事项](/guide/essentials/component-basics#in-dom-template-parsing-caveats) 中所述。你可以在 `is` 属性值前加上 `vue:` 前缀，这样 Vue 就会改为将该元素渲染为一个 Vue 组件：

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **另见**

  - [内置特殊元素 - `<component>`](/api/built-in-special-elements#component)
  - [动态组件](/guide/essentials/component-basics#dynamic-components)
