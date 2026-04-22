# 插件 {#plugins}

## 介绍 {#introduction}

插件是自包含的代码，通常会为 Vue 添加应用级功能。下面是我们安装插件的方式：

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* 可选配置项 */
})
```

插件可以定义为一个暴露 `install()` 方法的对象，或者直接定义为一个充当 install 函数本身的函数。install 函数会接收 [app 实例](/api/application) 以及传给 `app.use()` 的额外选项（如果有）：

```js
const myPlugin = {
  install(app, options) {
    // 配置应用
  }
}
```

插件并没有严格定义的作用域，但常见的插件使用场景包括：

1. 使用 [`app.component()`](/api/application#app-component) 和 [`app.directive()`](/api/application#app-directive) 注册一个或多个全局组件或自定义指令。

2. 通过调用 [`app.provide()`](/api/application#app-provide) 让某个资源在整个应用中都可以被 [注入](/guide/components/provide-inject)。

3. 通过将一些全局实例属性或方法挂载到 [`app.config.globalProperties`](/api/application#app-config-globalproperties) 上来添加它们。

4. 需要组合执行上述部分操作的库（例如 [vue-router](https://github.com/vuejs/vue-router-next)）。

## 编写插件 {#writing-a-plugin}

为了更好地理解如何创建你自己的 Vue.js 插件，我们将创建一个非常简化版本的插件，用于显示 `i18n`（即 [Internationalization](https://en.wikipedia.org/wiki/Internationalization_and_localization) 的缩写）字符串。

让我们先设置插件对象。建议将其创建在单独的文件中并导出，如下所示，这样可以保持逻辑独立且易于隔离。

```js [plugins/i18n.js]
export default {
  install: (app, options) => {
    // 插件代码写在这里
  }
}
```

我们要创建一个翻译函数。这个函数会接收一个用点号分隔的 `key` 字符串，我们将使用它在用户提供的选项中查找翻译后的字符串。这是模板中的预期用法：

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

由于这个函数应该在所有模板中都能全局使用，我们会在插件中将它挂载到 `app.config.globalProperties` 上：

```js{3-10} [plugins/i18n.js]
export default {
  install: (app, options) => {
    // 注入一个全局可用的 $translate() 方法
    app.config.globalProperties.$translate = (key) => {
      // 在 `options` 中读取嵌套属性
      // 使用 `key` 作为路径
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

我们的 `$translate` 函数会接收类似 `greetings.hello` 这样的字符串，查看用户提供的配置并返回翻译值。

包含翻译键的对象应当在安装插件时通过传给 `app.use()` 的额外参数传入：

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

现在，我们最初的表达式 `$translate('greetings.hello')` 在运行时将被替换为 `Bonjour!`。

另请参见：[增强全局属性](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
请尽量少用全局属性，因为如果在整个应用中使用了太多由不同插件注入的全局属性，事情很快就会变得令人困惑。
:::

### 配合插件使用 Provide / Inject {#provide-inject-with-plugins}

插件还允许我们使用 `provide` 来让插件使用者访问某个函数或属性。例如，我们可以让应用能够访问 `options` 参数，以便使用翻译对象。

```js{3} [plugins/i18n.js]
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

现在，插件使用者就可以通过 `i18n` 这个 key 将插件选项注入到自己的组件中：

<div class="composition-api">

```vue{4}
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js{2}
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>

### 打包为 NPM {#bundle-for-npm}

如果你还想构建并发布你的插件供他人使用，请参阅 [Vite 关于库模式的章节](https://vite.dev/guide/build.html#library-mode).
