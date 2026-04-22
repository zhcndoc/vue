<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# 过渡 {#transition}

Vue 提供了两个内置组件，可以帮助我们处理因状态变化而产生的过渡和动画：

- `<Transition>` 用于在元素或组件进入和离开 DOM 时应用动画。本页将介绍它。

- `<TransitionGroup>` 用于在 `v-for` 列表中对元素或组件的插入、移除或移动应用动画。这将在[下一章](/guide/built-ins/transition-group)中介绍。

除了这两个组件之外，我们也可以在 Vue 中使用其他技术来应用动画，例如切换 CSS 类，或者通过样式绑定实现由状态驱动的动画。这些额外技术将在[动画技巧](/guide/extras/animation)一章中介绍。

## `<Transition>` 组件 {#the-transition-component}

`<Transition>` 是一个内置组件：这意味着它在任何组件的模板中都可直接使用，无需注册。它可用于对通过默认插槽传入的元素或组件应用进入和离开动画。进入或离开可以通过以下任一方式触发：

- 通过 `v-if` 条件渲染
- 通过 `v-show` 条件显示
- 通过 `<component>` 特殊元素切换动态组件
- 更改特殊的 `key` 属性

下面是最基础用法的示例：

```vue-html
<button @click="show = !show">切换</button>
<Transition>
  <p v-if="show">你好</p>
</Transition>
```

```css
/* 接下来我们会解释这些类的作用！ */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)

</div>
<div class="options-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>

:::tip
`<Transition>` 只支持单个元素或组件作为其插槽内容。如果内容是组件，那么该组件本身也必须只有一个根元素。
:::

当 `<Transition>` 组件中的元素被插入或移除时，会发生以下过程：

1. Vue 会自动探测目标元素是否应用了 CSS 过渡或动画。如果有，就会在合适的时机添加/移除一些 [CSS 过渡类](#transition-classes)。

2. 如果存在 [JavaScript 钩子](#javascript-hooks)监听器，那么这些钩子会在合适的时机被调用。

3. 如果没有检测到 CSS 过渡/动画，并且也没有提供 JavaScript 钩子，那么插入和/或移除的 DOM 操作会在浏览器的下一帧动画中执行。

## 基于 CSS 的过渡 {#css-based-transitions}

### 过渡类 {#transition-classes}

进入/离开过渡会应用六个类。

![过渡图示](./images/transition-classes.png)

<!-- https://www.figma.com/file/rlOv0ZKJFFNA9hYmzdZv3S/Transition-Classes -->

1. `v-enter-from`：进入的起始状态。在元素插入之前添加，在元素插入后一帧移除。

2. `v-enter-active`：进入的激活状态。在整个进入阶段都会应用。在元素插入之前添加，在过渡/动画结束时移除。这个类可用于定义进入过渡的持续时间、延迟和缓动曲线。

3. `v-enter-to`：进入的结束状态。在元素插入后一帧添加（与移除 `v-enter-from` 同时），在过渡/动画结束时移除。

4. `v-leave-from`：离开的起始状态。在离开过渡触发后立即添加，在一帧后移除。

5. `v-leave-active`：离开的激活状态。在整个离开阶段都会应用。在离开过渡触发后立即添加，在过渡/动画结束时移除。这个类可用于定义离开过渡的持续时间、延迟和缓动曲线。

6. `v-leave-to`：离开的结束状态。在离开过渡触发后一帧添加（与移除 `v-leave-from` 同时），在过渡/动画结束时移除。

`v-enter-active` 和 `v-leave-active` 让我们能够为进入/离开过渡指定不同的缓动曲线，后续章节会看到相关示例。

### 命名过渡 {#named-transitions}

可以通过 `name` prop 为过渡命名：

```vue-html
<Transition name="fade">
  ...
</Transition>
```

对于命名过渡，其过渡类名前缀会使用其名称而不是 `v`。例如，上面这个过渡应用的类将是 `fade-enter-active` 而不是 `v-enter-active`。fade 过渡对应的 CSS 应该如下所示：

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### CSS 过渡 {#css-transitions}

`<Transition>` 最常与 [原生 CSS 过渡](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)配合使用，就像上面的基础示例那样。`transition` CSS 属性是一个简写属性，允许我们指定过渡的多个方面，包括应该被动画化的属性、过渡持续时间，以及 [缓动曲线](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function)。

下面是一个更高级的示例，它对多个属性进行过渡，并为进入和离开设置不同的持续时间和缓动曲线：

```vue-html
<Transition name="slide-fade">
  <p v-if="show">你好</p>
</Transition>
```

```css
/*
  进入和离开动画可以使用不同的
  持续时间和时间函数。
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNqFkc9uwjAMxl/F6wXQKIVNk1AX0HbZC4zDDr2E4EK0NIkStxtDvPviFQ0OSFzyx/m+n+34kL16P+lazMpMRBW0J4hIrV9WVjfeBYIDBKzhCHVwDQySdFDZyipnY5Lu3BcsWDCk0OKosqLoKcmfLoSNN5KQbyTWLZGz8KKMVp+LKju573ivsuXKbbcG4d3oDcI9vMkNiqL3JD+AWAVpoyadGFY2yATW5nVSJj9rkspDl+v6hE/hHRrjRMEdpdfiDEkBUVxWaEWkveHj5AzO0RKGXCrSHcKBIfSPKEEaA9PJYwSUEXPX0nNlj8y6RBiUHd5AzCOodq1VvsYfjWE4G6fgEy/zMcxG17B9ZTyX8bV85C5y1S40ZX/kdj+GD1P/zVQA56XStC9h2idJI/z7huz4CxoVvE4=)

</div>
<div class="options-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)

</div>

### CSS 动画 {#css-animations}

[原生 CSS 动画](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)的应用方式与 CSS 过渡相同，区别在于 `*-enter-from` 不会在元素插入后立即移除，而是在 `animationend` 事件触发时移除。

对于大多数 CSS 动画，我们可以直接将其声明在 `*-enter-active` 和 `*-leave-active` 类下。下面是一个示例：

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    这里有一些弹跳文本！
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)

</div>
<div class="options-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)

</div>

### 自定义过渡类 {#custom-transition-classes}

你也可以通过向 `<Transition>` 传入以下 props 来指定自定义过渡类：

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

这些会覆盖常规的类名。当你想要将 Vue 的过渡系统与现有的 CSS 动画库结合使用时，这尤其有用，例如 [Animate.css](https://daneden.github.io/animate.css/)：

```vue-html
<!-- 假设页面中已引入 Animate.css -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">你好</p>
</Transition>
```

<div class="composition-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)

</div>
<div class="options-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

</div>

### 同时使用过渡和动画 {#using-transitions-and-animations-together}

Vue 需要挂载事件监听器来判断过渡何时结束。根据应用的 CSS 规则类型，这个事件可以是 `transitionend` 或 `animationend`。如果你只使用其中一种，Vue 可以自动检测正确的类型。

不过，在某些情况下，你可能希望在同一个元素上同时使用两者，例如由 Vue 触发的 CSS 动画，以及 hover 时的 CSS 过渡效果。在这种情况下，你需要通过传入 `type` prop 显式声明你希望 Vue 关注的类型，其值可以是 `animation` 或 `transition`：

```vue-html
<Transition type="animation">...</Transition>
```

### 嵌套过渡与显式过渡时长 {#nested-transitions-and-explicit-transition-durations}

虽然过渡类只会应用到 `<Transition>` 中的直接子元素，但我们仍然可以通过嵌套的 CSS 选择器来对嵌套元素应用过渡：

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      你好
    </div>
  </div>
</Transition>
```

```css
/* 作用于嵌套元素的规则 */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... 其他必要的 CSS 已省略 */
```

我们甚至可以在进入时给嵌套元素添加过渡延迟，从而创建交错的进入动画序列：

```css{3}
/* 延迟嵌套元素进入，以实现交错效果 */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

不过，这会带来一个小问题。默认情况下，`<Transition>` 组件会通过监听根过渡元素上的**第一个** `transitionend` 或 `animationend` 事件，来自动判断过渡何时结束。对于嵌套过渡，期望的行为应该是等待所有内部元素的过渡都结束。

在这种情况下，你可以在 `<Transition>` 组件上使用 `duration` prop 显式指定过渡时长（以毫秒为单位）。总时长应当与内部元素的延迟加上过渡时长相匹配：

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[在 Playground 中试一试](https://play.vuejs.org/#eNqVVd9v0zAQ/leO8LAfrE3HNKSFbgKmSYMHQNAHkPLiOtfEm2NHttN2mvq/c7bTNi1jgFop9t13d9995ziPyfumGc5bTLJkbLkRjQOLrm2uciXqRhsHj2BwBiuYGV3DAUEPcpUrrpUlaKUXcOkBh860eJSrcRqzUDxtHNaNZA5pBzCets5pBe+4FPz+Mk+66Bf+mSdXE12WEsdphMWQiWHKCicoLCtaw/yKIs/PR3kCitVIG4XWYUEJfATFFGIO84GYdRUIyCWzlra6dWg2wA66dgqlts7c+d8tSqk34JTQ6xqb9TjdUiTDOO21TFvrHqRfDkPpExiGKvBITjdl/L40ulVFBi8R8a3P17CiEKrM4GzULIOlFmpQoSgrl8HpKFpX3kFZu2y0BNhJxznvwaJCA1TEYcC4E3MkKp1VIptjZ43E3KajDJiUMBqeWUBmcUBUqJGYOT2GAiV7gJAA9Iy4GyoBKLH2z+N0W3q/CMC2yCCkyajM63Mbc+9z9mfvZD+b071MM23qLC69+j8PvX5HQUDdMC6cL7BOTtQXCJwpas/qHhWIBdYtWGgtDWNttWTmThu701pf1W6+v1Hd8Xbz+k+VQxmv8i7Fv1HZn+g/iv2nRkjzbd6npf/Rkz49DifQ3dLZBBYOJzC4rqgCwsUbmLYlCAUVU4XsCd1NrCeRHcYXb1IJC/RX2hEYCwJTvHYVMZoavbBI09FmU+LiFSzIh0AIXy1mqZiFKaKCmVhiEVJ7GftHZTganUZ56EYLL3FykjhL195MlMM7qxXdmEGDPOG6boRE86UJVPMki+p4H01WLz4Fm78hSdBo5xXy+yfsd3bpbXny1SA1M8c82fgcMyW66L75/hmXtN44a120ktDPOL+h1bL1HCPsA42DaPdwge3HcO/TOCb2ZumQJtA15Yl65Crg84S+BdfPtL6lezY8C3GkZ7L6Bc1zNR0=)

如果需要，你也可以使用对象形式分别指定进入和离开的时长：

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### 性能注意事项 {#performance-considerations}

你可能会注意到，上面展示的动画大多使用了 `transform` 和 `opacity` 之类的属性。这些属性之所以高效，是因为：

1. 它们不会在动画过程中影响文档布局，因此不会在每一帧动画中触发昂贵的 CSS 布局计算。

2. 大多数现代浏览器在对 `transform` 进行动画时都可以利用 GPU 硬件加速。

相比之下，像 `height` 或 `margin` 这样的属性会触发 CSS 布局，因此动画成本要高得多，使用时应当谨慎。

## JavaScript 钩子 {#javascript-hooks}

你可以通过监听 `<Transition>` 组件上的事件，使用 JavaScript 介入过渡过程：

```vue-html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// 在元素插入 DOM 之前调用。
// 用于设置元素的 "enter-from" 状态
function onBeforeEnter(el) {}

// 在元素插入后的一帧调用。
// 用于开始进入动画。
function onEnter(el, done) {
  // 调用 done 回调以表示过渡结束
  // 与 CSS 结合使用时可选
  done()
}

// 在进入过渡完成时调用。
function onAfterEnter(el) {}

// 在进入过渡于完成前被取消时调用。
function onEnterCancelled(el) {}

// 在离开钩子之前调用。
// 大多数情况下，你只需要使用 leave 钩子
function onBeforeLeave(el) {}

// 在离开过渡开始时调用。
// 用于开始离开动画。
function onLeave(el, done) {
  // 调用 done 回调以表示过渡结束
  // 与 CSS 结合使用时可选
  done()
}

// 在离开过渡完成且
// 元素已从 DOM 中移除时调用。
function onAfterLeave(el) {}

// 仅在 v-show 过渡中可用
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // 在元素插入 DOM 之前调用。
    // 用于设置元素的 "enter-from" 状态
    onBeforeEnter(el) {},

    // 在元素插入后的一帧调用。
    // 用于开始动画。
    onEnter(el, done) {
      // 调用 done 回调以表示过渡结束
      // 与 CSS 结合使用时可选
      done()
    },

    // 在进入过渡完成时调用。
    onAfterEnter(el) {},

    // 在进入过渡于完成前被取消时调用。
    onEnterCancelled(el) {},

    // 在离开钩子之前调用。
    // 大多数情况下，你只需要使用 leave 钩子。
    onBeforeLeave(el) {},

    // 在离开过渡开始时调用。
    // 用于开始离开动画。
    onLeave(el, done) {
      // 调用 done 回调以表示过渡结束
      // 与 CSS 结合使用时可选
      done()
    },

    // 在离开过渡完成且
    // 元素已从 DOM 中移除时调用。
    onAfterLeave(el) {},

    // 仅在 v-show 过渡中可用
    onLeaveCancelled(el) {}
  }
}
```

</div>

这些钩子可以与 CSS 过渡 / 动画结合使用，也可以单独使用。

当使用仅 JavaScript 的过渡时，通常最好添加 `:css="false"` 属性。这会明确告诉 Vue 跳过自动 CSS 过渡检测。除了性能会稍微更好一些之外，这也可以防止 CSS 规则意外干扰过渡：

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

使用 `:css="false"` 时，我们还需要完全负责控制过渡何时结束。在这种情况下，`@enter` 和 `@leave` 钩子都需要 `done` 回调。否则，这些钩子会同步调用，过渡会立即完成。

这里有一个使用 [GSAP 库](https://gsap.com/) 执行动画的演示。当然，你也可以使用任何你想要的其他动画库，例如 [Anime.js](https://animejs.com/) 或 [Motion One](https://motion.dev/)：

<JsHooks />

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqNVMtu2zAQ/JUti8I2YD3i1GigKmnaorcCveTQArpQFCWzlkiCpBwHhv+9Sz1qKYckJ3FnlzvD2YVO5KvW4aHlJCGpZUZoB5a7Vt9lUjRaGQcnMLyEM5RGNbDA0sX/VGWpHnB/xEQmmZIWe+zUI9z6m0tnWr7ymbKVzAklQclvvFSG/5COmyWvV3DKJHTdQiRHZN0jAJbRmv9OIA432/UE+jODlKZMuKcErnx8RrazP8woR7I1FEryKaVTU8aiNdRfwWZTQtQwi1HAGF/YB4BTyxNY8JpaJ1go5K/WLTfhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>

## 可复用过渡 {#reusable-transitions}

过渡可以通过 Vue 的组件系统进行复用。要创建一个可复用过渡，我们可以创建一个组件来包裹 `<Transition>` 组件，并向下传递插槽内容：

```vue{6} [MyTransition.vue]
<script>
// JavaScript 钩子逻辑...
</script>

<template>
  <!-- 包裹内置的 Transition 组件 -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- 向下传递插槽内容 -->
  </Transition>
</template>

<style>
/*
  必要的 CSS...
  注意：这里避免使用 <style scoped>，因为它
  不适用于插槽内容。
*/
</style>
```

现在可以像使用内置版本一样导入并使用 `MyTransition`：

```vue-html
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
```

## 出现时过渡 {#transition-on-appear}

如果你还想对节点的初始渲染应用过渡，可以添加 `appear` 属性：

```vue-html
<Transition appear>
  ...
</Transition>
```

## 元素间过渡 {#transition-between-elements}

除了使用 `v-if` / `v-show` 切换元素之外，我们还可以使用 `v-if` / `v-else` / `v-else-if` 在两个元素之间过渡，只要我们确保在任何时刻只显示一个元素即可：

```vue-html
<Transition>
  <button v-if="docState === 'saved'">编辑</button>
  <button v-else-if="docState === 'edited'">保存</button>
  <button v-else-if="docState === 'editing'">取消</button>
</Transition>
```

<BetweenElements />

[在 Playground 中试试](https://play.vuejs.org/#eNqdk8tu2zAQRX9loI0SoLLcFN2ostEi6BekmwLa0NTYJkKRBDkSYhj+9wxJO3ZegBGu+Lhz7syQ3Bd/nJtNIxZN0QbplSMISKNbdkYNznqCPXhcwwHW3g5QsrTsTGekNYGgt/KBBCEsouimDGLCvrztTFtnGGN4QTg4zbK4ojY4YSDQTuOiKwbhN8pUXm221MDd3D11xfJeK/kIZEHupEagrbfjZssxzAgNs5nALIC2VxNILUJg1IpMxWmRUAY9U6IZ2/3zwgRFyhowYoieQaseq9ElDaTRrkYiVkyVWrPiXNdiAcequuIkPo3fMub5Sg4l9oqSevmXZ22dwR8YoQ74kdsL4Go7ZTbR74HT/KJfJlxleGrG8l4YifqNYVuf251vqOYr4llbXz4C06b75+ns1a3BPsb0KrBy14Aymnerlbby8Vc8cTajG35uzFITpu0t5ufzHQdeH6LBsezEO0eJVbB6pBiVVLPTU6jQEPpKyMj8dnmgkQs+HmQcvVTIQK1hPrv7GQAFt9eO9Bk6fZ8Ub52Qiri8eUo+4dbWD02exh79v/nBP+H2PStnwz/jelJ1geKvk/peHJ4BoRZYow==)

## 过渡模式 {#transition-modes}

在前面的例子中，进入和离开的元素是同时播放动画的，因此我们不得不将它们设为 `position: absolute`，以避免当两个元素同时存在于 DOM 中时产生布局问题。

不过，在某些情况下这并不可行，或者说并不是我们想要的行为。我们可能希望先让离开的元素完成动画，再让进入的元素在离开动画完成**之后**才插入。如果手动协调这类动画会非常复杂——幸运的是，我们可以通过给 `<Transition>` 传入 `mode` 属性来启用这种行为：

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

下面是使用 `mode="out-in"` 的前一个演示：

<BetweenElements mode="out-in" />

`<Transition>` 也支持 `mode="in-out"`，尽管它的使用频率要低得多。

## 组件间过渡 {#transition-between-components}

`<Transition>` 也可以包裹 [动态组件](/guide/essentials/component-basics#dynamic-components) 使用：

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063vPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqtks9ugzAMxl/F4tJNamGXXVhWqewVduSSgStFCkkUDFpV9d0XJyn9t8MOkxBg5/Pvi+Mci51z5TxhURdi7LxytG2NGpz1BB92cDvYezvAqqxixNLVjaC5ETRZ0Br8jpIe93LSBMfWAHRBYQ0aGms4Jvw6Q05rFvSS5NNzEgN4pMmbcwQgO1Izsj5CalhFRLDj1RN/wis8olpaCQHh4LQk5IiEll+owy+XCGXcREAHh+9t4WWvbFvAvBlsjzpk7gx5TeqJtdG4LbawY5KoLtR/NGjYoHkw+PTSjIqUNWDkwOK97DHUMjVEdqKNMqE272E5dajV+JvpVlSLJllUF4+QENX1ERox0kHzb8m+m1CEfpOgYYgpqVHOmJNpgLQQa7BOdooO8FK+joByxLc4tlsiX6s7HtnEyvU1vKTCMO+4pWKdBnO+0FfbDk31as5HsvR+Hl9auuozk+J1/hspz+mRdPoBYtonzg==)

</div>

## 动态过渡 {#dynamic-transitions}

像 `name` 这样的 `<Transition>` 属性也可以是动态的！它允许我们根据状态变化动态应用不同的过渡效果：

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

当你使用 Vue 的过渡类约定定义了 CSS 过渡 / 动画，并且想在它们之间切换时，这会很有用。

你也可以根据组件的当前状态，在 JavaScript 过渡钩子中应用不同的行为。最后，创建动态过渡的终极方式是通过[可复用过渡组件](#reusable-transitions)，它们接受 props 来改变所使用过渡的性质。听起来可能有点老套，但真正的限制其实只有你的想象力。

## 带有 Key 属性的过渡 {#transitions-with-the-key-attribute}

有时你需要强制某个 DOM 元素重新渲染，才能触发过渡效果。

以这个计数器组件为例：

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);

setInterval(() => count.value++, 1000);
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 1,
      interval: null 
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.count++;
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>

如果我们省略了 `key` 属性，只有文本节点会被更新，因此不会发生过渡。然而，有了 `key` 属性后，Vue 就知道每当 `count` 改变时都创建一个新的 `span` 元素，因此 `Transition` 组件就有了两个不同的元素之间可以进行过渡。

<div class="composition-api">

[在 Playground 中尝试](https://play.vuejs.org/#eNp9UsFu2zAM/RVCl6Zo4nhYd/GcAtvQQ3fYhq1HXTSFydTKkiDJbjLD/z5KMrKgLXoTHx/5+CiO7JNz1dAja1gbpFcuQsDYuxtuVOesjzCCxx1MsPO2gwuiXnzkhhtpTYggbW8ibBJlUV/mBJXfmYh+EHqxuITNDYzcQGFWBPZ4dUXEaQnv6jrXtOuiTJoUROycFhEpAmi3agCpRQgbzp68cA49ZyV174UJKiprckxIcMJA84hHImc9oo7jPOQ0kQ4RSvH6WXW7JiV6teszfQpDPGqEIK3DLSGpQbazsyaugvqLDVx77JIhbqp5wsxwtrRvPFI7NWDhEGtYYVrQSsgELzOiUQw4I2Vh8TRgA9YJqeIR6upDABQh9TpTAPE7WN3HlxLp084Foi3N54YN1KWEVpOMkkO2ZJHsmp3aVw/BGjqMXJE22jml0X93STRw1pReKSe0tk9fMxZ9nzwVXP5B+fgK/hAOCePsh8dAt4KcnXJR+D3S16X07a9veKD3KdnZba+J/UbyJ+Zl0IyF9rk3Wxr7jJenvcvnrcz+PtweItKuZ1Np0MScMp8zOvkvb1j/P+776jrX0UbZ9A+fYSTP)

</div>
<div class="options-api">

[在 Playground 中尝试](https://play.vuejs.org/#eNp9U8tu2zAQ/JUFTwkSyw6aXlQ7QB85pIe2aHPUhZHWDhOKJMiVYtfwv3dJSpbbBgEMWJydndkdUXvx0bmi71CUYhlqrxzdVAa3znqCBtey0wT7ygA0kuTZeX4G8EidN+MJoLadoRKuLkdAGULfS12C6bSGDB/i3yFx2tiAzaRIjyoUYxesICDdDaczZq1uJrNETY4XFx8G5Uu4WiwW55PBA66txy8YyNvdZFNrlP4o/Jdpbq4M/5bzYxZ8IGydloR8Alg2qmcVGcKqEi9eOoe+EqnExXsvTVCkrBkQxoKTBspn3HFDmprp+32ODA4H9mLCKDD/R2E5Zz9+Ws5PpuBjoJ1GCLV12DASJdKGa2toFtRvLOHaY8vx8DrFMGdiOJvlS48sp3rMHGb1M4xRzGQdYU6REY6rxwHJGdJxwBKsk7WiHSyK9wFQhqh14gDyIVjd0f8Wa2/bUwOyWXwQLGGRWzicuChvKC4F8bpmrTbFU7CGL2zqiJm2Tmn03100DZUox5ddCam1ffmaMPJd3Cnj9SPWz6/gT2EbsUr88Bj4VmAljjWSfoP88mL59tc33PLzsdjaptPMfqP4E1MYPGOmfepMw2Of8NK0d238+JTZ3IfbLSFnPSwVB53udyX4q/38xurTuO+K6/Fqi8MffqhR/A==)

</div>

---

**相关内容**

- [`<Transition>` API 参考](/api/built-in-components#transition)
