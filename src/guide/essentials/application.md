# 创建一个 Vue 应用程序 {#creating-a-vue-application}

## 应用程序实例 {#the-application-instance}

每个 Vue 应用程序都从使用 [`createApp`](/api/application#createapp) 函数创建一个新的 **应用程序实例** 开始：

```js
import { createApp } from 'vue'

const app = createApp({
  /* 根组件选项 */
})
```

## 根组件 {#the-root-component}

我们传入 `createApp` 的对象实际上是一个组件。每个应用都需要一个“根组件”，它可以包含其他组件作为其子组件。

如果你正在使用单文件组件，我们通常会从另一个文件中导入根组件：

```js
import { createApp } from 'vue'
// 从单文件组件中导入根组件 App。
import App from './App.vue'

const app = createApp(App)
```

虽然本指南中的许多示例只需要一个组件，但大多数真实应用程序都组织成由可复用组件嵌套而成的树。例如，一个 Todo 应用的组件树可能如下所示：

```
App (根组件)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

在本指南后面的章节中，我们将讨论如何定义多个组件并将它们组合在一起。在那之前，我们将先聚焦于单个组件内部会发生什么。

## 挂载应用程序 {#mounting-the-app}

在调用应用程序实例的 `.mount()` 方法之前，它不会渲染任何内容。它需要一个“容器”参数，该参数既可以是真实的 DOM 元素，也可以是选择器字符串：

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

应用程序根组件的内容将被渲染到容器元素内部。容器元素本身不被视为应用的一部分。

`.mount()` 方法应始终在完成所有应用配置和资源注册之后调用。另外请注意，它的返回值不同于资源注册方法，返回的是根组件实例，而不是应用程序实例。

### 直接在 DOM 中编写的根组件模板 {#in-dom-root-component-template}

根组件的模板通常是组件自身的一部分，但也可以通过直接写在挂载容器中的方式单独提供模板：

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

如果根组件还没有 `template` 选项，Vue 会自动使用容器的 `innerHTML` 作为模板。

直接在 DOM 中编写的模板通常用于 [不经过构建步骤而使用 Vue 的应用程序](/guide/quick-start.html#using-vue-from-cdn)。它们也可以与服务器端框架结合使用，此时根模板可能由服务器动态生成。

## 应用程序配置 {#app-configurations}

应用程序实例暴露了一个 `.config` 对象，它允许我们配置一些应用级选项，例如，定义一个应用级错误处理器，用来捕获所有后代组件中的错误：

```js
app.config.errorHandler = (err) => {
  /* 处理错误 */
}
```

应用程序实例还提供了一些方法，用于注册应用作用域的资源。例如，注册一个组件：

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

这会使 `TodoDeleteButton` 可在应用中的任何地方使用。我们将在本指南后面的章节中讨论组件以及其他类型资源的注册。你也可以在其 [API 参考](/api/application) 中浏览应用程序实例 API 的完整列表。

请务必在挂载应用之前完成所有应用配置！

## 多个应用程序实例 {#multiple-application-instances}

你不必局限于在同一页面上只使用一个应用程序实例。`createApp` API 允许多个 Vue 应用共存于同一页面，每个应用都拥有自己配置和全局资源的作用域：

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

如果你使用 Vue 来增强服务器渲染的 HTML，并且只需要 Vue 控制大型页面中的特定部分，请避免将单个 Vue 应用程序实例挂载到整个页面上。相反，应创建多个较小的应用程序实例，并将它们挂载到各自负责的元素上。
