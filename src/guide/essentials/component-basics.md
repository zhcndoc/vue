# 组件基础 {#components-basics}

<ScrimbaLink href="https://scrimba.com/links/vue-component-basics" title="免费 Vue.js 组件基础课程" type="scrimba">
  在 Scrimba 上观看交互式视频课程
</ScrimbaLink>

组件让我们能够将 UI 拆分为独立且可复用的部分，并以孤立的方式思考每一部分。一个应用通常会被组织成一个嵌套组件的树：

![组件树](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

这与我们嵌套原生 HTML 元素的方式非常相似，但 Vue 实现了自己的组件模型，使我们能够在每个组件中封装自定义内容和逻辑。Vue 也能很好地与原生 Web Components 协同工作。如果你对 Vue 组件与原生 Web Components 之间的关系感兴趣，[请在这里阅读更多](/guide/extras/web-components)。

## 定义组件 {#defining-a-component}

在使用构建步骤时，我们通常会在一个专门的文件中使用 `.vue` 扩展名来定义每个 Vue 组件——这被称为 [单文件组件](/guide/scaling-up/sfc)（简称 SFC）：

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
  <button @click="count++">你点击了我 {{ count }} 次。</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">你点击了我 {{ count }} 次。</button>
</template>
```

</div>

在不使用构建步骤时，Vue 组件可以被定义为一个包含 Vue 特定选项的普通 JavaScript 对象：

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      你点击了我 {{ count }} 次。
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      你点击了我 {{ count }} 次。
    </button>`
  // 也可以指定一个 in-DOM 模板：
  // template: '#my-template-element'
}
```

</div>

这里的模板是以内联 JavaScript 字符串的形式写入的，Vue 会即时编译它。你也可以使用指向某个元素的 ID 选择器（通常是原生 `<template>` 元素）——Vue 会将其内容作为模板来源。

上面的示例定义了一个单独的组件，并将其作为 `.js` 文件的默认导出导出，但你也可以使用具名导出从同一个文件中导出多个组件。

## 使用组件 {#using-a-component}

:::tip
在本指南的其余部分，我们将使用 SFC 语法——无论你是否使用构建步骤，组件相关的概念都是相同的。[示例](/examples/) 部分展示了这两种场景下的组件用法。
:::

要使用子组件，我们需要先在父组件中导入它。假设我们把计数组件放在一个名为 `ButtonCounter.vue` 的文件中，该组件将作为该文件的默认导出暴露出来：

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>这里有一个子组件！</h1>
  <ButtonCounter />
</template>
```

要把导入的组件暴露给我们的模板，我们需要用 `components` 选项对它进行[注册](/guide/components/registration)。然后，该组件就可以通过其注册时使用的键名作为标签使用。

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>这里有一个子组件！</h1>
  <ButtonCounter />
</template>
```

使用 `<script setup>` 时，导入的组件会自动在模板中可用。

</div>

也可以全局注册组件，使其在给定应用中的所有组件里都可用，而无需导入它。全局注册与局部注册的优缺点会在专门的 [组件注册](/guide/components/registration) 部分讨论。

组件可以按你需要的次数重复使用：

```vue-html
<h1>这里有很多子组件！</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>

注意，当点击按钮时，每个按钮都会维护自己独立的 `count`。这是因为每次使用组件时，都会创建一个新的**实例**。

在 SFC 中，建议子组件使用 `PascalCase` 标签名，以便与原生 HTML 元素区分开来。虽然原生 HTML 标签名是不区分大小写的，但 Vue SFC 是一种编译格式，因此我们可以在其中使用区分大小写的标签名。我们也可以使用 `/>` 来闭合标签。

如果你直接在 DOM 中编写模板（例如作为原生 `<template>` 元素的内容），那么模板将受到浏览器原生 HTML 解析行为的影响。在这种情况下，你需要为组件使用 `kebab-case` 和显式的结束标签：

```vue-html
<!-- 如果这个模板写在 DOM 中 -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

更多细节请参见 [in-DOM 模板解析注意事项](#in-dom-template-parsing-caveats)。

## 传递 Props {#passing-props}

如果我们正在构建一个博客，就很可能需要一个表示博客文章的组件。我们希望所有博客文章都共享相同的视觉布局，但内容不同。这样的组件只有在你能向它传递数据时才有用，比如我们想要显示的特定文章的标题和内容。这就是 props 的作用。

Props 是你可以在组件上注册的自定义属性。要向我们的博客文章组件传递标题，我们必须在该组件接受的 props 列表中声明它，使用 <span class="options-api">[`props`](/api/options-state#props) 选项</span><span class="composition-api">[`defineProps`](/guide/typescript/composition-api#typing-component-props) 宏</span>：

<div class="options-api">

```vue [BlogPost.vue]
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

当一个值被传递给某个 prop 属性时，它会成为该组件实例上的一个属性。该属性的值可以在模板中以及组件的 `this` 上下文中访问，就像任何其他组件属性一样。

</div>
<div class="composition-api">

```vue [BlogPost.vue]
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` 是一个编译时宏，只能在 `<script setup>` 内部使用，并且不需要显式导入。已声明的 props 会自动暴露给模板。`defineProps` 还会返回一个对象，其中包含传递给组件的所有 props，因此我们在需要时可以在 JavaScript 中访问它们：

```js
const props = defineProps(['title'])
console.log(props.title)
```

另请参见：[组件 Props 类型标注](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

如果你没有使用 `<script setup>`，则应使用 `props` 选项来声明 props，而 props 对象会作为第一个参数传递给 `setup()`：

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

一个组件可以拥有任意多个 props，默认情况下，任何值都可以传递给任何 prop。

一旦某个 prop 被注册，就可以像这样把数据作为自定义属性传给它：

```vue-html
<BlogPost title="我与 Vue 的旅程" />
<BlogPost title="使用 Vue 写博客" />
<BlogPost title="为什么 Vue 如此有趣" />
```

不过，在典型应用中，你的父组件里很可能会有一个文章数组：

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: '我与 Vue 的旅程' },
        { id: 2, title: '使用 Vue 写博客' },
        { id: 3, title: '为什么 Vue 如此有趣' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: '我与 Vue 的旅程' },
  { id: 2, title: '使用 Vue 写博客' },
  { id: 3, title: '为什么 Vue 如此有趣' }
])
```

</div>

然后你会想要使用 `v-for` 为每一项渲染一个组件：

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

注意，传递动态 prop 值时使用了 [`v-bind` 语法](/api/built-in-directives#v-bind)（`:title="post.title"`）。当你事先不知道要渲染的确切内容时，这尤其有用。

关于 props，目前你只需要了解这些；但在你读完本页并对其内容感到熟悉之后，我们建议你之后再回来阅读关于 [Props](/guide/components/props) 的完整指南。

## 监听事件 {#listening-to-events}

随着我们开发 `<BlogPost>` 组件，某些功能可能需要向上传递给父组件。例如，我们可能会决定加入一个无障碍功能，让博客文章的文字变大，同时让页面其余部分保持默认大小。

在父组件中，我们可以通过添加一个 `postFontSize` <span class="options-api">data 属性</span><span class="composition-api">ref</span> 来支持这个功能：

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

它可以在模板中用于控制所有博客文章的字体大小：

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

现在让我们在 `<BlogPost>` 组件的模板中添加一个按钮：

```vue{5} [BlogPost.vue]
<!-- 省略 <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>放大文字</button>
  </div>
</template>
```

这个按钮目前还没有任何作用——我们希望点击这个按钮时，通知父组件它应该放大所有文章的文字。为了解决这个问题，组件提供了一个自定义事件系统。父组件可以像监听原生 DOM 事件一样，使用 `v-on` 或 `@` 监听子组件实例上的任意事件：

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

然后子组件可以通过调用内置的 [**`$emit`** 方法](/api/component-instance#emit) 并传入事件名，在自身上触发一个事件：

```vue{5} [BlogPost.vue]
<!-- 省略 <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">放大文字</button>
  </div>
</template>
```

多亏了 `@enlarge-text="postFontSize += 0.1"` 这个监听器，父组件会接收到该事件并更新 `postFontSize` 的值。

<div class="options-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

我们可以选择性地使用 <span class="options-api">[`emits`](/api/options-state#emits) 选项</span><span class="composition-api">[`defineEmits`](/guide/typescript/composition-api#typing-component-emits) 宏</span> 声明要触发的事件：

<div class="options-api">

```vue{4} [BlogPost.vue]
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{3} [BlogPost.vue]
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

这会记录组件会触发的所有事件，并且可以选择性地[验证它们](/guide/components/events#events-validation)。它还允许 Vue 避免将这些事件隐式地作为原生监听器应用到子组件根元素上。

<div class="composition-api">

与 `defineProps` 类似，`defineEmits` 只能在 `<script setup>` 中使用，并且不需要导入。它会返回一个与 `$emit` 方法等价的 `emit` 函数。它可以用于在组件的 `<script setup>` 部分触发事件，因为在那里无法直接访问 `$emit`：

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

另见：[组件事件的类型标注](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

如果你没有使用 `<script setup>`，也可以使用 `emits` 选项声明要触发的事件。你可以通过 setup 上下文的一个属性访问 `emit` 函数（它作为第二个参数传入 `setup()`）：

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

到目前为止，你只需要了解这些自定义组件事件的内容。不过，在你读完这一页并对其内容感到熟悉之后，我们建议你之后再回来阅读完整的[自定义事件](/guide/components/events)指南。

## 使用插槽分发内容 {#content-distribution-with-slots}

就像 HTML 元素一样，能够向组件传递内容通常很有用，例如这样：

```vue-html
<AlertBox>
  Something bad happened.
</AlertBox>
```

它可能会渲染成这样：

:::danger 这是一个用于演示目的的错误
Something bad happened.
:::

这可以通过 Vue 的自定义 `<slot>` 元素来实现：

```vue{4} [AlertBox.vue]
<template>
  <div class="alert-box">
    <strong>这是一个用于演示目的的错误</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

正如上面所见，我们使用 `<slot>` 作为内容插入位置的占位符——就是这样。完成了！

<div class="options-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[在 Playground 中试一试](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

到目前为止，你只需要了解这些插槽的内容。不过，在你读完这一页并对其内容感到熟悉之后，我们建议你之后再回来阅读完整的[插槽](/guide/components/slots)指南。

## 动态组件 {#dynamic-components}

有时候，在多个组件之间动态切换会很有用，比如在一个标签页界面中：

<div class="options-api">

[在 Playground 中打开示例](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[在 Playground 中打开示例](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

上述功能可以通过 Vue 的带有特殊 `is` 属性的 `<component>` 元素来实现：

<div class="options-api">

```vue-html
<!-- 当 currentTab 变化时，组件也会随之变化 -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- 当 currentTab 变化时，组件也会随之变化 -->
<component :is="tabs[currentTab]"></component>
```

</div>

在上面的示例中，传给 `:is` 的值可以是以下两者之一：

- 已注册组件的名称字符串，或者
- 实际导入的组件对象

你也可以使用 `is` 属性来创建普通 HTML 元素。

在使用 `<component :is="...">` 在多个组件之间切换时，被切换掉的组件会被卸载。我们可以使用内置的 [`<KeepAlive>` 组件](/guide/built-ins/keep-alive)让非 सक्रिय组件保持“存活”。

## DOM 内模板解析的注意事项 {#in-dom-template-parsing-caveats}

如果你直接在 DOM 中编写 Vue 模板，Vue 就需要从 DOM 中获取模板字符串。这会由于浏览器原生 HTML 解析行为而带来一些注意事项。

:::tip
需要注意的是，下面讨论的限制只适用于你直接在 DOM 中编写模板的情况。若你使用的是来自以下来源的字符串模板，则不适用：

- 单文件组件
- 内联模板字符串（例如 `template: '...'`）
- `<script type="text/x-template">`
  :::

### 大小写不敏感 {#case-insensitivity}

HTML 标签和属性名对大小写不敏感，因此浏览器会把所有大写字符都解释为小写。这意味着，当你使用 DOM 内模板时，PascalCase 组件名和 camelCased 的 prop 名称或 `v-on` 事件名都需要使用它们对应的 kebab-case（连字符分隔）形式：

```js
// JavaScript 中使用 camelCase
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- HTML 中使用 kebab-case -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### 自闭合标签 {#self-closing-tags}

在前面的代码示例中，我们一直为组件使用自闭合标签：

```vue-html
<MyComponent />
```

这是因为 Vue 的模板解析器会将 `/>` 视为任何标签结束的标记，而不管它的类型是什么。

不过，在 DOM 内模板中，我们始终必须写出显式的闭合标签：

```vue-html
<my-component></my-component>
```

这是因为 HTML 规范只允许[少数特定元素](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)省略闭合标签，最常见的是 `<input>` 和 `<img>`。对于其他所有元素，如果你省略闭合标签，原生 HTML 解析器会认为你从未结束开始标签。例如，下面这段代码：

```vue-html
<my-component /> <!-- 我们本意是在这里关闭标签... -->
<span>hello</span>
```

会被解析成：

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- 但浏览器会在这里关闭它。 -->
```

### 元素位置限制 {#element-placement-restrictions}

某些 HTML 元素，例如 `<ul>`、`<ol>`、`<table>` 和 `<select>`，对其内部可以出现的元素有限制；而某些元素，例如 `<li>`、`<tr>` 和 `<option>`，只能出现在某些特定的其他元素内部。

当组件与这些带有限制的元素一起使用时，就会引发问题。例如：

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

自定义组件 `<blog-post-row>` 会被当作无效内容而提升到外层，导致最终渲染结果出错。我们可以使用特殊的 [`is` 属性](/api/built-in-special-attributes#is) 作为变通方案：

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
当 `is` 用在原生 HTML 元素上时，其值必须添加 `vue:` 前缀，才能被解释为 Vue 组件。这是为了避免与原生的 [自定义内置元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) 混淆。
:::

到这里，你目前只需要了解这些关于 DOM 内模板解析注意事项的内容——事实上，这也就是 Vue _基础篇_ 的结束。恭喜你！还有很多内容值得学习，但首先，我们建议你先休息一下，自己动手玩一玩 Vue——做点有趣的东西，或者如果你还没看过，可以先看看一些[示例](/examples/)。

当你对刚刚吸收的知识感到熟悉之后，就继续阅读本指南，深入了解组件的更多内容。