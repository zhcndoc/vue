import { ref, onMounted } from 'vue'

export default {
  setup() {
    const pElementRef = ref(null)

    onMounted(() => {
      pElementRef.value.textContent = '已挂载！'
    })

    return {
      pElementRef
    }
  }
}
