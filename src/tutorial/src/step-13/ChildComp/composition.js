export default {
  emits: ['response'],
  setup(props, { emit }) {
    emit('response', '来自子组件的问候')
    return {}
  }
}
