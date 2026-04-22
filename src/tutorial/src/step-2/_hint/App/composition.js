import { reactive, ref } from 'vue'

export default {
  setup() {
    const counter = reactive({ count: 0 })
    const message = ref('你好，世界！')

    return {
      counter,
      message
    }
  }
}
