<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Vue 合作伙伴' }}</template>
    <template #lead>
      <p>
        Vue 合作伙伴是经过 Vue 团队认可、能够提供一流 Vue 咨询与开发服务的机构。如果你的公司有兴趣加入合作伙伴列表，请
        <a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank"
          >在这里提交意向</a
        >.
      </p>
    </template>
  </PageHero>
</template>
