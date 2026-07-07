---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# 深入响应式系统 {#reactivity-in-depth}

Vue 最具特色的功能之一就是它那种不显眼的响应式系统。组件状态由响应式的 JavaScript 对象组成。当你修改它们时，视图也会更新。它让状态管理变得简单直观，但了解它的工作原理也很重要，这样才能避免一些常见陷阱。在这一节中，我们将深入了解 Vue 响应式系统的一些底层细节。

## 什么是响应式？ {#what-is-reactivity}

这些年这个术语在编程中经常出现，但人们说它时到底指什么呢？响应式是一种编程范式，它允许我们以声明式的方式来应对变化。人们通常会给出的经典示例，因为它非常典型，就是一个 Excel 电子表格：

<SpreadSheet />

这里单元格 A2 通过公式 `= A0 + A1` 定义（你可以点击 A2 来查看或编辑公式），所以电子表格给出的是 3。没什么意外的。但如果你更新 A0 或 A1，你会注意到 A2 也会自动更新。

JavaScript 通常不是这样工作的。如果我们用 JavaScript 写一个类似的例子：

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // 仍然是 3
```

当我们修改 `A0` 时，`A2` 不会自动变化。

那么我们如何在 JavaScript 中实现这一点呢？首先，为了重新运行更新 `A2` 的代码，我们把它包装到一个函数里：

```js
let A2

function update() {
  A2 = A0 + A1
}
```

然后，我们需要定义几个术语：

- `update()` 函数会产生一个**副作用**，简称**effect**，因为它修改了程序的状态。

- `A0` 和 `A1` 被视为这个 effect 的**依赖**，因为它们的值被用来执行这个 effect。这个 effect 被称为其依赖的**订阅者**。

我们需要的是一个神奇的函数：只要 `A0` 或 `A1`（**依赖**）变化，就能调用 `update()`（**effect**）：

```js
whenDepsChange(update)
```

这个 `whenDepsChange()` 函数有以下任务：

1. 跟踪变量何时被读取。例如，在求值表达式 `A0 + A1` 时，`A0` 和 `A1` 都会被读取。

2. 如果在某个 effect 正在运行时读取了一个变量，就让这个 effect 成为该变量的订阅者。例如，因为在执行 `update()` 时读取了 `A0` 和 `A1`，所以第一次调用后，`update()` 会成为 `A0` 和 `A1` 的订阅者。

3. 检测变量何时被修改。例如，当 `A0` 被赋予新值时，通知它所有订阅的 effect 重新运行。

## Vue 中的响应式如何工作 {#how-reactivity-works-in-vue}

像示例中那样，我们其实没法真正跟踪局部变量的读取和写入。在原生 JavaScript 中没有任何机制可以做到这一点。不过我们**可以**拦截**对象属性**的读取和写入。

在 JavaScript 中，有两种方式可以拦截属性访问：[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) 和 [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。由于浏览器支持的限制，Vue 2 只使用 getter / setters。在 Vue 3 中，响应式对象使用 Proxies，而 refs 使用 getter / setters。下面是一些伪代码，用来说明它们是如何工作的：

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
这里以及下面的代码片段旨在以尽可能简单的形式解释核心概念，因此省略了许多细节，并忽略了边界情况。
:::

这也解释了我们在基础部分讨论过的响应式对象的一些[限制](/guide/essentials/reactivity-fundamentals#limitations-of-reactive)：

- 当你将响应式对象的属性赋值给局部变量，或对其进行解构时，对这个变量的访问或赋值将不再是响应式的，因为它不再触发源对象上的 get / set 代理拦截。注意，这种“断开连接”只影响变量绑定——如果该变量指向的是一个非原始值，比如对象，那么对该对象的修改仍然会是响应式的。

- `reactive()` 返回的代理对象，虽然表现得与原对象一样，但如果使用 `===` 运算符与原对象比较，它们的身份并不相同。

在 `track()` 内部，我们会检查当前是否有正在运行的 effect。如果有，我们会查找正在被跟踪的属性对应的订阅者 effect（存储在一个 Set 中），并把这个 effect 加入到该 Set：

```js
// 这个会在 effect 即将
// 运行之前设置。我们稍后再处理它。
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

effect 的订阅关系存储在一个全局的 `WeakMap<target, Map<key, Set<effect>>>` 数据结构中。如果某个属性没有找到订阅它的 effect Set（即第一次被跟踪），就会创建一个。这就是 `getSubscribersForProperty()` 函数的大致作用。为了简单起见，我们先跳过它的细节。

在 `trigger()` 内部，我们再次查找该属性的订阅者 effect。但这一次，我们改为调用它们：

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

现在让我们回到 `whenDepsChange()` 函数：

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

它把原始的 `update` 函数包装成一个 effect，在真正执行更新之前先把自己设为当前活跃的 effect。这样，更新过程中调用的 `track()` 就能找到当前活跃的 effect。

到这里，我们已经创建了一个可以自动追踪依赖，并且在依赖变化时重新运行的 effect。我们把它称为**响应式 effect**。

Vue 提供了一个 API 让你创建响应式 effect：[`watchEffect()`](/api/reactivity-core#watcheffect)。实际上，你可能已经注意到，它的工作方式和示例里的神奇 `whenDepsChange()` 非常相似。现在我们可以使用真实的 Vue API 重写原始示例：

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // 跟踪 A0 和 A1
  A2.value = A0.value + A1.value
})

// 触发 effect
A0.value = 2
```

使用响应式 effect 来修改一个 ref 并不是最有趣的用例——实际上，使用计算属性会让它更具声明性：

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

在内部，`computed` 通过响应式 effect 来管理它的失效和重新计算。

那么，一个常见且有用的响应式 effect 示例是什么呢？更新 DOM！我们可以像这样实现简单的“响应式渲染”：

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `Count is: ${count.value}`
})

// 更新 DOM
count.value++
```

实际上，这已经非常接近 Vue 组件保持状态与 DOM 同步的方式了——每个组件实例都会创建一个响应式 effect 来渲染并更新 DOM。当然，Vue 组件更新 DOM 的方式比 `innerHTML` 高效得多。这个话题在[渲染机制](./rendering-mechanism)中有讨论。

<div class="options-api">

`ref()`、`computed()` 和 `watchEffect()` 这些 API 都是组合式 API 的一部分。如果你到目前为止只在 Vue 中使用过选项式 API，你会发现组合式 API 更接近 Vue 响应式系统在底层的工作方式。实际上，在 Vue 3 中，选项式 API 是建立在组合式 API 之上的。组件实例上（`this`）的所有属性访问都会触发用于响应式跟踪的 getter / setters，而像 `watch` 和 `computed` 这样的选项会在内部调用它们对应的组合式 API。

</div>

## 运行时 vs. 编译时响应式 {#runtime-vs-compile-time-reactivity}

Vue 的响应式系统主要基于运行时：所有的跟踪和触发都是在代码直接于浏览器中运行时完成的。运行时响应式的优点是它不需要构建步骤，而且边界情况更少。另一方面，这也使它受限于 JavaScript 的语法限制，因此需要像 Vue refs 这样的值容器。

一些框架，例如 [Svelte](https://svelte.dev/)，选择通过在编译期间实现响应式来克服这些限制。它会分析并转换代码，以模拟响应式。编译步骤允许框架改变 JavaScript 本身的语义——例如，自动注入在局部定义变量的访问周围执行依赖分析和 effect 触发的代码。缺点是，这类转换需要构建步骤，而且改变 JavaScript 语义本质上就是创建一种看起来像 JavaScript、但编译后会变成别的东西的语言。

Vue 团队确实通过一个名为 [Reactivity Transform](/guide/extras/reactivity-transform) 的实验性功能探索过这个方向，但最终我们决定它并不适合这个项目，原因见[这里](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028)。

## 响应式调试 {#reactivity-debugging}

Vue 的响应式系统会自动追踪依赖，这很棒，但在某些情况下，我们可能想要准确地弄清楚到底追踪了什么，或者是什么导致组件重新渲染。

### 组件调试钩子 {#component-debugging-hooks}

我们可以使用 <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> 和 <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span> 这两个生命周期钩子，来调试组件渲染过程中使用了哪些依赖，以及是哪个依赖触发了更新。这两个钩子都会接收一个调试器事件，其中包含相关依赖的信息。建议在回调中放置 `debugger` 语句，以便交互式地检查该依赖：

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
组件调试钩子仅在开发模式下生效。
:::

调试事件对象具有以下类型：

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### 计算属性调试 {#computed-debugging}

<div class="composition-api">

我们可以通过给 `computed()` 传入第二个选项对象，并提供 `onTrack` 和 `onTrigger` 回调，来调试计算属性：

- 当某个响应式属性或 ref 被追踪为依赖时，会调用 `onTrack`。
- 当某个依赖发生变更并触发侦听器回调时，会调用 `onTrigger`。

这两个回调都会接收与组件调试钩子相同格式的调试器事件：[相同格式](#debugger-event)：

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // 当 count.value 被追踪为依赖时触发
    debugger
  },
  onTrigger(e) {
    // 当 count.value 发生变更时触发
    debugger
  }
})

// 访问 plusOne，应触发 onTrack
console.log(plusOne.value)

// 修改 count.value，应触发 onTrigger
count.value++
```

:::tip
`onTrack` 和 `onTrigger` 计算属性选项仅在开发模式下生效。
:::

</div>

<div class="options-api">

计算属性调试选项仅可通过 Composition API 的 `computed()` 函数使用。

</div>

### 侦听器调试 {#watcher-debugging}

<div class="composition-api">

与 `computed()` 类似，侦听器也支持 `onTrack` 和 `onTrigger` 选项：

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

</div>

<div class="options-api">

通过对象语法声明的侦听器也支持 `onTrack` 和 `onTrigger` 选项：

```js
export default {
  watch: {
    source: {
      handler() {
        // ...
      },
      onTrack(e) {
        debugger
      },
      onTrigger(e) {
        debugger
      }
    }
  }
}
```

</div>

:::tip
`onTrack` 和 `onTrigger` 侦听器选项仅在开发模式下生效。
:::

## 与外部状态系统集成 {#integration-with-external-state-systems}

Vue 的响应式系统通过将普通 JavaScript 对象深度转换为响应式代理来工作。在与外部状态管理系统集成时，这种深度转换可能是不必要的，有时甚至是不希望的（例如外部方案也使用了 Proxy）。

将 Vue 的响应式系统与外部状态管理方案集成的一般思路，是将外部状态保存在一个 [`shallowRef`](/api/reactivity-advanced#shallowref) 中。浅层 ref 只有在访问其 `.value` 属性时才是响应式的——内部值会保持原样。当外部状态变化时，替换 ref 的值以触发更新。

### 不可变数据 {#immutable-data}

如果你正在实现撤销 / 重做功能，你很可能希望在每次用户编辑时都为应用状态创建一个快照。然而，如果状态树很大，Vue 的可变响应式系统并不适合这种场景，因为在每次更新时序列化整个状态对象，在 CPU 和内存成本上都可能很昂贵。

[不可变数据结构](https://en.wikipedia.org/wiki/Persistent_data_structure) 通过不直接修改状态对象来解决这个问题——它会创建新的对象，并与旧对象共享未改变的部分。JavaScript 中使用不可变数据有多种方式，但我们推荐在 Vue 中使用 [Immer](https://immerjs.github.io/immer/)，因为它既能使用不可变数据，又能保持更符合人体工学的可变语法。

我们可以通过一个简单的组合式函数将 Immer 与 Vue 集成：

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[在 Playground 中试试](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### 状态机 {#state-machines}

[状态机](https://en.wikipedia.org/wiki/Finite-state_machine) 是一种用于描述应用可能处于的所有状态，以及它如何从一种状态转换到另一种状态的模型。对于简单组件来说它可能有些大材小用，但它可以帮助使复杂的状态流更加健壮和易于管理。

JavaScript 中最流行的状态机实现之一是 [XState](https://xstate.js.org/)。下面是一个与之集成的组合式函数：

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[在 Playground 中试试](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) 是一个用于处理异步事件流的库。[VueUse](https://vueuse.org/) 库提供了 [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) 扩展，用于将 RxJS 流与 Vue 的响应式系统连接起来。

## 与 Signals 的关系 {#connection-to-signals}

不少其他框架也引入了与 Vue Composition API 中的 ref 类似的响应式原语，并将其称为 “signals”：

- [Solid Signals](https://docs.solidjs.com/concepts/signals)
- [Angular Signals](https://angular.dev/guide/signals)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [Qwik Signals](https://qwik.builder.io/docs/components/state/#usesignal)

从根本上说，signals 与 Vue 的 ref 属于同一类响应式原语。它是一个值容器，在访问时提供依赖追踪，在变更时触发副作用。这种基于响应式原语的范式在前端领域并不算新：它可以追溯到十多年前的 [Knockout observables](https://knockoutjs.com/documentation/observables.html) 和 [Meteor Tracker](https://docs.meteor.com/api/tracker.html) 等实现。Vue Options API 和 React 状态管理库 [MobX](https://mobx.js.org/) 也基于同样的原则，只是把这些原语隐藏在对象属性之后。

尽管“signals”并不一定要求具备这一特性，但如今这个概念通常也会与通过细粒度订阅来执行更新的渲染模型一起讨论。由于使用了虚拟 DOM，Vue 目前[依赖编译器来实现类似的优化](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom)。不过，我们也在探索一种受 Solid 启发的新编译策略，称为 [Vapor Mode](https://github.com/vuejs/core-vapor)，它不依赖虚拟 DOM，并且能更多地利用 Vue 内置的响应式系统。

### API 设计权衡 {#api-design-trade-offs}

Preact 和 Qwik 的 signals 设计与 Vue 的 [shallowRef](/api/reactivity-advanced#shallowref) 非常相似：三者都通过 `.value` 属性提供可变接口。下面我们将重点讨论 Solid 和 Angular 的 signals。

#### Solid Signals {#solid-signals}

Solid 的 `createSignal()` API 设计强调读 / 写分离。signals 以只读 getter 和单独的 setter 形式暴露：

```js
const [count, setCount] = createSignal(0)

count() // 访问值
setCount(1) // 更新值
```

注意 `count` 这个 signal 可以在不带 setter 的情况下向下传递。这确保了只要没有显式暴露 setter，状态就永远不会被修改。至于这种安全性是否值得采用更冗长的语法，这取决于项目需求和个人偏好——但如果你喜欢这种 API 风格，也可以很容易在 Vue 中复现：

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[在 Playground 中试试](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Angular Signals {#angular-signals}

Angular 正在经历一些根本性的变化：它放弃了脏检查，并引入了自己对响应式原语的实现。Angular Signal API 如下所示：

```js
const count = signal(0)

count() // 访问值
count.set(1) // 设置新值
count.update((v) => v + 1) // 基于前一个值更新
```

同样，我们也可以很容易地在 Vue 中复现这一 API：

```js
import { shallowRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  return s
}
```

[在 Playground 中试试](https://play.vuejs.org/#eNp9Ul1v0zAU/SuWX9ZCSRh7m9IKGHuAB0AD8WQJZclt6s2xLX+ESlH+O9d2krbr1Df7nnPu17k9/aR11nmgt7SwleHaEQvO6w2TvNXKONITyxtZihWpVKu9g5oMZGtUS66yvJSNF6V5lyjZk71ikslKSeuQ7qUj61G+eL+cgFr5RwGITAkXiyVZb5IAn2/IB+QWeeoHO8GPg1aL0gH+CCl215u7mJ3bW9L3s3IYihyxifMlFRpJqewL1qN3TknysRK8el4zGjNlXtdYa9GFrjryllwvGY18QrisDLQgXZTnSX8pF64zzD7pDWDghbbI5/Hoip7tFL05eLErhVD/HmB75Edpyd8zc9DUaAbso3TrZeU4tjfawSV3vBR/SuFhSfrQUXLHBMvmKqe8A8siK7lmsi5gAbJhWARiIGD9hM7BIfHSgjGaHljzlDyGF2MEPQs6g5dpcAIm8Xs+2XxODTgUn0xVYdJ5RxPhKOd4gdMsA/rgLEq3vEEHlEQPYrbgaqu5APNDh6KWUTyuZC2jcWvfYswZD6spXu2gen4l/mT3Icboz3AWpgNGZ8yVBttM8P2v77DH9wy2qvYC2RfAB7BK+NBjon32ssa2j3ix26/xsrhsftv7vQNpp6FCo4E5RD6jeE93F0Y/tHuT3URd2OLwHyXleRY=)

与 Vue refs 相比，Solid 和 Angular 基于 getter 的 API 风格在 Vue 组件中使用时提供了一些有趣的权衡：

- `()` 比 `.value` 稍微简洁一些，但更新值的写法更冗长。
- 没有 ref 解包：访问值始终需要 `()`。这使得在任何地方访问值的方式都保持一致。这也意味着你可以把原始 signal 直接作为组件 props 传递下去。

这些 API 风格是否适合你，在某种程度上是主观的。这里我们的目标是展示这些不同 API 设计之间的底层相似性和权衡。我们也想说明 Vue 是灵活的：你并不真的被现有 API 所束缚。如果有必要，你可以创建自己的响应式原语 API，以满足更具体的需求。
