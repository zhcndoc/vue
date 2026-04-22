# 列表渲染 {#list-rendering}

我们可以使用 `v-for` 指令根据源数组渲染元素列表：

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

这里 `todo` 是一个局部变量，表示当前正在迭代的数组元素。它只能在 `v-for` 元素上或其内部访问，类似于函数作用域。

请注意，我们还为每个 todo 对象提供了一个唯一的 `id`，并将其作为每个 `<li>` 的 <a target="_blank" href="/api/built-in-special-attributes.html#key">特殊 `key` 属性</a> 进行绑定。`key` 允许 Vue 准确地移动每个 `<li>`，以匹配其在数组中对应对象的位置。

更新列表有两种方式：

1. 在源数组上调用 [变更方法](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating)：

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. 将数组替换为一个新数组：

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

这里我们有一个简单的待办事项列表——试着实现 `addTodo()` 和 `removeTodo()` 方法的逻辑，让它工作起来吧！

更多关于 `v-for` 的细节：<a target="_blank" href="/guide/essentials/list.html">指南 - 列表渲染</a>
