# 组件 {#components}

到目前为止，我们只使用了单个组件。真实的 Vue 应用通常由嵌套组件构成。

父组件可以在其模板中将另一个组件渲染为子组件。要使用子组件，我们需要先导入它：

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

我们还需要使用 `components` 选项来注册该组件。这里我们使用对象属性简写，将 `ChildComp` 组件注册到 `ChildComp` 键下。

</div>
</div>

<div class="sfc">

然后，我们就可以在模板中像这样使用该组件：

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

我们还需要使用 `components` 选项来注册该组件。这里我们使用对象属性简写，将 `ChildComp` 组件注册到 `ChildComp` 键下。

由于我们是在 DOM 中编写模板，它将受到浏览器解析规则的影响，而标签名是大小写不敏感的。因此，我们需要使用 kebab-case 命名来引用子组件：

```vue-html
<child-comp></child-comp>
```

</div>


现在轮到你来试试了——导入子组件并在模板中渲染它。
