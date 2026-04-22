import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const childMsg = ref('还没有来自子组件的消息')

    return {
      childMsg
    }
  }
}
