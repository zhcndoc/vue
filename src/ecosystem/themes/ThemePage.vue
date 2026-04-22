<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>主题</template>
      <template #lead>探索这些主题、UI 工具包和插件。你还可以看到我们的合作伙伴如何使用 Vue 构建真实世界应用。</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      想在这里展示你的主题？<a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">联系我们！</a>
    </ThemeContact>
  </div>
</template>
