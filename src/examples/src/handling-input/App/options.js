export default {
  data() {
    return {
      message: '你好，世界！'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('')
    },
    notify() {
      alert('已阻止导航。')
    }
  }
}
