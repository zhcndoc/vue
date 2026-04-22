import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  data() {
    return {
      childMsg: '还没有来自子组件的消息'
    }
  }
}
