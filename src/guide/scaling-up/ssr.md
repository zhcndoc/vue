---
outline: deep
---

# 服务端渲染（SSR） {#server-side-rendering-ssr}

## 概览 {#overview}

### 什么是 SSR？ {#what-is-ssr}

Vue.js 是一个用于构建客户端应用程序的框架。默认情况下，Vue 组件会在浏览器中生成并操作 DOM 作为输出。然而，也可以在服务器上将相同的组件渲染为 HTML 字符串，直接发送到浏览器，最后再将静态标记“激活（hydrate）”为一个完全可交互的客户端应用。

一个服务端渲染的 Vue.js 应用也可以被认为是“同构（isomorphic）”或“通用（universal）”的，因为你的应用大部分代码会同时在服务器**和**客户端运行。

### 为什么使用 SSR？ {#why-ssr}

与客户端单页应用（SPA）相比，SSR 的优势主要体现在：

- **更快的内容呈现时间**：在慢网速或低性能设备上这一点更明显。服务端渲染的标记不需要等到所有 JavaScript 下载并执行完成后才显示，因此用户会更早看到完整渲染的页面。此外，首次访问时的数据获取是在服务端完成的，而服务端通常与数据库的连接比客户端更快。这通常会带来更好的 [Core Web Vitals](https://web.dev/vitals/) 指标、更好的用户体验，并且对于内容呈现时间与转化率直接相关的应用来说，这可能至关重要。

- **统一的心智模型**：你可以在整个应用开发中使用同一种语言和同一种声明式、组件化的心智模型，而不必在后端模板系统和前端框架之间来回切换。

- **更好的 SEO**：搜索引擎爬虫会直接看到完整渲染后的页面。

  :::tip
  截至目前，Google 和 Bing 都可以很好地索引同步的 JavaScript 应用。这里的关键词是“同步”。如果你的应用一开始显示的是加载中的转圈，然后再通过 Ajax 拉取内容，爬虫不会等待你完成。这意味着，如果你在 SEO 很重要的页面上使用异步获取内容，SSR 可能是必要的。
  :::

使用 SSR 也有一些需要权衡的地方：

- 开发约束。特定于浏览器的代码只能在某些生命周期钩子中使用；一些第三方库可能需要特殊处理才能在服务端渲染应用中运行。

- 构建配置和部署要求更复杂。不同于可以部署到任意静态文件服务器的纯静态 SPA，服务端渲染应用需要一个可以运行 Node.js 服务器的环境。

- 更高的服务端负载。在 Node.js 中渲染整个应用会比仅仅提供静态文件更消耗 CPU，因此如果你预期流量很高，就要准备好相应的服务器负载，并合理使用缓存策略。

在为你的应用使用 SSR 之前，你首先应该问自己的是：你是否真的需要它。它主要取决于内容呈现时间对你的应用有多重要。例如，如果你正在构建一个内部仪表盘，首次加载时多花几百毫秒并没有那么重要，那么 SSR 就有些过度了。然而，在内容呈现时间绝对关键的场景下，SSR 可以帮助你获得尽可能好的初始加载性能。

### SSR 与 SSG {#ssr-vs-ssg}

**静态站点生成（SSG）**，也称为预渲染，是另一种流行的构建快速网站的技术。如果服务端渲染某个页面所需的数据对每个用户都相同，那么与其在每次请求到来时都渲染页面，我们可以只在构建过程中提前渲染一次。预渲染页面会被生成并以静态 HTML 文件的形式提供。

SSG 保留了与 SSR 应用相同的性能特征：它能提供很好的内容呈现时间性能。同时，由于输出的是静态 HTML 和资源文件，它比 SSR 应用更便宜，也更容易部署。这里的关键词是**静态**：SSG 只能用于提供静态数据的页面，也就是在构建时已知且在请求之间不会改变的数据。每当数据变化时，都需要进行一次新的部署。

如果你只是为了提升少数营销页面（例如 `/`、`/about`、`/contact` 等）的 SEO 而在研究 SSR，那么你可能更需要 SSG 而不是 SSR。SSG 也非常适合基于内容的网站，例如文档站点或博客。事实上，你现在正在阅读的这个网站就是使用 [VitePress](https://vitepress.dev/) 静态生成的，这是一个由 Vue 驱动的静态站点生成器。

## 基础教程 {#basic-tutorial}

### 渲染一个应用 {#rendering-an-app}

让我们来看一个最简化的 Vue SSR 示例。

1. 创建一个新目录并 `cd` 进入
2. 运行 `npm init -y`
3. 在 `package.json` 中添加 `"type": "module"`，以便 Node.js 以 [ES modules 模式](https://nodejs.org/api/esm.html#modules-ecmascript-modules)运行。
4. 运行 `npm install vue`
5. 创建一个 `example.js` 文件：

```js
// 这段代码运行在服务端的 Node.js 中。
import { createSSRApp } from 'vue'
// Vue 的服务端渲染 API 暴露在 `vue/server-renderer` 下。
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

然后运行：

```sh
> node example.js
```

它应该会在命令行中输出如下内容：

```
<button>1</button>
```

[`renderToString()`](/api/ssr#rendertostring) 接收一个 Vue 应用实例，并返回一个 Promise，该 Promise 会解析为应用渲染后的 HTML。也可以使用 [Node.js Stream API](https://nodejs.org/api/stream.html) 或 [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 进行流式渲染。完整细节请查看 [SSR API 参考](/api/ssr)。

接下来，我们可以把 Vue SSR 代码放入服务端请求处理程序中，用完整的页面 HTML 包裹应用标记。下面的步骤将使用 [`express`](https://expressjs.com/)：

- 运行 `npm install express`
- 创建如下 `server.js` 文件：

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR 示例</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

最后，运行 `node server.js` 并访问 `http://localhost:3000`。你应该能看到页面正常工作并带有按钮。

[在 StackBlitz 上试试](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### 客户端激活 {#client-hydration}

如果你点击按钮，你会注意到数字没有变化。由于我们没有在浏览器中加载 Vue，客户端上的 HTML 是完全静态的。

为了让客户端应用具备交互性，Vue 需要执行 **激活（hydration）** 步骤。在激活过程中，它会创建与服务器上运行时相同的 Vue 应用，将每个组件与其应控制的 DOM 节点进行匹配，并附加 DOM 事件监听器。

要以激活模式挂载应用，我们需要使用 [`createSSRApp()`](/api/application#createssrapp) 而不是 `createApp()`：

```js{2}
// 这段代码运行在浏览器中。
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...与服务器上的应用相同
})

// 在客户端挂载 SSR 应用时，会假定
// HTML 已经预渲染，并会执行
// 激活而不是创建新的 DOM 节点。
app.mount('#app')
```

### 代码结构 {#code-structure}

请注意，我们需要复用与服务器端相同的应用实现。这就是我们开始思考 SSR 应用中的代码结构的地方——我们该如何在服务器和客户端之间共享相同的应用代码？

这里我们将展示一个最简化的设置。首先，把应用创建逻辑拆分到一个独立文件 `app.js` 中：

```js [app.js]
// （服务器和客户端共享）
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

这个文件及其依赖会在服务器和客户端之间共享——我们把它们称为**通用代码（universal code）**。编写通用代码时有很多需要注意的地方，我们会在[下文](#writing-ssr-friendly-code)中讨论。

我们的客户端入口会导入通用代码，创建应用并执行挂载：

```js [client.js]
import { createApp } from './app.js'

createApp().mount('#app')
```

而服务器则在请求处理程序中使用相同的应用创建逻辑：

```js{2,5} [server.js]
// （省略无关代码）
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

此外，为了在浏览器中加载客户端文件，我们还需要：

1. 通过在 `server.js` 中添加 `server.use(express.static('.'))` 来提供客户端文件。
2. 通过向 HTML 外壳中添加 `<script type="module" src="/client.js"></script>` 来加载客户端入口。
3. 通过向 HTML 外壳中添加 [Import Map](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps) 来支持在浏览器中使用 `import * from 'vue'` 之类的写法。

[在 StackBlitz 上查看完整示例](https://stackblitz.com/fork/vue-ssr-example?file=index.js)。现在按钮已经可以交互了！

## 更高级的方案 {#higher-level-solutions}

从示例过渡到一个可用于生产的 SSR 应用，会涉及更多内容。我们需要：

- 支持 Vue SFC 和其他构建步骤需求。实际上，我们需要为同一个应用协调两次构建：一次用于客户端，一次用于服务器。

  :::tip
  Vue 组件在 SSR 场景下的编译方式不同——模板会被编译为字符串拼接，而不是虚拟 DOM 渲染函数，以获得更高效的渲染性能。
  :::

- 在服务端请求处理程序中，用正确的客户端资源链接和最优的资源提示来渲染 HTML。我们还可能需要在 SSR 和 SSG 模式之间切换，甚至在同一个应用中混用两者。

- 以通用的方式管理路由、数据获取和状态管理存储。

完整实现会非常复杂，并且取决于你选择使用的构建工具链。因此，我们强烈建议采用一个更高层、带有明确约定的解决方案，它可以为你抽象掉这些复杂性。下面我们将介绍 Vue 生态中几种推荐的 SSR 方案。

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) 是构建在 Vue 生态之上的更高层框架，为编写通用 Vue 应用提供了流畅的开发体验。更棒的是，你还可以把它用作静态站点生成器！我们非常推荐你试一试。

### Quasar {#quasar}

[Quasar](https://quasar.dev) 是一个完整的基于 Vue 的解决方案，它允许你使用同一套代码库同时面向 SPA、SSR、PWA、移动应用、桌面应用和浏览器扩展。不仅能处理构建配置，还提供了一整套符合 Material Design 规范的 UI 组件。

### Vite SSR {#vite-ssr}

Vite 提供了对 Vue 服务端渲染的内置[支持](https://vite.dev/guide/ssr.html)，但它有意保持低层级。如果你希望直接使用 Vite，可以看看 [vite-plugin-ssr](https://vite-plugin-ssr.com/)，这是一个社区插件，可以为你抽象掉许多困难的细节。

你也可以在[这里](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue)找到一个使用手动配置的 Vue + Vite SSR 项目示例，它可以作为进一步开发的基础。请注意，只有在你对 SSR / 构建工具非常熟悉，并且确实想对更高层架构拥有完全控制权时，才推荐这样做。

## 编写适合 SSR 的代码 {#writing-ssr-friendly-code}

无论你的构建设置或更高层框架选择如何，在所有 Vue SSR 应用中都有一些通用原则适用。

### 服务端的响应式 {#reactivity-on-the-server}

在 SSR 期间，每个请求 URL 都映射到我们应用的某个期望状态。此时没有用户交互，也没有 DOM 更新，因此在服务端不需要响应式。默认情况下，为了获得更好的性能，SSR 期间会禁用响应式。

### 组件生命周期钩子 {#component-lifecycle-hooks}

由于没有动态更新，诸如 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 或 <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> 之类的生命周期钩子在 SSR 期间**不会**被调用，只会在客户端执行。<span class="options-api">SSR 期间唯一会被调用的钩子是 `beforeCreate` 和 `created`</span>

你应该避免在 <span class="options-api">`beforeCreate` 和 `created`</span><span class="composition-api">`setup()` 或 `<script setup>` 的根作用域</span> 中编写会产生副作用且需要清理的代码。此类副作用的一个例子是使用 `setInterval` 设置定时器。在仅客户端代码中，我们可能会设置一个定时器，然后在 <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> 或 <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span> 中将其清除。然而，由于卸载钩子在 SSR 期间永远不会被调用，定时器将会一直存在。为避免这种情况，请将你的副作用代码改为放在 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 中。

### 访问平台特定的 API {#access-to-platform-specific-apis}

通用代码不能假定能够访问平台特定的 API，因此如果你的代码直接使用了诸如 `window` 或 `document` 这类仅浏览器可用的全局对象，那么它们在 Node.js 中执行时会抛出错误，反之亦然。

对于服务端和客户端共享但平台 API 不同的任务，建议将平台特定的实现封装在一个通用 API 内部，或者使用能替你完成这件事的库。例如，你可以使用 [`node-fetch`](https://github.com/node-fetch/node-fetch) 在服务端和客户端都使用同样的 fetch API。

对于仅浏览器可用的 API，常见做法是在仅客户端的生命周期钩子中延迟访问它们，例如 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>。

请注意，如果某个第三方库并未考虑通用场景，那么将它集成到服务端渲染应用中可能会比较棘手。你 _也许_ 能通过模拟一些全局对象让它工作，但这会比较取巧，并且可能会干扰其他库的环境检测代码。

### 跨请求状态污染 {#cross-request-state-pollution}

在状态管理章节中，我们介绍了一个[使用响应式 API 的简单状态管理模式](state-management#simple-state-management-with-reactivity-api)。在 SSR 场景下，这种模式需要一些额外调整。

这种模式将共享状态声明在 JavaScript 模块的根作用域中。这使它们成为**单例**——也就是说，在整个应用生命周期中，响应式对象只有一个实例。这在纯客户端的 Vue 应用中是符合预期的，因为我们的应用模块会在每次浏览器页面访问时重新初始化。

然而，在 SSR 场景中，应用模块通常只会在服务端启动时初始化一次。相同的模块实例会在多次服务请求之间复用，我们的单例状态对象也是如此。如果我们修改了包含某个用户特定数据的共享单例状态，这些数据可能会意外泄漏到另一个用户的请求中。我们称之为**跨请求状态污染**。

从技术上讲，我们可以像在浏览器中一样，在每个请求中重新初始化所有 JavaScript 模块。然而，初始化 JavaScript 模块可能会很昂贵，因此这会显著影响服务端性能。

推荐的解决方案是在每个请求中创建整个应用的新实例——包括路由器和全局 store。然后，不要在组件中直接导入它，而是通过[应用级 provide](/guide/components/provide-inject#app-level-provide) 提供共享状态，并在需要它的组件中注入：

```js [app.js]
//（服务端和客户端共享）
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// 每个请求都会调用
export function createApp() {
  const app = createSSRApp(/* ... */)
  // 为每个请求创建一个新的 store 实例
  const store = createStore(/* ... */)
  // 在应用级别提供 store
  app.provide('store', store)
  // 同时导出 store 以用于 hydration
  return { app, store }
}
```

像 Pinia 这样的状态管理库就是基于这一点设计的。更多细节请参阅 [Pinia 的 SSR 指南](https://pinia.vuejs.org/ssr/)。

### Hydration 不匹配 {#hydration-mismatch}

如果预渲染 HTML 的 DOM 结构与客户端应用期望输出不一致，就会出现 hydration mismatch 错误。Hydration mismatch 最常见的产生原因如下：

1. 模板包含了无效的 HTML 嵌套结构，而渲染出来的 HTML 被浏览器原生的 HTML 解析行为“修正”了。例如，一个常见的坑是 [`<div>` 不能放在 `<p>` 内](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it)：

   ```html
   <p><div>hi</div></p>
   ```

   如果我们在服务端渲染的 HTML 中生成了这样的内容，浏览器在遇到 `<div>` 时会终止第一个 `<p>`，并将其解析为如下 DOM 结构：

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. 渲染期间使用的数据包含随机生成的值。由于同一个应用会运行两次——一次在服务端，一次在客户端——随机值不能保证在两次运行之间相同。要避免由随机值引起的不匹配，有两种方式：

   1. 使用 `v-if` + `onMounted` 让依赖随机值的部分只在客户端渲染。你的框架也可能提供内置功能来让这更容易，例如 VitePress 中的 `<ClientOnly>` 组件。

   2. 使用支持种子生成的随机数生成库，并保证服务端运行和客户端运行使用相同的种子（例如，将种子包含在序列化状态中，并在客户端读取它）。

3. 服务端和客户端处于不同的时区。有时，我们可能希望将时间戳转换为用户的本地时间。然而，服务端运行时的时区和客户端运行时的时区并不总是相同，而且在服务端运行时我们也不能可靠地知道用户的时区。在这种情况下，本地时间转换也应该作为仅客户端操作来执行。

当 Vue 遇到 hydration mismatch 时，它会尝试自动恢复并调整预渲染的 DOM，使其与客户端状态一致。这会因为丢弃错误节点并挂载新节点而导致一定的渲染性能损失，但在大多数情况下，应用应该仍然能按预期工作。尽管如此，最好还是在开发期间消除 hydration mismatch。

#### 抑制 Hydration 不匹配 <sup class="vt-badge" data-text="3.5+" /> {#suppressing-hydration-mismatches}

在 Vue 3.5+ 中，可以通过使用 [`data-allow-mismatch`](/api/ssr#data-allow-mismatch) 属性有选择地抑制不可避免的 hydration mismatch。

### 自定义指令 {#custom-directives}

由于大多数自定义指令都涉及直接的 DOM 操作，它们在 SSR 期间会被忽略。不过，如果你想指定自定义指令应如何渲染（即它应该向渲染后的元素添加哪些属性），可以使用 `getSSRProps` 指令钩子：

```js
const myDirective = {
  mounted(el, binding) {
    // 客户端实现：
    // 直接更新 DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // 服务端实现：
    // 返回要渲染的 props。
    // getSSRProps 只接收指令绑定对象。
    return {
      id: binding.value
    }
  }
}
```

### Teleports {#teleports}

Teleport 在 SSR 期间需要特殊处理。如果渲染后的应用包含 Teleport，传送出去的内容不会成为渲染字符串的一部分。一个更简单的解决方案是在挂载时有条件地渲染 Teleport。

如果你确实需要对传送的内容进行 hydration，它们会暴露在 ssr context 对象的 `teleports` 属性中：

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

你需要将 teleport 的标记注入最终页面 HTML 中的正确位置，这与注入主应用标记的方式类似。

:::tip
在将 Teleport 与 SSR 一起使用时，避免将目标指向 `body`——通常，`<body>` 中还会包含其他服务端渲染内容，这会使 Teleport 无法确定 hydration 的正确起始位置。

相反，建议使用一个专用容器，例如 `<div id="teleported"></div>`，其中只包含传送内容。
:::
