# 选项：杂项 {#options-misc}

## name {#name}

显式声明组件的显示名称。

- **类型**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **详情**

  组件名称用于以下场景：

  - 在组件自身模板中进行递归自引用
  - 在 Vue DevTools 的组件检查树中显示
  - 在警告信息的组件追踪中显示

  当你使用单文件组件时，组件已经会从文件名推断出自己的名称。例如，名为 `MyComponent.vue` 的文件会推断出显示名称 `"MyComponent"`。

  另一种情况是，当组件通过 [`app.component`](/api/application#app-component) 全局注册时，全局 ID 会自动被设置为其名称。

  `name` 选项允许你覆盖推断出的名称，或者在无法推断名称时显式提供一个名称（例如，在不使用构建工具时，或者是内联的非 SFC 组件）。

  有一种情况需要显式指定 `name`：当通过 [`<KeepAlive>`](/guide/built-ins/keep-alive) 的 `include / exclude` 属性匹配可缓存组件时。

  :::tip
  自 3.2.34 版本起，使用 `<script setup>` 的单文件组件会根据文件名自动推断其 `name` 选项，因此即使在与 `<KeepAlive>` 一起使用时，也不再需要手动声明名称。
  :::

## inheritAttrs {#inheritattrs}

控制是否启用默认的组件属性透传行为。

- **类型**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // 默认：true
  }
  ```

- **详情**

  默认情况下，父作用域中未被识别为 props 的属性绑定会“透传”下去。这意味着当我们有一个单根组件时，这些绑定会像普通 HTML 属性一样应用到子组件的根元素上。当编写一个包裹目标元素或另一个组件的组件时，这种默认行为并不总是符合预期。通过将 `inheritAttrs` 设置为 `false`，可以禁用这种默认行为。这些属性可以通过 `$attrs` 实例属性访问，并且可以使用 `v-bind` 显式绑定到非根元素上。

- **示例**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  在使用 `<script setup>` 的组件中声明此选项时，你可以使用 [`defineOptions`](/api/sfc-script-setup#defineoptions) 宏：

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **另见**

  - [透传属性](/guide/components/attrs)
  <div class="composition-api">

  - [在普通 `<script>` 中使用 `inheritAttrs`](/api/sfc-script-setup.html#usage-alongside-normal-script)
  </div>

## components {#components}

一个用于注册组件、使其可在组件实例中使用的对象。

- **类型**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **示例**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // 简写
      Foo,
      // 以不同名称注册
      RenamedBar: Bar
    }
  }
  ```

- **另见** [组件注册](/guide/components/registration)

## directives {#directives}

一个用于注册指令、使其可在组件实例中使用的对象。

- **类型**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **示例**

  ```js
  export default {
    directives: {
      // 在模板中启用 v-focus
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

- **另见** [自定义指令](/guide/reusability/custom-directives)
