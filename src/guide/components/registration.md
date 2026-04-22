# 组件注册 {#component-registration}

> 本页假设你已经阅读过 [组件基础](/guide/essentials/component-basics)。如果你是组件新手，请先阅读那一页。

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="免费的 Vue.js 组件注册课程"/>

Vue 组件需要先进行“注册”，这样当 Vue 在模板中遇到它时，才能知道去哪里找到它的实现。组件有两种注册方式：全局注册和局部注册。

## 全局注册 {#global-registration}

我们可以使用 `.component()` 方法，让组件在当前 [Vue 应用程序](/guide/essentials/application)中全局可用：

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // 注册的名称
  'MyComponent',
  // 实现
  {
    /* ... */
  }
)
```

如果使用单文件组件（SFC），你将注册导入的 `.vue` 文件：

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

`.component()` 方法可以链式调用：

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

全局注册的组件可以在此应用程序内任何组件的模板中使用：

```vue-html
<!-- 这在应用中的任何组件里都可以工作 -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

这甚至适用于所有子组件，这意味着这三个组件也都可以在彼此内部使用。

## 局部注册 {#local-registration}

虽然很方便，但全局注册有一些缺点：

1. 全局注册会阻止构建系统移除未使用的组件（即“tree-shaking”）。如果你全局注册了一个组件，但最终在应用中的任何地方都没有使用它，它仍然会被包含在最终打包结果中。

2. 全局注册会让大型应用中的依赖关系不够明确。对于父组件使用的子组件，很难从父组件中定位其实现。这会影响长期维护性，类似于使用过多全局变量。

局部注册会将已注册组件的可用范围限制在当前组件内。这样能让依赖关系更加明确，也更利于 tree-shaking。

<div class="composition-api">

在使用带有 `<script setup>` 的 SFC 时，导入的组件可以直接在局部使用，无需注册：

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

在非 `<script setup>` 中，你需要使用 `components` 选项：

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

局部注册通过 `components` 选项完成：

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

对于 `components` 对象中的每个属性，键将是组件的注册名称，而值将包含组件的实现。上面的示例使用了 ES2015 的属性简写，等价于：

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

请注意，**局部注册的组件也 _不会_ 在后代组件中可用**。在这种情况下，`ComponentA` 只会对当前组件可用，不会对其任何子组件或后代组件可用。

## 组件名称大小写 {#component-name-casing}

在整个指南中，我们在注册组件时使用 PascalCase 命名。这是因为：

1. PascalCase 名称是有效的 JavaScript 标识符。这使得在 JavaScript 中导入和注册组件更容易，也有助于 IDE 的自动补全。

2. `<PascalCase />` 更清楚地表明这是一个 Vue 组件，而不是模板中的原生 HTML 元素。它也将 Vue 组件与自定义元素（web components）区分开来。

当使用 SFC 或字符串模板时，推荐使用这种风格。不过，正如在 [DOM 内模板解析注意事项](/guide/essentials/component-basics#in-dom-template-parsing-caveats) 中所讨论的，PascalCase 标签不能在 DOM 内模板中使用。

幸运的是，Vue 支持将 kebab-case 标签解析为使用 PascalCase 注册的组件。这意味着，一个注册为 `MyComponent` 的组件，可以在 Vue 模板中（或者在 Vue 渲染的 HTML 元素中）通过 `<MyComponent>` 和 `<my-component>` 两种方式引用。这使我们能够无论模板来源如何，都使用相同的 JavaScript 组件注册代码。
