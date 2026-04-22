<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <p>当前组件：A</p>
  <span style="margin-right: 20px">计数：{{ count }}</span>
  <button @click="count++">+</button>
</template>
