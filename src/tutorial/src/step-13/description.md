# 触发事件 {#emits}

除了接收 props 之外，子组件还可以向父组件触发事件：

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// 声明触发的事件
const emit = defineEmits(['response'])

// 带参数触发
emit('response', '来自子组件的问候')
</script>
```

</div>

<div class="html">

```js
export default {
  // 声明触发的事件
  emits: ['response'],
  setup(props, { emit }) {
    // 带参数触发
    emit('response', '来自子组件的问候')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // 声明触发的事件
  emits: ['response'],
  created() {
    // 带参数触发
    this.$emit('response', '来自子组件的问候')
  }
}
```

</div>

<span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> 的第一个参数是事件名。任何额外的参数都会传递给事件监听器。

父组件可以使用 `v-on` 监听子组件触发的事件——这里处理函数会接收到子组件触发时传来的额外参数，并将其赋值给本地状态：

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

现在就在编辑器中亲自试试吧。
