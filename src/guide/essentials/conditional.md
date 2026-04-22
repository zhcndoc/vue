# 条件渲染 {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Vue.js 条件渲染免费课程"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Vue.js 条件渲染免费课程"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

`v-if` 指令用于有条件地渲染一个块。只有当该指令的表达式返回真值时，这个块才会被渲染。

```vue-html
<h1 v-if="awesome">Vue 很棒！</h1>
```

## `v-else` {#v-else}

你可以使用 `v-else` 指令来表示 `v-if` 的“else 块”：

```vue-html
<button @click="awesome = !awesome">切换</button>

<h1 v-if="awesome">Vue 很棒！</h1>
<h1 v-else>哦不 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">切换</button>
  <h1 v-if="awesome">Vue 很棒！</h1>
  <h1 v-else>哦不 😢</h1>
</div>

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

`v-else` 元素必须紧跟在 `v-if` 或 `v-else-if` 元素后面，否则它将不会被识别。

## `v-else-if` {#v-else-if}

顾名思义，`v-else-if` 充当 `v-if` 的“else if 块”。它也可以连续使用多次：

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  不是 A/B/C
</div>
```

与 `v-else` 类似，`v-else-if` 元素必须紧跟在 `v-if` 或 `v-else-if` 元素后面。

## `<template>` 上的 `v-if` {#v-if-on-template}

由于 `v-if` 是一个指令，它必须附着在单个元素上。但如果我们想切换多个元素怎么办？在这种情况下，我们可以在 `<template>` 元素上使用 `v-if`，它充当一个不可见的包裹元素。最终渲染结果中不会包含 `<template>` 元素。

```vue-html
<template v-if="ok">
  <h1>标题</h1>
  <p>段落 1</p>
  <p>段落 2</p>
</template>
```

`v-else` 和 `v-else-if` 也可以用在 `<template>` 上。

## `v-show` {#v-show}

另一个有条件显示元素的选项是 `v-show` 指令。它的用法基本相同：

```vue-html
<h1 v-show="ok">你好！</h1>
```

不同之处在于，带有 `v-show` 的元素总是会被渲染并保留在 DOM 中；`v-show` 只是切换该元素的 `display` CSS 属性。

`v-show` 不支持 `<template>` 元素，也不能与 `v-else` 一起使用。

## `v-if` vs. `v-show` {#v-if-vs-v-show}

`v-if` 是“真正的”条件渲染，因为它能确保条件块内的事件监听器和子组件在切换时被正确地销毁和重新创建。

`v-if` 也是**惰性的**：如果初始渲染时条件为假，它不会做任何事——直到条件第一次变为真时，条件块才会被渲染。

相比之下，`v-show` 要简单得多——无论初始条件如何，元素都会被渲染，并通过基于 CSS 的方式进行切换。

一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果你需要非常频繁地切换某些内容，请优先选择 `v-show`；如果条件在运行时不太可能改变，请优先选择 `v-if`。

## `v-if` 与 `v-for` {#v-if-with-v-for}

当 `v-if` 和 `v-for` 同时用于同一个元素时，`v-if` 会先被求值。详情请参见 [列表渲染指南](list#v-for-with-v-if)。

::: warning 注意
由于隐式优先级，不建议在同一个元素上同时使用 `v-if` 和 `v-for`。详情请参见 [列表渲染指南](list#v-for-with-v-if)。
:::
