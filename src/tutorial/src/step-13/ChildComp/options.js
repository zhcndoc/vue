export default {
  emits: ['response'],
  created() {
    this.$emit('response', '来自子组件的问候')
  }
}
