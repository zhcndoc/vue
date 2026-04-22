import { ref } from 'vue'

export default {
  setup() {
    const message = ref('你好，世界！')

    function reverseMessage() {
      // Access/mutate the value of a ref via
      // its .value property.
      message.value = message.value.split('').reverse().join('')
    }

    function notify() {
      alert('已阻止导航。')
    }

    return {
      message,
      reverseMessage,
      notify
    }
  }
}
