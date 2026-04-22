<script setup>
import ListBasic from './transition-demos/ListBasic.vue'
import ListMove from './transition-demos/ListMove.vue'
import ListStagger from './transition-demos/ListStagger.vue'
</script>

# TransitionGroup {#transitiongroup}

`<TransitionGroup>` 是一个内置组件，专为列表中元素或组件的插入、移除以及顺序变化的动画而设计。

## 与 `<Transition>` 的区别 {#differences-from-transition}

`<TransitionGroup>` 支持与 `<Transition>` 相同的 props、CSS 过渡类以及 JavaScript 钩子监听器，但有以下区别：

- 默认情况下，它不会渲染包装元素。不过你可以通过 `tag` prop 指定要渲染的元素。

- [过渡模式](./transition#transition-modes) 不可用，因为我们不再在互斥元素之间切换。

- 内部元素**始终必须**具有唯一的 `key` 属性。

- CSS 过渡类会应用到列表中的单个元素上，**而不是**应用到整个组 / 容器本身。

:::tip
当在 [DOM 内模板](/guide/essentials/component-basics#in-dom-template-parsing-caveats) 中使用时，应将其写为 `<transition-group>`。
:::

## 进入 / 离开过渡 {#enter-leave-transitions}

下面是一个使用 `<TransitionGroup>` 为 `v-for` 列表应用进入 / 离开过渡的示例：

```vue-html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

<ListBasic />

## 移动过渡 {#move-transitions}

上面的演示有一些明显的问题：当某个项目被插入或移除时，它周围的项目会瞬间“跳”到位，而不是平滑移动。我们可以通过添加一些额外的 CSS 规则来修复它：

```css{1,13-17}
.list-move, /* 将过渡应用到正在移动的元素 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保离开的项目被移出布局流，以便
   正确计算移动动画。 */
.list-leave-active {
  position: absolute;
}
```

现在看起来好多了——即使整个列表被打乱时也能平滑地执行动画：

<ListMove />

[完整示例](/examples/#list-transition)

### 自定义 TransitionGroup 类名 {#custom-transitiongroup-classes}

你也可以通过向 `<TransitionGroup>` 传递 `moveClass` prop 来为移动元素指定自定义过渡类，就像在 `<Transition>` 上使用[自定义过渡类](/guide/built-ins/transition.html#custom-transition-classes)一样。

## 列表过渡的交错动画 {#staggering-list-transitions}

通过借助数据属性与 JavaScript 过渡进行通信，也可以在列表中实现交错过渡。首先，我们将项目的索引渲染为 DOM 元素上的一个数据属性：

```vue-html{11}
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

然后，在 JavaScript 钩子中，我们根据该数据属性设置延迟来为元素添加动画。此示例使用 [GSAP 库](https://gsap.com/) 来执行动画：

```js{5}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```

<ListStagger />

<div class="composition-api">

[Playground 中的完整示例](https://play.vuejs.org/#eNqlVMuu0zAQ/ZVRNklRm7QLWETtBW4FSFCxYkdYmGSSmjp28KNQVfl3xk7SFyvEponPGc+cOTPNOXrbdenRYZRHa1Nq3lkwaF33VEjedkpbOIPGeg6lajtnsYIeaq1aiOlSfAlqDOtG3L8SUchSSWNBcPrZwNdCAqVqTZND/KxdibBDjKGf3xIfWXngCNs9k4/Udu/KA3xWWnPz1zW0sOOP6CcnG3jv9ImIQn67SvrpUJ9IE/WVxPHsSkw97gbN0zFJZrB5grNPrskcLUNXac2FRZ0k3GIbIvxLSsVTq3bqF+otM5jMUi5L4So0SSicHplwOKOyfShdO1lariQo+Yy10vhO+qwoZkNFFKmxJ4Gp6ljJrRe+vMP3yJu910swNXqXcco1h0pJHDP6CZHEAAcAYMydwypYCDAkJRdX6Sts4xGtUDAKotIVs9Scpd4q/A0vYJmuXo5BSm7JOIEW81DVo77VR207ZEf8F23LB23T+X9VrbNh82nn6UAz7ASzSCeANZe0AnBctIqqbIoojLCIIBvoL5pJw31DH7Ry3VDKsoYinSii4ZyXxhBQM2Fwwt58D7NeoB8QkXfDvwRd2XtceOsCHkwc8KCINAk+vADJppQUFjZ0DsGVGT3uFn1KSjoPeKLoaYtvCO/rIlz3vH9O5FiU/nXny/pDT6YGKZngg0/Zg1GErrMbp6N5NHxJFi3N/4dRkj5IYf5ULxCmiPJpI4rIr4kHimhvbWfyLHOyOzQpNZZ57jXNy4nRGFLTR/0fWBqe7w==)

</div>
<div class="options-api">

[Playground 中的完整示例](https://play.vuejs.org/#eNqtVE2P0zAQ/SujXNqgNmkPcIjaBbYCJKg4cSMcTDJNTB07+KNsVfW/M3aabNpyQltViT1vPPP8Zian6H3bJgeHURatTKF5ax9yyZtWaQuVYS3stGpg4peTXOayUNJYEJwea/ieS4ATNKbKYPKoXYGwRZzAeTYGPrNizxE2NZO30KZ2xR6+Kq25uTuGFrb81vrFyQo+On0kIJc/PCV8CmxL3DEnLJy8e8ksm8bdGkCjdVr2O4DfDvWRgtGN/JYC0SOkKVTTOotl1jv3hi3d+DngENILkey4sKinU26xiWH9AH6REN/Eqq36g3rDDE7jhMtCuBLN1NbcJIFEHN9RaNDWqjQDAyUfcac0fpA+CYoRCRSJsUeBiWpZwe2RSrK4w2rkVe2rdYG6LD5uH3EGpZI4iuurTdwDNBjpRJclg+UlhP914UnMZfIGm8kIKVEwciYivhoGLQlQ4hO8gkWyfD1yVHJDKgu0mAUmPXLuxRkYb5Ed8H8YL/7BeGx7Oa6hkLmk/yodBoo21BKtYBZpB7DikroKDvNGUeZ1HoVmyCNIO/ibZtJwy5X8pJVru9CWVeTpRB51+6wwhgw7Jgz2tnc/Q6/M0ZeWwKvmGZye0Wu78PIGexC6swdGxEnw/q6HOYUkt9DwMwhKxfS6GpY+KPHc45G8+6EYAV7reTjucf/uwUtSmvvTME1wDuISlVTwTqf0RiiyrtKR0tEs6r5l84b645dRkr5zoT8oXwBMHg2Tlke+jbwhj2prW5OlqZPtvkroYqnH3lK9nLgI46scnf8Cn22kBA==)

</div>

---

**相关内容**

- [`<TransitionGroup>` API 参考](/api/built-in-components#transitiongroup)
