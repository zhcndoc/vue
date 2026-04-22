# SFC CSS 特性 {#sfc-css-features}

## Scoped CSS {#scoped-css}

当 `<style>` 标签带有 `scoped` 属性时，其 CSS 只会应用于当前组件的元素。这类似于 Shadow DOM 中的样式封装。它有一些注意事项，但不需要任何 polyfill。它是通过使用 PostCSS 将以下内容转换而实现的：

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

转换为以下内容：

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### 子组件根元素 {#child-component-root-elements}

使用 `scoped` 时，父组件的样式不会泄漏到子组件中。不过，子组件的根节点会同时受到父组件的 scoped CSS 和子组件自身 scoped CSS 的影响。这是有意为之，这样父组件就可以为了布局目的来为子组件的根元素设置样式。

### 深度选择器 {#deep-selectors}

如果你希望 `scoped` 样式中的某个选择器是“深度”的，也就是会影响子组件，可以使用 `:deep()` 伪类：

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

以上内容会被编译为：

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
使用 `v-html` 创建的 DOM 内容不会受到 scoped 样式的影响，但你仍然可以使用深度选择器来为它们设置样式。
:::

### 插槽选择器 {#slotted-selectors}

默认情况下，scoped 样式不会影响由 `<slot/>` 渲染的内容，因为这些内容被视为属于传入它们的父组件。要显式地定位插槽内容，请使用 `:slotted` 伪类：

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### 全局选择器 {#global-selectors}

如果你只想让某一条规则全局生效，可以使用 `:global` 伪类，而不是再创建另一个 `<style>`（见下文）：

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### 混合本地和全局样式 {#mixing-local-and-global-styles}

你也可以在同一个组件中同时包含 scoped 和非 scoped 样式：

```vue
<style>
/* 全局样式 */
</style>

<style scoped>
/* 本地样式 */
</style>
```

### Scoped 样式提示 {#scoped-style-tips}

- **Scoped 样式并不会消除对 class 的需求**。由于浏览器渲染各种 CSS 选择器的方式，`p { color: red }` 在 scoped 时（即与属性选择器结合时）会慢很多倍。如果改用 class 或 id，例如 `.example { color: red }`，那么你几乎就能消除这种性能损耗。

- **在递归组件中要小心后代选择器！** 对于选择器为 `.a .b` 的 CSS 规则，如果匹配 `.a` 的元素包含一个递归子组件，那么该子组件中的所有 `.b` 都会被这条规则匹配到。

## CSS Modules {#css-modules}

`<style module>` 标签会被编译为 [CSS Modules](https://github.com/css-modules/css-modules)，并将生成的 CSS 类以 `$style` 为键暴露给组件作为一个对象：

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

生成的类会被哈希处理以避免冲突，从而达到仅将 CSS 作用域限制在当前组件上的相同效果。

更多细节请参考 [CSS Modules 规范](https://github.com/css-modules/css-modules)，例如 [全局例外](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#exceptions) 和 [组合](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#composition)。

### 自定义注入名称 {#custom-inject-name}

你可以通过给 `module` 属性赋值来定制注入类对象的属性键：

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### 在 Composition API 中使用 {#usage-with-composition-api}

注入的类可以在 `setup()` 和 `<script setup>` 中通过 `useCssModule` API 访问。对于带有自定义注入名称的 `<style module>` 块，`useCssModule` 允许将匹配的 `module` 属性值作为第一个参数传入：

```js
import { useCssModule } from 'vue'

// 在 setup() 作用域内...
// 默认，返回 <style module> 的类
useCssModule()

// 命名，返回 <style module="classes"> 的类
useCssModule('classes')
```

- **示例**

```vue
<script setup lang="ts">
import { useCssModule } from 'vue'

const classes = useCssModule()
</script>

<template>
  <p :class="classes.red">red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

## CSS 中的 `v-bind()` {#v-bind-in-css}

SFC `<style>` 标签支持使用 `v-bind` CSS 函数将 CSS 值与动态组件状态关联起来：

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

该语法也适用于 [`<script setup>`](./sfc-script-setup)，并支持 JavaScript 表达式（必须用引号包裹）：

```vue
<script setup>
import { ref } from 'vue'
const theme = ref({
    color: 'red',
})
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

实际值会被编译为带哈希的 CSS 自定义属性，因此 CSS 仍然是静态的。该自定义属性会通过内联样式应用到组件的根元素上，并在源值变化时进行响应式更新。
