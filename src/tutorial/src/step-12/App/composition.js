import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const greeting = ref('来自父组件的问候')

    return {
      greeting
    }
  }
}
