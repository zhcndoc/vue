import { ref } from 'vue'

export default {
  setup() {
    // give each todo a unique id
    let id = 0

    const newTodo = ref('')
    const todos = ref([
      { id: id++, text: '学习 HTML' },
      { id: id++, text: '学习 JavaScript' },
      { id: id++, text: '学习 Vue' }
    ])

    function addTodo() {
      todos.value.push({ id: id++, text: newTodo.value })
      newTodo.value = ''
    }

    function removeTodo(todo) {
      todos.value = todos.value.filter((t) => t !== todo)
    }

    return {
      newTodo,
      todos,
      addTodo,
      removeTodo
    }
  }
}
