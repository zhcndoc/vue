# 事件监听器 {#event-listeners}

我们可以使用 `v-on` 指令监听 DOM 事件：

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

由于 `v-on` 使用非常频繁，它也有一个简写语法：

```vue-html
<button @click="increment">{{ count }}</button>
```

<div class="options-api">

这里，`increment` 引用的是使用 `methods` 选项声明的函数：

<div class="sfc">

```js{7-12}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // 更新组件状态
      this.count++
    }
  }
}
```

</div>
<div class="html">

```js{7-12}
createApp({
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // 更新组件状态
      this.count++
    }
  }
})
```

</div>

在方法内部，我们可以使用 `this` 访问组件实例。组件实例暴露了由 `data` 声明的数据属性。我们可以通过修改这些属性来更新组件状态。

</div>

<div class="composition-api">

<div class="sfc">

这里，`increment` 引用的是在 `<script setup>` 中声明的函数：

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // 更新组件状态
  count.value++
}
</script>
```

</div>

<div class="html">

这里，`increment` 引用的是 `setup()` 返回对象中的一个方法：

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
    // 更新组件状态
    count.value++
  }

  return {
    count,
    increment
  }
}
```

</div>

在函数内部，我们可以通过修改 refs 来更新组件状态。

</div>

事件处理器也可以使用内联表达式，并且可以借助修饰符简化常见任务。这些细节在 <a target="_blank" href="/guide/essentials/event-handling.html">指南 - 事件处理</a> 中有介绍。

现在，试着自己实现 `increment` <span class="options-api">方法</span><span class="composition-api">函数</span>，并使用 `v-on` 将它绑定到按钮上。
