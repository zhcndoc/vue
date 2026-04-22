# 声明式渲染 {#declarative-rendering}

<div class="sfc">

你在编辑器中看到的是一个 Vue 单文件组件（SFC）。SFC 是一个可复用的、自包含的代码块，它封装了属于同一组件的 HTML、CSS 和 JavaScript，并写在一个 `.vue` 文件中。

</div>

Vue 的核心特性是**声明式渲染**：使用扩展了 HTML 的模板语法，我们可以根据 JavaScript 状态来描述 HTML 应该是什么样子。当状态发生变化时，HTML 会自动更新。

<div class="composition-api">

当某个状态变化时能够触发更新，这个状态就被认为是**响应式**的。我们可以使用 Vue 的 `reactive()` API 来声明响应式状态。由 `reactive()` 创建的对象是 JavaScript [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，它们的工作方式就和普通对象一样：

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` 只能作用于对象（包括数组以及像 `Map` 和 `Set` 这样的内置类型）。另一方面，`ref()` 可以接受任何值类型，并创建一个对象，通过 `.value` 属性暴露内部值：

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

关于 `reactive()` 和 `ref()` 的详细内容会在 <a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">指南 - 响应式基础</a> 中讨论。

<div class="sfc">

在组件的 `<script setup>` 块中声明的响应式状态可以直接在模板中使用。这就是我们如何使用 mustaches 语法，根据 `counter` 对象和 `message` ref 的值来渲染动态文本：

</div>

<div class="html">

传递给 `createApp()` 的对象是一个 Vue 组件。组件的状态应该在它的 `setup()` 函数内部声明，并通过一个对象返回：

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    counter,
    message
  }
}
```

返回对象中的属性将可以在模板中使用。这就是我们如何使用 mustaches 语法，根据 `message` 的值来渲染动态文本：

</div>

```vue-html
<h1>{{ message }}</h1>
<p>Count is: {{ counter.count }}</p>
```

注意在模板中访问 `message` ref 时，我们并不需要使用 `.value`：它会自动解包，从而使用起来更简洁。

</div>

<div class="options-api">

当某个状态变化时能够触发更新，这个状态就被认为是**响应式**的。在 Vue 中，响应式状态保存在组件里。<span class="html">在示例代码中，传递给 `createApp()` 的对象是一个组件。</span>

我们可以使用 `data` 组件选项来声明响应式状态，它应该是一个返回对象的函数：

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

`message` 属性将可以在模板中使用。这就是我们如何使用 mustaches 语法，根据 `message` 的值来渲染动态文本：

```vue-html
<h1>{{ message }}</h1>
```

</div>

mustaches 中的内容不只局限于标识符或路径——我们可以使用任何有效的 JavaScript 表达式：

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

现在，试着自己创建一些响应式状态，并用它为模板中的 `<h1>` 渲染动态文本内容。

</div>

<div class="options-api">

现在，试着自己创建一个 data 属性，并将它用作模板中 `<h1>` 的文本内容。

</div>
