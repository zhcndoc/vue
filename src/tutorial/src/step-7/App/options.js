// give each todo a unique id
let id = 0

export default {
  data() {
    return {
      newTodo: '',
      todos: [
        { id: id++, text: '学习 HTML' },
        { id: id++, text: '学习 JavaScript' },
        { id: id++, text: '学习 Vue' }
      ]
    }
  },
  methods: {
    addTodo() {
      // ...
      this.newTodo = ''
    },
    removeTodo(todo) {
      // ...
    }
  }
}
