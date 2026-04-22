# 内置指令 {#built-in-directives}

## v-text {#v-text}

更新元素的文本内容。

- **期望值：** `string`

- **详情**

  `v-text` 的工作方式是设置元素的 [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) 属性，因此它会覆盖元素内部已有的任何内容。如果你只需要更新 `textContent` 的一部分，应该改用 [mustache 插值](/guide/essentials/template-syntax#text-interpolation)（例如 <span v-pre>`<span>Keep this but update a {{dynamicPortion}}</span>`</span>）。

- **示例**

  ```vue-html
  <span v-text="msg"></span>
  <!-- 与下列写法相同 -->
  <span>{{msg}}</span>
  ```

- **另见** [模板语法 - 文本插值](/guide/essentials/template-syntax#text-interpolation)

## v-html {#v-html}

更新元素的 [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)。

- **期望值：** `string`

- **详情**

  `v-html` 的内容会作为原始 HTML 插入 - Vue 模板语法不会被处理。如果你发现自己试图使用 `v-html` 来组合模板，请考虑改用组件来重新设计解决方案。

  ::: warning 安全提示
  在你的网站上动态渲染任意 HTML 可能非常危险，因为这很容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。只应在可信内容上使用 `v-html`，**绝不要**用于用户提供的内容。
  :::

  在 [单文件组件](/guide/scaling-up/sfc) 中，`scoped` 样式不会应用到 `v-html` 内部的内容，因为该 HTML 不会被 Vue 的模板编译器处理。如果你想通过 scoped CSS 作用于 `v-html` 内容，可以改用 [CSS modules](./sfc-css-features#css-modules)，或者使用额外的全局 `<style>` 元素，并结合手动作用域策略，例如 BEM。

- **示例**

  ```vue-html
  <div v-html="html"></div>
  ```

- **另见** [模板语法 - 原始 HTML](/guide/essentials/template-syntax#raw-html)

## v-show {#v-show}

根据表达式值的真值性来切换元素的可见性。

- **期望值：** `any`

- **详情**

  `v-show` 的工作方式是通过内联样式设置 `display` CSS 属性，并且在元素可见时会尽量保留初始的 `display` 值。它还会在条件变化时触发过渡。

- **另见** [条件渲染 - v-show](/guide/essentials/conditional#v-show)

## v-if {#v-if}

根据表达式值的真值性有条件地渲染元素或模板片段。

- **期望值：** `any`

- **详情**

  当 `v-if` 元素切换时，该元素及其包含的指令 / 组件会被销毁并重新构建。如果初始条件为假，则内部内容根本不会被渲染。

  可用于 `<template>`，表示一个仅包含文本或多个元素的条件块。

  当条件变化时，此指令会触发过渡。

  与 `v-for` 同时使用时，`v-if` 的优先级更高。我们不建议在同一个元素上同时使用这两个指令——详情请参见 [列表渲染指南](/guide/essentials/list#v-for-with-v-if)。

- **另见** [条件渲染 - v-if](/guide/essentials/conditional#v-if)

## v-else {#v-else}

表示 `v-if` 或 `v-if` / `v-else-if` 链的“否则块”。

- **不需要表达式**

- **详情**

  - 限制：前一个兄弟元素必须有 `v-if` 或 `v-else-if`。

  - 可用于 `<template>`，表示一个仅包含文本或多个元素的条件块。

- **示例**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    现在你看见我了
  </div>
  <div v-else>
    现在你看不见我了
  </div>
  ```

- **另见** [条件渲染 - v-else](/guide/essentials/conditional#v-else)

## v-else-if {#v-else-if}

表示 `v-if` 的“否则如果块”。可链式使用。

- **期望值：** `any`

- **详情**

  - 限制：前一个兄弟元素必须有 `v-if` 或 `v-else-if`。

  - 可用于 `<template>`，表示一个仅包含文本或多个元素的条件块。

- **示例**

  ```vue-html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    不是 A/B/C
  </div>
  ```

- **另见** [条件渲染 - v-else-if](/guide/essentials/conditional#v-else-if)

## v-for {#v-for}

根据源数据多次渲染元素或模板块。

- **期望值：** `Array | Object | number | string | Iterable`

- **详情**

  该指令的值必须使用特殊语法 `alias in expression`，为当前正在迭代的元素提供别名：

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  或者，你也可以为索引指定别名（如果用于 Object，则为键）：

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  `v-for` 的默认行为会尝试原地修补元素，而不会移动它们。若要强制重新排序元素，应通过 `key` 特殊属性提供排序提示：

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` 也可用于实现了 [Iterable 协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 的值，包括原生的 `Map` 和 `Set`。

- **另见**
  - [列表渲染](/guide/essentials/list)

## v-on {#v-on}

为元素绑定事件监听器。

- **简写：** `@`

- **期望值：** `Function | Inline Statement | Object (without argument)`

- **参数：** `event`（如果使用 Object 语法则为可选）

- **修饰符**

  - `.stop` - 调用 `event.stopPropagation()`。
  - `.prevent` - 调用 `event.preventDefault()`。
  - `.capture` - 以捕获模式添加事件监听器。
  - `.self` - 只有当事件是从该元素本身派发时才触发处理函数。
  - `.{keyAlias}` - 只在某些按键上触发处理函数。
  - `.once` - 处理函数最多触发一次。
  - `.left` - 只为鼠标左键事件触发处理函数。
  - `.right` - 只为鼠标右键事件触发处理函数。
  - `.middle` - 只为鼠标中键事件触发处理函数。
  - `.passive` - 以 `{ passive: true }` 方式附加 DOM 事件。

- **详情**

  事件类型由参数指定。表达式可以是方法名、内联语句；如果存在修饰符，也可以省略。

  当用于普通元素时，它只监听 [**原生 DOM 事件**](https://developer.mozilla.org/en-US/docs/Web/Events)。当用于自定义元素组件时，它监听的是该子组件发出的 **自定义事件**。

  监听原生 DOM 事件时，方法只接收原生事件作为唯一参数。如果使用内联语句，该语句可以访问特殊的 `$event` 属性：`v-on:click="handle('ok', $event)"`。

  `v-on` 也支持绑定到一个事件 / 监听器对的对象，而不需要参数。注意，使用对象语法时不支持任何修饰符。

- **示例**

  ```vue-html
  <!-- 方法处理器 -->
  <button v-on:click="doThis"></button>

  <!-- 动态事件 -->
  <button v-on:[event]="doThis"></button>

  <!-- 内联语句 -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- 简写 -->
  <button @click="doThis"></button>

  <!-- 简写动态事件 -->
  <button @[event]="doThis"></button>

  <!-- 阻止冒泡 -->
  <button @click.stop="doThis"></button>

  <!-- 阻止默认行为 -->
  <button @click.prevent="doThis"></button>

  <!-- 不带表达式地阻止默认行为 -->
  <form @submit.prevent></form>

  <!-- 链式修饰符 -->
  <button @click.stop.prevent="doThis"></button>

  <!-- 使用 keyAlias 的按键修饰符 -->
  <input @keyup.enter="onEnter" />

  <!-- click 事件最多只会触发一次 -->
  <button v-on:click.once="doThis"></button>

  <!-- 对象语法 -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  监听子组件上的自定义事件（当子组件上触发 "my-event" 时，处理函数会被调用）：

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- 内联语句 -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **另见**
  - [事件处理](/guide/essentials/event-handling)
  - [组件 - 自定义事件](/guide/essentials/component-basics#listening-to-events)

## v-bind {#v-bind}

动态绑定一个或多个属性，或将组件 prop 绑定到表达式。

- **简写：**
  - `:` 或 `.`（使用 `.prop` 修饰符时）
  - 省略值（当属性名与绑定值同名时，需要 3.4+）

- **期望值：** `any (with argument) | Object (without argument)`

- **参数：** `attrOrProp`（可选）

- **修饰符**

  - `.camel` - 将 kebab-case 属性名转换为 camelCase。
  - `.prop` - 强制将绑定设置为 DOM property（3.2+）。
  - `.attr` - 强制将绑定设置为 DOM attribute（3.2+）。

- **用法**

  当用于绑定 `class` 或 `style` 属性时，`v-bind` 支持 Array 或 Object 等额外的值类型。更多细节请参见下方链接的指南章节。

  当在元素上设置绑定时，Vue 默认会通过 `in` 运算符检查该元素是否定义了该键作为 property。如果该 property 已定义，Vue 会将值设置为 DOM property 而不是 attribute。这在大多数情况下都可行，但你可以通过显式使用 `.prop` 或 `.attr` 修饰符来覆盖此行为。在某些情况下这是必要的，尤其是在 [使用自定义元素时](/guide/extras/web-components#passing-dom-properties)。

  当用于组件 prop 绑定时，prop 必须在子组件中被正确声明。

  不带参数使用时，可用于绑定一个包含属性名-值对的对象。

- **示例**

  ```vue-html
  <!-- 绑定一个属性 -->
  <img v-bind:src="imageSrc" />

  <!-- 动态属性名 -->
  <button v-bind:[key]="value"></button>

  <!-- 简写 -->
  <img :src="imageSrc" />

  <!-- 同名简写（3.4+），展开为 :src="src" -->
  <img :src />

  <!-- 简写动态属性名 -->
  <button :[key]="value"></button>

  <!-- 使用内联字符串拼接 -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- class 绑定 -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- style 绑定 -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- 绑定一个属性对象 -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop 绑定。"prop" 必须在子组件中声明。 -->
  <MyComponent :prop="someThing" />

  <!-- 向下传递与子组件共有的父组件 props -->
  <MyComponent v-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  `.prop` 修饰符也有一个专用简写 `.`：

  ```vue-html
  <div :someProperty.prop="someObject"></div>

  <!-- 等价于 -->
  <div .someProperty="someObject"></div>
  ```

  `.camel` 修饰符允许在 DOM 内模板中使用时将 `v-bind` 属性名驼峰化，例如 SVG 的 `viewBox` 属性：

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  如果你使用字符串模板，或者通过构建步骤预编译模板，就不需要 `.camel`。

- **另见**
  - [Class 和 Style 绑定](/guide/essentials/class-and-style)
  - [组件 - Prop 传递详情](/guide/components/props#prop-passing-details)

## v-model {#v-model}

在表单输入元素或组件上创建双向绑定。

- **期望值：** 根据表单输入元素的值或组件的输出而变化

- **仅限于：**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - 组件

- **修饰符**

  - [`.lazy`](/guide/essentials/forms#lazy) - 监听 `change` 事件而不是 `input`
  - [`.number`](/guide/essentials/forms#number) - 将有效的输入字符串转换为数字
  - [`.trim`](/guide/essentials/forms#trim) - 去除输入内容两端空白

- **另请参阅**

  - [表单输入绑定](/guide/essentials/forms)
  - [组件事件 - 与 `v-model` 一起使用](/guide/components/v-model)

## v-slot {#v-slot}

表示接收 props 的命名插槽或作用域插槽。

- **简写：** `#`

- **期望值：** 在函数参数位置有效的 JavaScript 表达式，支持解构。可选——仅在期望将 props 传递给插槽时需要。

- **参数：** 插槽名（可选，默认为 `default`）

- **仅限于：**

  - `<template>`
  - [组件](/guide/components/slots#scoped-slots)（用于带有 props 的单个默认插槽）

- **示例**

  ```vue-html
  <!-- 命名插槽 -->
  <BaseLayout>
    <template v-slot:header>
      头部内容
    </template>

    <template v-slot:default>
      默认插槽内容
    </template>

    <template v-slot:footer>
      底部内容
    </template>
  </BaseLayout>

  <!-- 接收 props 的命名插槽 -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- 接收 props 的默认插槽，使用解构 -->
  <Mouse v-slot="{ x, y }">
    鼠标位置：{{ x }}, {{ y }}
  </Mouse>
  ```

- **另请参阅**
  - [组件 - 插槽](/guide/components/slots)

## v-pre {#v-pre}

跳过该元素及其所有子元素的编译。

- **不期望表达式**

- **详情**

  在带有 `v-pre` 的元素内部，所有 Vue 模板语法都会被保留并按原样渲染。它最常见的用途是显示原始的 mustache 标签。

- **示例**

  ```vue-html
  <span v-pre>{{ 这不会被编译 }}</span>
  ```

## v-once {#v-once}

只渲染元素和组件一次，并跳过后续更新。

- **不期望表达式**

- **详情**

  在后续重新渲染时，该元素/组件及其所有子元素都会被视为静态内容并跳过。这可用于优化更新性能。

  ```vue-html
  <!-- 单个元素 -->
  <span v-once>这将永远不会改变：{{msg}}</span>
  <!-- 该元素有子元素 -->
  <div v-once>
    <h1>注释</h1>
    <p>{{msg}}</p>
  </div>
  <!-- 组件 -->
  <MyComponent v-once :comment="msg"></MyComponent>
  <!-- `v-for` 指令 -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  自 3.2 起，你也可以使用带失效条件的 [`v-memo`](#v-memo) 来记忆模板的一部分。

- **另请参阅**
  - [数据绑定语法 - 插值](/guide/essentials/template-syntax#text-interpolation)
  - [v-memo](#v-memo)

## v-memo {#v-memo}

- 仅在 3.2+ 中受支持

- **期望值：** `any[]`

- **详情**

  对模板的某个子树进行记忆。可用于元素和组件。该指令期望一个固定长度的依赖值数组，用于比较是否可以复用记忆结果。如果数组中的每个值都与上一次渲染时相同，那么整个子树的更新都会被跳过。例如：

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  当组件重新渲染时，如果 `valueA` 和 `valueB` 都保持不变，那么这个 `<div>` 及其子元素的所有更新都会被跳过。实际上，甚至连 Virtual DOM VNode 的创建也会被跳过，因为可以复用该子树已记忆的副本。

  正确指定记忆数组非常重要，否则我们可能会跳过本应应用的更新。空依赖数组（`v-memo="[]"`）在功能上等同于 `v-once`。

  **与 `v-for` 一起使用**

  `v-memo` 仅用于性能关键场景中的微优化，通常很少需要。它最常见且可能有帮助的场景是渲染大型 `v-for` 列表（其中 `length > 1000`）：

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...更多子节点</p>
  </div>
  ```

  当组件的 `selected` 状态变化时，即使大多数条目完全没有变化，也会创建大量 VNode。这里使用 `v-memo` 基本上是在说：“只有当这个条目从未选中变为已选中，或反过来时，才更新它。” 这样每个未受影响的条目都可以复用之前的 VNode，并完全跳过 diff。注意这里不需要把 `item.id` 包含在记忆依赖数组中，因为 Vue 会自动根据该条目的 `:key` 推断出来。

  :::warning
  当将 `v-memo` 与 `v-for` 一起使用时，请确保它们用在同一个元素上。**`v-memo` 在 `v-for` 内部不起作用。**
  :::

  `v-memo` 也可以用于组件，在某些子组件更新检查被去优化的边缘情况下，手动阻止不必要的更新。但同样，开发者有责任指定正确的依赖数组，以避免跳过必要的更新。

- **另请参阅**
  - [v-once](#v-once)

## v-cloak {#v-cloak}

用于在模板准备好之前隐藏未编译的模板。

- **不期望表达式**

- **详情**

  **此指令仅在无需构建步骤的设置中需要。**

  使用 DOM 内模板时，可能会出现“未编译模板闪现”：在挂载的组件将其替换为渲染内容之前，用户可能会看到原始的 mustache 标签。

  `v-cloak` 会一直保留在元素上，直到关联的组件实例被挂载。结合像 `[v-cloak] { display: none }` 这样的 CSS 规则，它可用于在组件准备好之前隐藏原始模板。

- **示例**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```vue-html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  直到编译完成之前，`<div>` 都不会可见。
