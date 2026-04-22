import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const msg = ref('来自父组件')

    return {
      msg
    }
  }
}
