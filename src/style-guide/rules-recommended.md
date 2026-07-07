# 优先级 C 规则：推荐 {#priority-c-rules-recommended}

当存在多个同样优秀的选项时，可以任意选择一个以确保一致性。在这些规则中，我们描述每个可接受的选项，并建议一个默认选择。这意味着你完全可以在自己的代码库中做出不同的选择，只要你保持一致并且有充分的理由。不过，请务必有充分的理由！通过适应社区标准，你将：

1. 让大脑更容易解析你遇到的大多数社区代码
2. 能够在不修改的情况下复制并粘贴大多数社区代码示例
3. 经常发现新加入的开发者已经习惯了你偏好的编码风格，至少在 Vue 方面如此

## 组件/实例选项顺序 {#component-instance-options-order}

**组件/实例选项应始终保持一致的顺序。**

这是我们为组件选项推荐的默认顺序。它们被分成多个类别，因此你会知道从插件中添加新属性时应该放在哪里。

1. **全局认知**（需要超出组件范围的知识）

   - `name`

2. **模板编译器选项**（改变模板的编译方式）

   - `compilerOptions`

3. **模板依赖**（模板中使用的资源）

   - `components`
   - `directives`

4. **组合**（将属性合并到选项中）

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **接口**（组件的接口）

   - `inheritAttrs`
   - `props`
   - `emits`
   - `expose`

6. **组合式 API**（使用组合式 API 的入口）

   - `setup`

7. **本地状态**（本地响应式属性）

   - `data`
   - `computed`

8. **事件**（由响应式事件触发的回调）

   - `watch`
   - 生命周期事件（按调用顺序）
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`
     - `serverPrefetch` (仅限 SSR)

9. **非响应式属性**（独立于响应式系统的实例属性）

   - `methods`

10. **渲染**（组件输出的声明式描述）
    - `template`/`render`

## 元素属性顺序 {#element-attribute-order}

**元素（包括组件）的属性应始终保持一致的顺序。**

这是我们为组件选项推荐的默认顺序。它们被分成多个类别，因此你会知道自定义属性和指令应该添加在哪里。

1. **定义**（提供组件选项）

   - `is`

2. **列表渲染**（创建同一元素的多个变体）

   - `v-for`

3. **条件判断**（元素是否被渲染/显示）

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **渲染修饰**（改变元素的渲染方式）

   - `v-pre`
   - `v-once`

5. **全局认知**（需要超出组件范围的知识）

   - `id`

6. **唯一属性**（需要唯一值的属性）

   - `ref`
   - `key`

7. **双向绑定**（绑定与事件的结合）

   - `v-model`

8. **其他属性**（所有未指定的已绑定和未绑定属性）

9. **事件**（组件事件监听器）

   - `v-on`

10. **内容**（覆盖元素内容）
    - `v-html`
    - `v-text`

## 组件/实例选项中的空行 {#empty-lines-in-component-instance-options}

**你可能希望在多行属性之间添加一个空行，尤其是在选项多到不滚动屏幕就无法完整显示时。**

当组件开始显得局促或难以阅读时，在多行属性之间添加空白可以让它们更容易再次快速浏览。在某些编辑器中，例如 Vim，这类格式也会让你更容易用键盘导航。

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Bad</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```js
// 不需要空行也可以，只要组件
// 仍然易于阅读和导航。
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Bad</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```

</div>

</div>

## 单文件组件顶层元素顺序 {#single-file-component-top-level-element-order}

**[单文件组件](/guide/scaling-up/sfc) 应始终一致地排列 `<script>`、`<template>` 和 `<style>` 标签，并且 `<style>` 必须放在最后，因为其他两个中至少有一个总是必需的。**

<div class="style-example style-example-bad">
<h3>不良</h3>

```vue-html [ComponentX.vue]
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html [ComponentA.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>良好</h3>

```vue-html [ComponentA.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

或者

```vue-html  [ComponentA.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>
