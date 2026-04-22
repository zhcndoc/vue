import { ref, computed } from 'vue'

export default {
  setup() {
    let id = 0

    const newTodo = ref('')
    const hideCompleted = ref(false)
    const todos = ref([
        { id: id++, text: '学习 HTML', done: true },
        { id: id++, text: '学习 JavaScript', done: true },
        { id: id++, text: '学习 Vue', done: false }
    ])

    const filteredTodos = computed(() => {
      return hideCompleted.value
        ? todos.value.filter((t) => !t.done)
        : todos.value
    })

    function addTodo() {
      todos.value.push({ id: id++, text: newTodo.value, done: false })
      newTodo.value = ''
    }

    function removeTodo(todo) {
      todos.value = todos.value.filter((t) => t !== todo)
    }

    return {
      newTodo,
      hideCompleted,
      todos,
      filteredTodos,
      addTodo,
      removeTodo
    }
  }
}
