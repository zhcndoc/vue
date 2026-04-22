<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

`<KeepAlive>` 是一个内置组件，它允许我们在多个组件之间动态切换时，有条件地缓存组件实例。

## 基本用法 {#basic-usage}

在“组件基础”章节中，我们介绍了 [动态组件](/guide/essentials/component-basics#dynamic-components) 的语法，使用 `<component>` 特殊元素：

```vue-html
<component :is="activeComponent" />
```

默认情况下，当切换离开一个活动组件实例时，它会被卸载。这会导致它所持有的任何已更改状态丢失。当该组件再次显示时，只会使用初始状态创建一个新的实例。

在下面的示例中，我们有两个有状态组件——A 包含一个计数器，而 B 包含一个通过 `v-model` 与输入框同步的消息。尝试更新其中一个组件的状态，切换离开，然后再切换回来：

<SwitchComponent />

你会注意到，当切换回来时，之前修改过的状态已经被重置了。

在切换时创建全新的组件实例通常是很有用的行为，但在这里，我们实际上希望即使这两个组件实例处于非活动状态时，也能被保留。为了解决这个问题，我们可以用内置的 `<KeepAlive>` 组件包裹我们的动态组件：

```vue-html
<!-- 非活动组件将被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

现在，状态将会在组件切换之间得到保留：

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip
当在 [DOM 内模板](/guide/essentials/component-basics#in-dom-template-parsing-caveats) 中使用时，应将其写作 `<keep-alive>`。
:::

## 包含 / 排除 {#include-exclude}

默认情况下，`<KeepAlive>` 会缓存内部的任何组件实例。我们可以通过 `include` 和 `exclude` prop 来自定义这一行为。这两个 prop 都可以是以逗号分隔的字符串、`RegExp`，或者包含这两种类型之一的数组：

```vue-html
<!-- 逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式（使用 `v-bind`） -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组（使用 `v-bind`） -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

匹配是根据组件的 [`name`](/api/options-misc#name) 选项进行检查的，因此需要被 `KeepAlive` 有条件缓存的组件必须显式声明 `name` 选项。

:::tip
自 3.2.34 版本起，使用 `<script setup>` 的单文件组件会根据文件名自动推断其 `name` 选项，因此无需再手动声明名称。
:::

## 最大缓存实例数 {#max-cached-instances}

我们可以通过 `max` prop 限制可缓存的组件实例最大数量。当指定 `max` 时，`<KeepAlive>` 的行为类似于 [LRU 缓存](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_(LRU)>)：如果即将缓存的实例数量超过指定的最大数量，最久未被访问的缓存实例将被销毁，为新的实例腾出空间。

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## 缓存实例的生命周期 {#lifecycle-of-cached-instance}

当一个组件实例从 DOM 中移除，但它是由 `<KeepAlive>` 缓存的组件树的一部分时，它会进入**停用**状态，而不是被卸载。当一个组件实例作为缓存树的一部分被插入到 DOM 中时，它会被**激活**。

<div class="composition-api">

被缓存的组件可以使用 [`onActivated()`](/api/composition-api-lifecycle#onactivated) 和 [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated) 注册这两个状态的生命周期钩子：

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 在初次挂载时调用
  // 以及每次从缓存中重新插入时调用
})

onDeactivated(() => {
  // 在从 DOM 移入缓存时调用
  // 以及在卸载时也会调用
})
</script>
```

</div>
<div class="options-api">

被缓存的组件可以使用 [`activated`](/api/options-lifecycle#activated) 和 [`deactivated`](/api/options-lifecycle#deactivated) 钩子注册这两个状态的生命周期钩子：

```js
export default {
  activated() {
    // 在初次挂载时调用
    // 以及每次从缓存中重新插入时调用
  },
  deactivated() {
    // 在从 DOM 移入缓存时调用
    // 以及在卸载时也会调用
  }
}
```

</div>

请注意：

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> 也会在挂载时调用，<span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> 也会在卸载时调用。

- 这两个钩子不仅适用于由 `<KeepAlive>` 缓存的根组件，也适用于缓存树中的后代组件。
---

**相关**

- [`<KeepAlive>` API 参考](/api/built-in-components#keepalive)
