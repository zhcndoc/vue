---
footer: false
---

# 介绍 {#introduction}

:::info 你正在阅读 Vue 3 的文档！

- Vue 2 的支持已于 **2023 年 12 月 31 日** 结束。了解更多关于 [Vue 2 EOL](https://v2.vuejs.org/eol/)。
- 从 Vue 2 升级？查看 [迁移指南](https://v3-migration.vuejs.org/)。
  :::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses/" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery 横幅" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">通过视频教程学习 Vue，访问 <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery 标志" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## 什么是 Vue？ {#what-is-vue}

Vue（读作 /vjuː/，类似 **view**）是一个用于构建用户界面的 JavaScript 框架。它建立在标准的 HTML、CSS 和 JavaScript 之上，并提供了一个声明式、组件化的编程模型，帮助你高效地开发任何复杂度的用户界面。

下面是一个最小示例：

<div class="options-api">

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

</div>
<div class="composition-api">

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

</div>

```vue-html
<div id="app">
  <button @click="count++">
    计数是：{{ count }}
  </button>
</div>
```

**结果**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    计数是：{{ count }}
  </button>
</div>

上面的示例展示了 Vue 的两个核心特性：

- **声明式渲染**：Vue 在标准 HTML 之上扩展了一套模板语法，使我们能够基于 JavaScript 状态以声明式的方式描述 HTML 输出。

- **响应性**：Vue 会自动跟踪 JavaScript 状态的变化，并在变化发生时高效地更新 DOM。

你可能已经有一些疑问——别担心。我们会在文档的其余部分逐一讲解每一个细节。现在，请继续阅读，以便对 Vue 能提供什么有一个整体性的理解。

:::tip 前置知识
文档的其余部分默认你已具备 HTML、CSS 和 JavaScript 的基本知识。如果你是前端开发的完全新手，把一个框架作为第一步直接上手可能并不是最好的想法——先掌握基础，再回来学习！如果需要，你可以通过这些概览检查自己的知识水平：[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)、[HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) 和 [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps)。如果有其他框架的使用经验会有帮助，但并非必需。
:::

## 渐进式框架 {#the-progressive-framework}

Vue 是一个框架和生态系统，涵盖了前端开发中大多数常见功能。但 Web 世界极其多样——我们在 Web 上构建的内容在形式和规模上可能千差万别。考虑到这一点，Vue 被设计为灵活且可逐步采用。根据你的使用场景，Vue 可以以不同方式使用：

- 在不需要构建步骤的情况下增强静态 HTML
- 作为 Web Components 嵌入到任何页面
- 单页应用（SPA）
- 全栈 / 服务端渲染（SSR）
- Jamstack / 静态站点生成（SSG）
- 面向桌面端、移动端、WebGL，甚至终端

如果你觉得这些概念让人望而生畏，别担心！教程和指南只需要你具备基础的 HTML 和 JavaScript 知识，而且你不需要成为这些领域的专家也能跟上。

如果你是一名有经验的开发者，想了解如何最好地将 Vue 集成到你的技术栈中，或者你只是对这些术语的含义感到好奇，我们会在 [使用 Vue 的方式](/guide/extras/ways-of-using-vue) 中更详细地讨论它们。

尽管 Vue 很灵活，但关于它如何工作的核心知识在所有这些使用场景中是共通的。即使你现在只是初学者，沿途学到的知识在你未来成长、应对更宏大的目标时依然会非常有用。如果你已经是老手，你可以根据自己要解决的问题，选择最适合的方式来利用 Vue，同时保持同样的生产力。这就是我们称 Vue 为“渐进式框架”的原因：它能随着你一同成长，并适应你的需求。

## 单文件组件 {#single-file-components}

在大多数启用了构建工具的 Vue 项目中，我们使用一种称为 **单文件组件**（Single-File Component，简称 `*.vue` 文件，缩写为 **SFC**）的类似 HTML 的文件格式来编写 Vue 组件。顾名思义，Vue SFC 将组件的逻辑（JavaScript）、模板（HTML）和样式（CSS）封装在同一个文件中。下面是前面的示例，以 SFC 格式编写：

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">计数是：{{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">计数是：{{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>

SFC 是 Vue 的标志性特性，也是推荐的 Vue 组件编写方式，**前提是**你的使用场景需要构建环境。你可以在专门的章节中了解更多关于 [SFC 的是什么以及为什么](/guide/scaling-up/sfc)——但现在，只需要知道 Vue 会为你处理所有构建工具的设置即可。

## API 风格 {#api-styles}

Vue 组件可以使用两种不同的 API 风格来编写：**Options API** 和 **Composition API**。

### Options API {#options-api}

使用 Options API 时，我们通过 `data`、`methods` 和 `mounted` 等选项对象来定义组件逻辑。选项中定义的属性会在函数内部通过 `this` 暴露出来，而 `this` 指向组件实例：

```vue
<script>
export default {
  // 从 data() 返回的属性会成为响应式状态
  // 并会在 `this` 上暴露。
  data() {
    return {
      count: 0
    }
  },

  // 方法是会修改状态并触发更新的函数。
  // 它们可以在模板中作为事件处理器绑定。
  methods: {
    increment() {
      this.count++
    }
  },

  // 生命周期钩子会在组件生命周期的不同阶段被调用。
  // 这个函数会在组件挂载时调用。
  mounted() {
    console.log(`初始计数是 ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">计数是：{{ count }}</button>
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### Composition API {#composition-api}

使用 Composition API 时，我们通过导入的 API 函数来定义组件逻辑。在 SFC 中，Composition API 通常与 [`<script setup>`](/api/sfc-script-setup) 一起使用。`setup` 属性是一个提示，它会让 Vue 执行编译期转换，从而使我们能够用更少的样板代码来使用 Composition API。例如，在 `<script setup>` 中声明的导入和顶层变量/函数可以直接在模板中使用。

下面是同一个组件，使用完全相同的模板，但改为使用 Composition API 和 `<script setup>`：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 会修改状态并触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`初始计数是 ${count.value}.`)
})
</script>

<template>
  <button @click="increment">计数是：{{ count }}</button>
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### 该选哪一个？ {#which-to-choose}

这两种 API 风格都足以覆盖常见使用场景。它们是由完全相同的底层系统驱动的不同接口。事实上，Options API 是建立在 Composition API 之上的！关于 Vue 的基础概念和知识在这两种风格之间是共通的。

Options API 围绕“组件实例”这一概念展开（示例中的 `this` 就是如此），这通常更符合来自 OOP 语言背景的用户所熟悉的类式思维模型。它也更适合初学者，因为它抽象掉了响应式的细节，并通过选项分组来强制进行代码组织。

Composition API 则围绕在函数作用域中直接声明响应式状态变量，并将多个函数中的状态组合起来以处理复杂性这一思想展开。它更自由，且要有效使用它，需要理解 Vue 中响应式是如何工作的。作为回报，它的灵活性使得组织和复用逻辑时可以采用更强大的模式。

你可以在 [Composition API 常见问题](/guide/extras/composition-api-faq) 中了解更多关于这两种风格的比较，以及 Composition API 的潜在优势。

如果你是 Vue 新手，我们的一般建议是：

- 为了学习目的，选择你觉得更容易理解的风格。再次强调，这两种风格的大多数核心概念是共享的。你以后随时都可以再学习另一种风格。

- 用于生产环境时：

  - 如果你不使用构建工具，或者主要计划在低复杂度场景中使用 Vue，例如渐进式增强，那么选择 Options API。

  - 如果你计划使用 Vue 构建完整应用，请选择 Composition API + 单文件组件。

在学习阶段，你不必只坚持一种风格。文档的其余部分会在适用时同时提供两种风格的代码示例，你也可以随时通过左侧边栏顶部的 **API Preference switches** 在它们之间切换。

## 还有疑问？ {#still-got-questions}

查看我们的 [FAQ](/about/faq)。

## 选择你的学习路径 {#pick-your-learning-path}

不同的开发者有不同的学习方式。你可以自由选择适合你偏好的学习路径——不过如果可以的话，我们仍然建议你尽可能通读所有内容！

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">尝试教程</p>
    <p class="next-steps-caption">适合那些喜欢通过动手来学习的人。</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">阅读指南</p>
    <p class="next-steps-caption">本指南将带你全面详细地了解该框架的各个方面。</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">查看示例</p>
    <p class="next-steps-caption">探索核心功能和常见 UI 任务的示例。</p>
  </a>
</div>
