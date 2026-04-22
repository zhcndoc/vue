<script setup>
import { ref } from 'vue'
const msg = ref('')
</script>

<template>
  <p>当前组件：B</p>
  <span style="margin-right: 20px">消息：{{ msg }}</span>
  <input v-model="msg">
</template>
