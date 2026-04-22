# 组合式函数 {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
本节假设你已经具备 Composition API 的基础知识。如果你只学习过 Options API 下的 Vue，可以将 API Preference 切换为 Composition API（使用左侧边栏顶部的切换按钮），然后重新阅读 [响应式基础](/guide/essentials/reactivity-fundamentals) 和 [生命周期钩子](/guide/essentials/lifecycle) 两章。
:::

## 什么是“组合式函数”？ {#what-is-a-composable}

在 Vue 应用的语境中，“组合式函数”是指利用 Vue 的 Composition API 来封装和复用**有状态逻辑**的函数。

在构建前端应用时，我们经常需要复用常见任务的逻辑。例如，我们可能需要在很多地方格式化日期，因此会提取一个可复用的函数。这个格式化函数封装的是**无状态逻辑**：它接收一些输入，并立即返回预期的输出。用于复用无状态逻辑的库有很多，比如你可能听说过的 [lodash](https://lodash.com/) 和 [date-fns](https://date-fns.org/)。

相较之下，有状态逻辑涉及管理会随时间变化的状态。一个简单的例子是跟踪页面上鼠标的当前位置。在真实场景中，它也可能是更复杂的逻辑，例如触摸手势或数据库连接状态。

## 鼠标跟踪示例 {#mouse-tracker-example}

如果我们直接在组件内部使用 Composition API 来实现鼠标跟踪功能，看起来会像这样：

```vue [MouseComponent.vue]
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>鼠标位置：{{ x }}, {{ y }}</template>
```

但是，如果我们想在多个组件中复用同样的逻辑呢？我们可以将逻辑提取到外部文件中，作为一个组合式函数：

```js [mouse.js]
import { ref, onMounted, onUnmounted } from 'vue'

// 按照约定，组合式函数名以 "use" 开头
export function useMouse() {
  // 状态由组合式函数封装并管理
  const x = ref(0)
  const y = ref(0)

  // 组合式函数可以随时间更新它所管理的状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 组合式函数也可以挂接到其所属组件的生命周期，
  // 来设置和清理副作用。
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 以返回值形式暴露管理的状态
  return { x, y }
}
```

在组件中可以这样使用：

```vue [MouseComponent.vue]
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>鼠标位置：{{ x }}, {{ y }}</template>
```

<div class="demo">
  鼠标位置：{{ x }}, {{ y }}
</div>

[在 Playground 中试试](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

正如我们所见，核心逻辑保持不变——我们要做的只是把它移动到外部函数中，并返回应该暴露的状态。就像在组件内部一样，你也可以在组合式函数中使用完整的 [Composition API 函数](/api/#composition-api) 范围。同样的 `useMouse()` 功能现在可以在任何组件中使用。

不过，组合式函数更酷的地方在于，它们还可以彼此嵌套：一个组合式函数可以调用一个或多个其他组合式函数。这使我们能够使用小而独立的单元来组合复杂逻辑，类似于我们通过组件来组合整个应用的方式。事实上，这也是我们将这种模式所依赖的 API 集合称为 Composition API 的原因。

例如，我们可以将添加和移除 DOM 事件监听器的逻辑提取成它自己的组合式函数：

```js [event.js]
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 如果你愿意，也可以让它
  // 支持将选择器字符串作为 target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

现在我们的 `useMouse()` 组合式函数可以简化为：

```js{2,8-11} [mouse.js]
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
每个调用 `useMouse()` 的组件实例都会创建它自己的 `x` 和 `y` 状态副本，因此它们不会相互干扰。如果你想在组件之间管理共享状态，请阅读 [状态管理](/guide/scaling-up/state-management) 一章。
:::

## 异步状态示例 {#async-state-example}

`useMouse()` 组合式函数不接受任何参数，所以我们来看看另一个使用参数的示例。在进行异步数据获取时，我们通常需要处理不同的状态：加载中、成功和错误：

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">糟糕！遇到错误：{{ error.message }}</div>
  <div v-else-if="data">
    数据已加载：
    <pre>{{ data }}</pre>
  </div>
  <div v-else>加载中...</div>
</template>
```

如果每个需要获取数据的组件都重复这一模式，就会很繁琐。让我们把它提取成一个组合式函数：

```js [fetch.js]
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

现在在组件中我们只需这样做：

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### 接受响应式状态 {#accepting-reactive-state}

`useFetch()` 接受一个静态的 URL 字符串作为输入——因此它只会执行一次请求，然后结束。如果我们希望在 URL 变化时重新请求，该怎么做呢？为此，我们需要向组合式函数传入响应式状态，并让组合式函数创建 watcher，使用传入的状态执行操作。

例如，`useFetch()` 应该能够接受一个 ref：

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// 这应该会触发重新请求
url.value = '/new-url'
```

或者，接受一个 [getter 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)：

```js
// 当 props.id 变化时重新请求
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

我们可以使用 [`watchEffect()`](/api/reactivity-core.html#watcheffect) 和 [`toValue()`](/api/reactivity-utilities.html#tovalue) API 来重构现有实现：

```js{7,12} [fetch.js]
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // 在请求前重置状态..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` 是一个在 3.3 中新增的 API。它用于将 ref 或 getter 规范化为值。如果参数是一个 ref，它会返回该 ref 的值；如果参数是一个函数，它会调用该函数并返回其返回值。否则，它将原样返回该参数。它的工作方式与 [`unref()`](/api/reactivity-utilities.html#unref) 类似，但对函数有特殊处理。

请注意，`toValue(url)` 是在 `watchEffect` 回调内部调用的。这可以确保在 `toValue()` 规范化过程中访问到的任何响应式依赖都能被 watcher 跟踪。

现在这个版本的 `useFetch()` 同时接受静态 URL 字符串、ref 和 getter，因此灵活得多。watch effect 会立即运行，并跟踪在 `toValue(url)` 期间访问到的任何依赖。如果没有跟踪到任何依赖（例如 url 本身已经是一个字符串），则 effect 只运行一次；否则，它会在任何被跟踪的依赖变化时重新运行。

这是 [更新后的 `useFetch()` 版本](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP7GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGz5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=), 带有人为延迟和随机错误，仅用于演示。

## 约定与最佳实践 {#conventions-and-best-practices}

### 命名 {#naming}

约定上，组合式函数应使用以 “use” 开头的 camelCase 名称进行命名。

### 输入参数 {#input-arguments}

组合式函数可以接受 ref 或 getter 作为参数，即使它本身并不依赖它们进行响应式处理。如果你正在编写一个可能被其他开发者使用的组合式函数，最好考虑输入参数可能是 ref 或 getter，而不是原始值。[`toValue()`](/api/reactivity-utilities#tovalue) 工具函数对此非常有用：

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // 如果 maybeRefOrGetter 是 ref 或 getter，
  // 则返回其规范化后的值。
  // 否则，直接按原样返回。
  const value = toValue(maybeRefOrGetter)
}
```

如果你的组合式函数在输入为 ref 或 getter 时会创建响应式副作用，请确保要么使用 `watch()` 显式监听该 ref / getter，要么在 `watchEffect()` 中调用 `toValue()`，以便正确追踪依赖。

前面讨论过的 [useFetch() 实现](#accepting-reactive-state) 提供了一个具体示例，展示了一个将 ref、getter 和普通值都作为输入参数的组合式函数。

### 返回值 {#return-values}

你可能已经注意到，我们在组合式函数中一直使用 `ref()` 而不是 `reactive()`。推荐的约定是：组合式函数始终返回一个普通的、非响应式对象，其中包含多个 ref。这样在组件中解构时仍能保持响应性：

```js
// x 和 y 是 ref
const { x, y } = useMouse()
```

如果从组合式函数返回一个响应式对象，那么这种解构会使其与组合式函数内部状态的响应式连接丢失，而 ref 则能保留这种连接。

如果你更希望将组合式函数返回的状态作为对象属性来使用，可以用 `reactive()` 包裹返回对象，从而自动解包 ref。例如：

```js
const mouse = reactive(useMouse())
// mouse.x 与原始 ref 绑定
console.log(mouse.x)
```

```vue-html
鼠标位置：{{ mouse.x }}, {{ mouse.y }}
```

### 副作用 {#side-effects}

在组合式函数中执行副作用（例如添加 DOM 事件监听器或获取数据）是可以的，但请注意以下规则：

- 如果你正在开发一个使用[服务端渲染](/guide/scaling-up/ssr)（SSR）的应用，请务必将与 DOM 相关的副作用放在挂载后生命周期钩子中执行，例如 `onMounted()`。这些钩子只会在浏览器中被调用，因此你可以确信其中的代码能够访问 DOM。

- 记得在 `onUnmounted()` 中清理副作用。例如，如果某个组合式函数设置了 DOM 事件监听器，就应该像我们在 `useMouse()` 示例中看到的那样，在 `onUnmounted()` 中移除该监听器。使用一个能自动帮你完成这件事的组合式函数会很有帮助，例如 `useEventListener()` 示例。

### 使用限制 {#usage-restrictions}

组合式函数只能在 `<script setup>` 或 `setup()` 钩子中调用。并且它们还必须在这些上下文中**同步**调用。在某些情况下，你也可以在诸如 `onMounted()` 这样的生命周期钩子中调用它们。

这些限制很重要，因为这些上下文正是 Vue 能够确定当前激活组件实例的地方。访问激活的组件实例是必要的，这样：

1. 可以向其注册生命周期钩子。

2. 可以将 watcher 关联到它，从而在实例卸载时将其释放，以防止内存泄漏。

:::tip
`<script setup>` 是你在使用 `await` 之后仍然可以调用组合式函数的唯一地方。编译器会在异步操作后自动为你恢复激活实例上下文。
:::

## 为代码组织提取组合式函数 {#extracting-composables-for-code-organization}

提取组合式函数不仅可以为了复用，也可以为了组织代码。随着组件复杂度的增长，你最终可能会得到一些过于庞大、难以浏览和理解的组件。Composition API 让你可以根据逻辑关注点，将组件代码完全灵活地组织成更小的函数：

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

在某种程度上，你可以把这些被提取出来的组合式函数看作是组件作用域内、彼此可以通信的服务。

## 在 Options API 中使用组合式函数 {#using-composables-in-options-api}

如果你使用的是 Options API，组合式函数必须在 `setup()` 内部调用，并且返回的绑定必须从 `setup()` 中返回，这样它们才能暴露给 `this` 和模板：

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的属性可以通过 `this` 访问
    console.log(this.x)
  }
  // ...其他选项
}
```

## 与其他技术的对比 {#comparisons-with-other-techniques}

### vs. Mixins {#vs-mixins}

来自 Vue 2 的用户可能熟悉 [mixins](/api/options-composition#mixins) 选项，它也允许我们将组件逻辑提取为可复用单元。Mixins 主要有三个缺点：

1. **属性来源不清晰**：当使用很多 mixin 时，很难判断某个实例属性是由哪个 mixin 注入的，这会使追踪实现和理解组件行为变得困难。这也是我们建议在组合式函数中使用 refs + 解构模式的原因：它能让使用方组件中的属性来源更清晰。

2. **命名空间冲突**：来自不同作者的多个 mixin 可能会注册相同的属性键，从而导致命名空间冲突。对于组合式函数，如果不同组合式函数之间存在冲突键，你可以重命名解构出来的变量。

3. **隐式的 mixin 间通信**：需要彼此交互的多个 mixin 必须依赖共享的属性键，从而形成隐式耦合。而组合式函数中，一个组合式函数返回的值可以像普通函数参数一样传递给另一个组合式函数。

基于以上原因，我们不再推荐在 Vue 3 中使用 mixin。保留该特性只是为了迁移和熟悉度。

### vs. 无渲染组件 {#vs-renderless-components}

在组件插槽章节中，我们讨论了基于作用域插槽的 [无渲染组件](/guide/components/slots#renderless-components) 模式。我们甚至使用无渲染组件实现了相同的鼠标追踪演示。

组合式函数相对于无渲染组件的主要优势在于：组合式函数不会带来额外的组件实例开销。当在整个应用中使用时，无渲染组件模式所创建的额外组件实例数量可能会成为明显的性能负担。

建议是：当复用纯逻辑时使用组合式函数；当同时复用逻辑和视觉布局时使用组件。

### vs. React Hooks {#vs-react-hooks}

如果你有 React 经验，你可能会注意到这看起来与自定义 React Hooks 非常相似。Composition API 在某种程度上受到了 React Hooks 的启发，而 Vue 组合式函数在逻辑组合能力方面确实与 React Hooks 类似。然而，Vue 组合式函数基于 Vue 细粒度的响应式系统，这与 React Hooks 的执行模型有着根本区别。关于这一点的更详细说明，请参阅 [Composition API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks)。

## 延伸阅读 {#further-reading}

- [深入响应式系统](/guide/extras/reactivity-in-depth)：了解 Vue 响应式系统工作原理的底层细节。
- [状态管理](/guide/scaling-up/state-management)：用于管理多个组件共享状态的模式。
- [测试组合式函数](/guide/scaling-up/testing#testing-composables)：关于组合式函数单元测试的提示。
- [VueUse](https://vueuse.org/)：一个不断增长的 Vue 组合式函数集合。其源代码也是很好的学习资源。
