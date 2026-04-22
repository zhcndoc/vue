<script setup>
import ElasticHeader from './demos/ElasticHeader.vue'
import DisabledButton from './demos/DisabledButton.vue'
import Colors from './demos/Colors.vue'
import AnimateWatcher from './demos/AnimateWatcher.vue'
</script>

# 动画技巧 {#animation-techniques}

Vue 提供了 [`<Transition>`](/guide/built-ins/transition) 和 [`<TransitionGroup>`](/guide/built-ins/transition-group) 组件，用于处理进入 / 离开和列表过渡。然而，在网页中使用动画还有许多其他方式，即使是在 Vue 应用中也是如此。这里我们将讨论一些额外的技巧。

## 基于类的动画 {#class-based-animations}

对于那些不会进入 / 离开 DOM 的元素，我们可以通过动态添加一个 CSS 类来触发动画：

<div class="composition-api">

```js
const disabled = ref(false)

function warnDisabled() {
  disabled.value = true
  setTimeout(() => {
    disabled.value = false
  }, 1500)
}
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      disabled: false
    }
  },
  methods: {
    warnDisabled() {
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 1500)
    }
  }
}
```

</div>

```vue-html
<div :class="{ shake: disabled }">
  <button @click="warnDisabled">点击我</button>
  <span v-if="disabled">此功能已禁用！</span>
</div>
```

```css
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
```

<DisabledButton />

## 由状态驱动的动画 {#state-driven-animations}

某些过渡效果可以通过插值实现，例如在交互发生时为元素绑定一个样式。以下就是一个例子：

<div class="composition-api">

```js
const x = ref(0)

function onMousemove(e) {
  x.value = e.clientX
}
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      x: 0
    }
  },
  methods: {
    onMousemove(e) {
      this.x = e.clientX
    }
  }
}
```

</div>

```vue-html
<div
  @mousemove="onMousemove"
  :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
  class="movearea"
>
  <p>在这个 div 上移动你的鼠标...</p>
  <p>x: {{ x }}</p>
</div>
```

```css
.movearea {
  transition: 0.3s background-color ease;
}
```

<Colors />

除了颜色之外，你还可以使用样式绑定来为 transform、width 或 height 添加动画。你甚至可以使用弹簧物理来为 SVG 路径添加动画——毕竟，它们本质上都是属性数据绑定：

<ElasticHeader />

## 使用 Watcher 进行动画 {#animating-with-watchers}

只要稍微发挥一点创造力，我们就可以使用 watcher 来基于某些数值状态为任何内容添加动画。例如，我们可以为数字本身添加动画：

<div class="composition-api">

```js
import { ref, reactive, watch } from 'vue'
import gsap from 'gsap'

const number = ref(0)
const tweened = reactive({
  number: 0
})

// 注意：对于大于 Number.MAX_SAFE_INTEGER（9007199254740991）的输入，
// 由于 JavaScript 数字精度的限制，结果可能不准确。
watch(number, (n) => {
  gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 })
})
```

```vue-html
输入一个数字：<input v-model.number="number" />
<p>{{ tweened.number.toFixed(0) }}</p>
```

</div>
<div class="options-api">

```js
import gsap from 'gsap'

export default {
  data() {
    return {
      number: 0,
      tweened: 0
    }
  },
  // 注意：对于大于 Number.MAX_SAFE_INTEGER（9007199254740991）的输入，
  // 由于 JavaScript 数字精度的限制，结果可能不准确。
  watch: {
    number(n) {
      gsap.to(this, { duration: 0.5, tweened: Number(n) || 0 })
    }
  }
}
```

```vue-html
输入一个数字：<input v-model.number="number" />
<p>{{ tweened.toFixed(0) }}</p>
```

</div>

<AnimateWatcher />

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNpNUstygzAM/BWNLyEzBDKd6YWSdHrpsacefSGgJG7xY7BImhL+vTKv9ILllXYlr+jEm3PJpUWRidyXjXIEHql1e2mUdrYh6KDBY8yfoiR1wRiuBZVn6OHYWA0r5q6W2pMv3ISHkBPSlNZ4AtPqAzawC2LRdj3DdEU0WA34qB910sBUnsFWmp6LpRmaRo9UHMLIrGG3h4EBQ/OEbDRpxjx51TYFKWtYKHmOF9WP4Qzs+x22EDoA9NLwmaejC/x+vhBqVxeEfAPIK3WBsi6830lRobZSDDjA580hFIt8roxrCS4bbSuskxFmzhhIAenEy92id1CnzZzfd91szETmZ72rH6zYOej7PA3rYXrKE3GUp//m5KunWx3C5CE6enS0hjZXVKczZXCwdfWyoF79YgZPqBliJ9iGSUTEYlzuRrO9X94a/lUGNTklvBTZvAMpwhYCIMWZyPksTVvjvk9JaXUacq9sSlujFJPnvej/AElH3FQ=)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNpNUctugzAQ/JWVLyESj6hSL5Sm6qXHnnr0xYENuAXbwus8Svj3GlxIJEvendHMvgb2bkx6cshyVtiyl4b2XMnO6J6gtsLAsdcdbKZwwxVXeJmpCo/CtQQDVwCVIBFtQwzQI7leLRmAct0B+xx28YLQGVFh5aGAjNM3zvRZUNnkizhII7V6w9xTSjqiRtoYBqhcL0hq5c3S5/hu/blKbzfYwbh9LMWVf0W2zusTws60gnDK6OtqEMTaeSGVcQSnpNMVtmmAXzkLAWeQzarCQNkKaz1zkHWysPthWNryjX/IC1bRbgvjWGTG64rssbQqLF3bKUzvHmH6o1aUnFHWDeVw0G31sqJW/mIOT9h5KEw2m7CYhUsmnV/at9XKX3n24v+E5WxdNmfTbieAs4bI2DzLnDI/dVrqLpu4Nz+/a5GzZYls/AM3dcFx)

</div>
