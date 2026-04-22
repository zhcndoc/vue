# Props {#props}

> 本页假设你已经阅读过 [组件基础](/guide/essentials/component-basics)。如果你是组件新手，请先阅读那一页。

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="免费的 Vue.js Props 课程"/>
</div>

## Props 声明 {#props-declaration}

Vue 组件需要显式声明 props，这样 Vue 才知道传递给组件的外部 props 应该被视为 fallthrough 属性（这将在 [专门的章节](/guide/components/attrs) 中讨论）。

<div class="composition-api">

在使用 `<script setup>` 的 SFC 中，可以使用 `defineProps()` 宏来声明 props：

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

在非 `<script setup>` 组件中，props 通过 [`props`](/api/options-state#props) 选项声明：

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() 接收 props 作为第一个参数。
    console.log(props.foo)
  }
}
```

注意，传递给 `defineProps()` 的参数与提供给 `props` 选项的值是相同的：两种声明方式共享同一套 props 选项 API。

</div>

<div class="options-api">

Props 使用 [`props`](/api/options-state#props) 选项声明：

```js
export default {
  props: ['foo'],
  created() {
    // props 暴露在 `this` 上
    console.log(this.foo)
  }
}
```

</div>

除了使用字符串数组声明 props 之外，我们也可以使用对象语法：

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// 在 <script setup> 中
defineProps({
  title: String,
  likes: Number
})
```

```js
// 在非 <script setup> 中
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

在对象声明语法中，对于每个属性，键是 prop 的名称，而值应该是预期类型的构造函数。

这不仅能为你的组件提供文档说明，如果其他开发者在浏览器控制台中传入了错误的类型，也会发出警告。我们将在本页后面进一步讨论 [prop 校验](#prop-validation) 的更多细节。

<div class="options-api">

另请参阅：[组件 Props 的类型标注](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

如果你在 `<script setup>` 中使用 TypeScript，也可以使用纯类型标注来声明 props：

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

更多细节：[组件 Props 的类型标注](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

## 响应式 Props 解构 <sup class="vt-badge" data-text="3.5+" /> \*\* {#reactive-props-destructure}

Vue 的响应式系统会基于属性访问来追踪状态的使用。例如，当你在计算 getter 或侦听器中访问 `props.foo` 时，`foo` 这个 prop 会被追踪为依赖。

因此，假设有如下代码：

```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // 在 3.5 之前只会运行一次
  // 在 3.5+ 中，当 "foo" prop 变化时会重新运行
  console.log(foo)
})
```

在 3.4 及以下版本中，`foo` 是一个真正的常量，永远不会改变。在 3.5 及以上版本中，Vue 的编译器会自动在同一个 `<script setup>` 块中访问从 `defineProps` 解构出的变量时为其前面加上 `props.`。因此上面的代码等价于下面这样：

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` 被编译器转换为 `props.foo`
  console.log(props.foo)
})
```

此外，你还可以使用 JavaScript 原生的默认值语法来为 props 声明默认值。这在使用基于类型的 props 声明时尤其有用：

```ts
const { foo = 'hello' } = defineProps<{ foo?: string }>()
```

如果你希望在 IDE 中更直观地区分解构出的 props 和普通变量，Vue 的 VSCode 扩展提供了一个设置，可以为解构出的 props 启用内联提示。

### 将解构出的 Props 传入函数 {#passing-destructured-props-into-functions}

当我们把一个解构出的 prop 传给函数时，例如：

```js
const { foo } = defineProps(['foo'])

watch(foo, /* ... */)
```

这不会按预期工作，因为它等价于 `watch(props.foo, ...)` —— 我们传给 `watch` 的是一个值，而不是一个响应式数据源。实际上，Vue 的编译器会捕获这类情况并抛出警告。

类似于我们可以使用 `watch(() => props.foo, ...)` 来侦听普通 prop，也可以通过将解构出的 prop 包装进一个 getter 来侦听它：

```js
watch(() => foo, /* ... */)
```

此外，当我们需要在保持响应性的同时将解构出的 prop 传递给外部函数时，也推荐使用这种方式：

```js
useComposable(() => foo)
```

外部函数可以在需要跟踪所提供 prop 的变化时调用这个 getter（或使用 [toValue](/api/reactivity-utilities.html#tovalue) 将其规范化），例如在计算属性或侦听器 getter 中。

</div>

## Props 传递细节 {#prop-passing-details}

### Prop 名称大小写 {#prop-name-casing}

我们使用 camelCase 来声明较长的 prop 名称，因为这样在将其用作属性键时不需要加引号，而且由于它们是合法的 JavaScript 标识符，也可以直接在模板表达式中引用：

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

从技术上讲，在向子组件传递 props 时也可以使用 camelCase（[DOM 内模板](/guide/essentials/component-basics#in-dom-template-parsing-caveats) 除外）。不过，惯例是在所有情况下都使用 kebab-case，以便与 HTML 属性保持一致：

```vue-html
<MyComponent greeting-message="hello" />
```

我们在可能的情况下会为 [组件标签使用 PascalCase](/guide/components/registration#component-name-casing)，因为这能通过区分 Vue 组件和原生元素来提升模板可读性。然而，在传递 props 时使用 camelCase 并没有那么明显的实际收益，所以我们选择遵循各自语言的惯例。

### 静态 vs. 动态 Props {#static-vs-dynamic-props}

到目前为止，你已经看到了以静态值传递 props 的方式，例如：

```vue-html
<BlogPost title="My journey with Vue" />
```

你也看到了使用 `v-bind` 或其 `:` 简写动态绑定 props 的方式，例如：

```vue-html
<!-- 动态地为变量赋值 -->
<BlogPost :title="post.title" />

<!-- 动态地为复杂表达式赋值 -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### 传递不同类型的值 {#passing-different-value-types}

在上面两个例子中，我们恰好传递的是字符串值，但任何类型的值都可以传递给 prop。

#### 数字 {#number}

```vue-html
<!-- 虽然 `42` 是静态的，但我们需要用 v-bind 来告诉 Vue -->
<!-- 这是一段 JavaScript 表达式，而不是字符串。      -->
<BlogPost :likes="42" />

<!-- 动态地为变量的值赋值。 -->
<BlogPost :likes="post.likes" />
```

#### 布尔值 {#boolean}

```vue-html
<!-- 只传递 prop 而不提供值会被视为 `true`。 -->
<BlogPost is-published />

<!-- 虽然 `false` 是静态的，但我们需要用 v-bind 来告诉 Vue -->
<!-- 这是一段 JavaScript 表达式，而不是字符串。         -->
<BlogPost :is-published="false" />

<!-- 动态地为变量的值赋值。 -->
<BlogPost :is-published="post.isPublished" />
```

#### 数组 {#array}

```vue-html
<!-- 虽然数组是静态的，但我们需要用 v-bind 来告诉 Vue -->
<!-- 这是一段 JavaScript 表达式，而不是字符串。           -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- 动态地为变量的值赋值。 -->
<BlogPost :comment-ids="post.commentIds" />
```

#### 对象 {#object}

```vue-html
<!-- 虽然对象是静态的，但我们需要用 v-bind 来告诉 Vue -->
<!-- 这是一段 JavaScript 表达式，而不是字符串。            -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- 动态地为变量的值赋值。 -->
<BlogPost :author="post.author" />
```

### 使用对象绑定多个属性 {#binding-multiple-properties-using-an-object}

如果你想将一个对象的所有属性都作为 props 传递，可以使用 [不带参数的 `v-bind`](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes)（`v-bind` 而不是 `:prop-name`）。例如，给定一个 `post` 对象：

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'My Journey with Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

</div>

下面这个模板：

```vue-html
<BlogPost v-bind="post" />
```

将等价于：

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## 单向数据流 {#one-way-data-flow}

所有 props 都会在子属性和父属性之间形成一种**单向下行绑定**：当父属性更新时，会向下传递到子组件，但不会反过来。这可以防止子组件无意中修改父组件的状态，从而让应用的数据流更难理解。

此外，每当父组件更新时，子组件中的所有 props 都会被刷新为最新值。这意味着你**不应该**在子组件中尝试修改 prop。如果这样做了，Vue 会在控制台发出警告：

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ 警告，props 是只读的！
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ 警告，props 是只读的！
    this.foo = 'bar'
  }
}
```

</div>

通常有两种情况会让人想要修改 prop：

1. **该 prop 用于传入初始值；之后子组件想将其作为本地数据属性使用。** 在这种情况下，最好定义一个以该 prop 为初始值的本地数据属性：

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // counter 仅将 props.initialCounter 作为初始值；
   // 它与未来的 prop 更新断开关联。
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // counter 仅将 this.initialCounter 作为初始值；
         // 它与未来的 prop 更新断开关联。
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **该 prop 作为原始值传入，需要进行转换。** 在这种情况下，最好使用 prop 的值定义一个计算属性：

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // 当 prop 变化时会自动更新的计算属性
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // 当 prop 变化时会自动更新的计算属性
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### 修改对象 / 数组 Props {#mutating-object-array-props}

当对象和数组作为 props 传入时，虽然子组件不能修改 prop 绑定本身，但它**可以**修改对象或数组的嵌套属性。这是因为在 JavaScript 中，对象和数组是通过引用传递的，而 Vue 要阻止这种修改的成本过高。

这种修改方式的主要缺点是，它会让子组件以父组件不易察觉的方式影响父状态，从而可能使未来更难推理数据流。最佳实践是，除非父子组件在设计上紧密耦合，否则应避免此类修改。在大多数情况下，子组件应该 [触发一个事件](/guide/components/events) 让父组件执行修改。

## Prop 校验 {#prop-validation}

组件可以为其 props 指定要求，例如你已经见过的类型。如果某个要求未满足，Vue 会在浏览器的 JavaScript 控制台中发出警告。这在开发一个打算供他人使用的组件时尤其有用。

要指定 prop 校验，你可以向 <span class="composition-api">`defineProps()` 宏</span><span class="options-api">`props` 选项</span>提供一个带有校验要求的对象，而不是字符串数组。例如：

<div class="composition-api">

```js
defineProps({
  // 基本类型检查
  //  (`null` 和 `undefined` 值将允许任何类型)
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必填字符串
  propC: {
    type: String,
    required: true
  },
  // 必填但可为 null 的字符串
  propD: {
    type: [String, null],
    required: true
  },
  // 带默认值的数字
  propE: {
    type: Number,
    default: 100
  },
  // 带默认值的对象
  propF: {
    type: Object,
    // 对象或数组的默认值必须从工厂函数返回。
    // 该函数接收组件收到的原始 props 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义校验函数
  // 在 3.4+ 中，完整 props 会作为第二个参数传入
  propG: {
    validator(value, props) {
      // 该值必须匹配以下字符串之一
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 带默认值的函数
  propH: {
    type: Function,
    // 不同于对象或数组的默认值，这里不是工厂
    // 函数——这是一个用作默认值的函数
    default() {
      return '默认函数'
    }
  }
})
```

:::tip
`defineProps()` 参数中的代码 **不能访问在 `<script setup>` 中声明的其他变量**，因为在编译时整个表达式会被移动到外部函数作用域中。
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // 基本类型检查
    //  (`null` 和 `undefined` 值将允许任何类型)
    propA: Number,
    // 多种可能的类型
    propB: [String, Number],
    // 必填字符串
    propC: {
      type: String,
      required: true
    },
    // 必填但可为 null 的字符串
    propD: {
      type: [String, null],
      required: true
    },
    // 带默认值的数字
    propE: {
      type: Number,
      default: 100
    },
    // 带默认值的对象
    propF: {
      type: Object,
      // 对象或数组的默认值必须从工厂函数返回。
      // 该函数接收组件收到的原始 props 作为参数。
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // 自定义校验函数
    // 在 3.4+ 中，完整 props 会作为第二个参数传入
    propG: {
      validator(value, props) {
        // 该值必须匹配以下字符串之一
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // 带默认值的函数
    propH: {
      type: Function,
      // 不同于对象或数组的默认值，这里不是工厂
      // 函数——这是一个用作默认值的函数
      default() {
        return '默认函数'
      }
    }
  }
}
```

</div>

附加说明：

- 默认情况下，除非指定 `required: true`，否则所有 props 都是可选的。

- 除了 `Boolean` 之外，缺失的可选 prop 的值将是 `undefined`。

- `Boolean` 类型的缺失 prop 会被转换为 `false`。你可以通过为其设置 `default` 来改变这一点——即：`default: undefined`，使其表现为非 `Boolean` prop。

- 如果指定了 `default` 值，那么当解析后的 prop 值为 `undefined` 时就会使用它——这包括 prop 缺失以及显式传入 `undefined` 值的情况。

当 prop 校验失败时，Vue 会输出控制台警告（如果使用开发版构建）。

<div class="composition-api">

如果使用 [基于类型的 props 声明](/api/sfc-script-setup#type-only-props-emit-declarations) <sup class="vt-badge ts" />，Vue 会尽力将类型注解编译为等价的运行时 prop 声明。例如，`defineProps<{ msg: string }>` 会被编译为 `{ msg: { type: String, required: true }}`。

</div>
<div class="options-api">

::: tip 注
请注意，props 的校验会在创建组件实例之前进行，因此实例属性（例如 `data`、`computed` 等）在 `default` 或 `validator` 函数中不可用。
:::

</div>

### 运行时类型检查 {#runtime-type-checks}

`type` 可以是以下原生构造函数之一：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`

此外，`type` 也可以是自定义类或构造函数，断言将通过 `instanceof` 检查来进行。例如，给定如下类：

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

你可以将其用作 prop 的类型：

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

Vue 会使用 `instanceof Person` 来验证 `author` prop 的值是否确实是 `Person` 类的实例。

### 可为 null 的类型 {#nullable-type}

如果类型是必填但可为 null，你可以使用包含 `null` 的数组语法：

<div class="composition-api">

```js
defineProps({
  id: {
    type: [String, null],
    required: true
  }
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    id: {
      type: [String, null],
      required: true
    }
  }
}
```

</div>

注意，如果 `type` 只是 `null` 而没有使用数组语法，它将允许任何类型。

## 布尔值转换 {#boolean-casting}

`Boolean` 类型的 props 有特殊的转换规则，用来模拟原生布尔属性的行为。给定一个带有以下声明的 `<MyComponent>`：

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

该组件可以这样使用：

```vue-html
<!-- 等同于传入 :disabled="true" -->
<MyComponent disabled />

<!-- 等同于传入 :disabled="false" -->
<MyComponent />
```

当一个 prop 被声明为允许多种类型时，也会应用 `Boolean` 的转换规则。不过，当同时允许 `String` 和 `Boolean` 时有一个边界情况——只有当 `Boolean` 出现在 `String` 之前时，布尔转换规则才会生效：

<div class="composition-api">

```js
// disabled 将被转换为 true
defineProps({
  disabled: [Boolean, Number]
})

// disabled 将被转换为 true
defineProps({
  disabled: [Boolean, String]
})

// disabled 将被转换为 true
defineProps({
  disabled: [Number, Boolean]
})

// disabled 将被解析为空字符串 (disabled="")
defineProps({
  disabled: [String, Boolean]
})
```

</div>
<div class="options-api">

```js
// disabled 将被转换为 true
export default {
  props: {
    disabled: [Boolean, Number]
  }
}

// disabled 将被转换为 true
export default {
  props: {
    disabled: [Boolean, String]
  }
}

// disabled 将被转换为 true
export default {
  props: {
    disabled: [Number, Boolean]
  }
}

// disabled 将被解析为空字符串 (disabled="")
export default {
  props: {
    disabled: [String, Boolean]
  }
}
```

</div>
