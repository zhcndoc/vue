# 事件处理 {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Free Vue.js Events Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Free Vue.js Events Lesson"/>
</div>

## 监听事件 {#listening-to-events}

我们可以使用 `v-on` 指令，通常将其缩写为 `@` 符号，来监听 DOM 事件，并在它们触发时运行一些 JavaScript。用法可以是 `v-on:click="handler"`，或者使用简写 `@click="handler"`。

handler 的值可以是以下几种之一：

1. **内联处理器：** 在事件触发时执行的内联 JavaScript（类似于原生的 `onclick` 属性）。

2. **方法处理器：** 指向组件中定义的方法的属性名或路径。

## 内联处理器 {#inline-handlers}

内联处理器通常用于简单场景，例如：

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">增加 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)

</div>

## 方法处理器 {#method-handlers}

不过，许多事件处理器的逻辑会更复杂，使用内联处理器可能并不现实。这就是为什么 `v-on` 也可以接受你想调用的组件方法的名称或路径。

例如：

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` 是原生 DOM 事件
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // 方法内部的 `this` 指向当前激活的实例
    alert(`Hello ${this.name}!`)
    // `event` 是原生 DOM 事件
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` 是上面定义的方法名 -->
<button @click="greet">问候</button>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

</div>

方法处理器会自动接收触发它的原生 DOM Event 对象——在上面的例子中，我们能够通过 `event.target` 访问派发该事件的元素。

<div class="composition-api">

另请参见：[事件处理器类型标注](/guide/typescript/composition-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

另请参见：[事件处理器类型标注](/guide/typescript/options-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### 方法与内联检测 {#method-vs-inline-detection}

模板编译器通过检查 `v-on` 的值字符串是否是一个有效的 JavaScript 标识符或属性访问路径来检测方法处理器。例如，`foo`、`foo.bar` 和 `foo['bar']` 会被视为方法处理器，而 `foo()` 和 `count++` 会被视为内联处理器。

## 在内联处理器中调用方法 {#calling-methods-in-inline-handlers}

除了直接绑定到方法名，我们还可以在内联处理器中调用方法。这使我们能够向方法传递自定义参数，而不是原生事件：

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">说 hello</button>
<button @click="say('bye')">说 bye</button>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

</div>

## 在内联处理器中访问事件参数 {#accessing-event-argument-in-inline-handlers}

有时我们还需要在内联处理器中访问原始 DOM 事件。你可以使用特殊的 `$event` 变量将其传入方法，或者使用内联箭头函数：

```vue-html
<!-- 使用 $event 特殊变量 -->
<button @click="warn('表单暂时不能提交。', $event)">
  提交
</button>

<!-- 使用内联箭头函数 -->
<button @click="(event) => warn('表单暂时不能提交。', event)">
  提交
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // 现在我们可以访问原生事件了
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // 现在我们可以访问原生事件了
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## 事件修饰符 {#event-modifiers}

在事件处理器中调用 `event.preventDefault()` 或 `event.stopPropagation()` 是非常常见的需求。虽然我们可以在方法内部轻松做到这一点，但如果这些方法能纯粹只负责数据逻辑，而不必处理 DOM 事件细节，会更好。

为了解决这个问题，Vue 为 `v-on` 提供了**事件修饰符**。回想一下，修饰符是用点号表示的指令后缀。

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- click 事件的传播将被停止 -->
<a @click.stop="doThis"></a>

<!-- submit 事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="doThat"></a>

<!-- 仅修饰符 -->
<form @submit.prevent></form>

<!-- 只有当 event.target 是元素本身时才触发处理器 -->
<!-- 即不是来自子元素 -->
<div @click.self="doThat">...</div>
```

::: tip
使用修饰符时顺序很重要，因为相关代码是按相同顺序生成的。因此，使用 `@click.prevent.self` 会阻止**元素本身及其子元素上的 click 默认行为**，而 `@click.self.prevent` 只会阻止元素本身上的 click 默认行为。
:::

`.capture`、`.once` 和 `.passive` 修饰符对应于 [原生 `addEventListener` 方法的选项](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options)：

```vue-html
<!-- 添加事件监听器时使用捕获模式     -->
<!-- 即，针对内部元素的事件会先在这里处理 -->
<!-- 然后才交给该元素处理           -->
<div @click.capture="doThis">...</div>

<!-- click 事件最多只会触发一次 -->
<a @click.once="doThis"></a>

<!-- scroll 事件的默认行为（滚动）会立即发生 -->
<!-- 而不是等待 `onScroll` 完成 -->
<!-- 以防其中包含 `event.preventDefault()`                -->
<div @scroll.passive="onScroll">...</div>
```

`.passive` 修饰符通常用于触摸事件监听器，以[提升移动设备上的性能](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scroll_performance_using_passive_listeners)。

::: tip
不要同时使用 `.passive` 和 `.prevent`，因为 `.passive` 已经向浏览器表明你_不会_阻止该事件的默认行为，而如果这样做，浏览器很可能会给出警告。
:::

## 按键修饰符 {#key-modifiers}

在监听键盘事件时，我们经常需要检查特定按键。Vue 允许在监听按键事件时，为 `v-on` 或 `@` 添加按键修饰符：

```vue-html
<!-- 仅当 `key` 为 `Enter` 时才调用 `submit` -->
<input @keyup.enter="submit" />
```

你可以直接将 [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) 暴露的任何有效按键名通过转换为 kebab-case 作为修饰符使用。

```vue-html
<input @keyup.page-down="onPageDown" />
```

在上面的例子中，只有当 `$event.key` 等于 `'PageDown'` 时才会调用处理器。

### 按键别名 {#key-aliases}

Vue 为最常用的按键提供了别名：

- `.enter`
- `.tab`
- `.delete`（同时捕获 "Delete" 和 "Backspace" 键）
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### 系统修饰键 {#system-modifier-keys}

你可以使用以下修饰符，仅当按下相应的修饰键时才触发鼠标或键盘事件监听器：

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip 注意
在 Macintosh 键盘上，meta 是 command 键（⌘）。在 Windows 键盘上，meta 是 Windows 键（⊞）。在 Sun Microsystems 键盘上，meta 标记为实心菱形（◆）。在某些键盘上，尤其是 MIT 和 Lisp machine 键盘及其后继产品，例如 Knight 键盘、space-cadet 键盘，meta 标记为“META”。在 Symbolics 键盘上，meta 标记为“META”或“Meta”。
:::

例如：

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">做点什么</div>
```

::: tip
请注意，修饰键与普通按键不同，在与 `keyup` 事件一起使用时，必须在事件触发时处于按下状态。换句话说，只有在按住 `ctrl` 的同时释放某个按键时，`keyup.ctrl` 才会触发。仅释放 `ctrl` 键本身不会触发它。
:::

### `.exact` 修饰符 {#exact-modifier}

`.exact` 修饰符允许控制触发事件所需的系统修饰键的确切组合。

```vue-html
<!-- 即使同时按下 Alt 或 Shift，也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 只有在按下 Ctrl 且没有按下其他按键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 只有在没有按下任何系统修饰键时才会触发 -->
<button @click.exact="onClick">A</button>
```

## 鼠标按钮修饰符 {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

这些修饰符将处理器限制为由特定鼠标按钮触发的事件。

不过需要注意的是，`.left`、`.right` 和 `.middle` 这些修饰符名称是基于典型的右手鼠标布局，但实际上分别代表“主”“次”和“辅助”指针设备事件触发，而不是实际的物理按钮。因此，对于左手鼠标布局，“主”按钮在物理上可能是右边那个，但仍会触发 `.left` 修饰符处理器。或者，触控板可能会用单指轻点触发 `.left` 处理器，用双指轻点触发 `.right` 处理器，用三指轻点触发 `.middle` 处理器。同样，其他生成“鼠标”事件的设备和事件来源，其触发模式也可能与“左”和“右”完全无关。
