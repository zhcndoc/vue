# 路由 {#routing}

## 客户端路由 vs. 服务端路由 {#client-side-vs-server-side-routing}

服务端路由意味着服务器会根据用户正在访问的 URL 路径返回响应。在传统的服务端渲染 Web 应用中，当我们点击一个链接时，浏览器会从服务器接收 HTML 响应，并使用新的 HTML 重新加载整个页面。

然而，在 [单页应用](https://developer.mozilla.org/en-US/docs/Glossary/SPA)（SPA）中，客户端 JavaScript 可以拦截导航，动态获取新数据，并在不进行整页刷新 的情况下更新当前页面。这通常会带来更流畅的用户体验，尤其适用于更像真正“应用程序”的场景，即用户需要在较长时间内进行大量交互。

在这类 SPA 中，“路由”是在客户端、也就是浏览器中完成的。客户端路由器负责使用浏览器 API（例如 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 或 [`hashchange` 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)）来管理应用程序渲染出的视图。

## 官方路由器 {#official-router}

<!-- TODO 更新链接 -->
<div>
  <VueSchoolLink href="https://vueschool.io/courses/vue-router-4-for-everyone" title="免费 Vue Router 课程">
    在 Vue School 上观看免费视频课程
  </VueSchoolLink>
</div>

Vue 非常适合构建 SPA。对于大多数 SPA，建议使用官方支持的 [Vue Router 库](https://github.com/vuejs/router)。更多详情请参阅 Vue Router 的 [文档](https://router.vuejs.org/)。

## 从零开始的简单路由 {#simple-routing-from-scratch}

如果你只需要非常简单的路由，并且不想引入完整功能的路由库，那么你可以使用 [动态组件](/guide/essentials/component-basics#dynamic-components)，并通过监听浏览器的 [`hashchange` 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) 或使用 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 来更新当前组件状态。

这是一个非常简陋的示例：

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/">首页</a> |
  <a href="#/about">关于</a> |
  <a href="#/non-existent-path">失效链接</a>
  <component :is="currentView" />
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNptUk1vgkAQ/SsTegAThZp4MmhikzY9mKanXkoPWxjLRpgly6JN1P/eWb5Eywlm572ZN2/m5GyKwj9U6CydsIy1LAyUaKpiHZHMC6UNnEDjbgqxyovKYAIX2GmVg8sktwe9qhzbdz+wga15TW++VWX6fB3dAt6UeVEVJT2me2hhEcWKSgOamVjCCk4RAbiBu6xbT5tI2ML8VDeI6HLlxZXWSOZdmJTJPJB3lJSoo5+pWBipyE9FmU4soU2IJHk+MGUrS4OE2nMtIk4F/aA7BW8Cq3WjYlDbP4isQu4wVp0F1Q1uFH1IPDK+c9cb1NW8B03tyJ//uvhlJmP05hM4n60TX/bb2db0CoNmpbxMDgzmRSYMcgQQCkjZhlXkPASRs7YmhoFYw/k+WXvKiNrTcQgpmuFv7ZOZFSyQ4U9a7ZFgK2lvSTXFDqmIQbCUJTMHFkQOBAwKg16kM3W6O7K3eSs+nbeK+eee1V/XKK0dY4Q3vLhR6uJxMUK8/AFKaB6k)

</div>

<div class="options-api">

```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': Home,
  '/about': About
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>

<template>
  <a href="#/">首页</a> |
  <a href="#/about">关于</a> |
  <a href="#/non-existent-path">失效链接</a>
  <component :is="currentView" />
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNptUstO6zAQ/ZVR7iKtVJKLxCpKK3Gli1ggxIoNZmGSKbFoxpEzoUi0/87YeVBKNonHPmfOmcdndN00yXuHURblbeFMwxtFpm6sY7i1NcLW2RriJPWBB8bT8/WL7Xh6D9FPwL3lG9tROWHGiwGmqLDUMjhhYgtr+FQEEKdxFqRXfaR9YrkKAoqOnocfQaDEre523PNKzXqx7M8ADrlzNEYAReccEj9orjLYGyrtPtnZQrOxlFS6rXqgZJdPUC5s3YivMhuTDCkeDe6/dSalvognrkybnIgl7c4UuLhcwuHgS3v2/7EPvzRruRXJ7/SDU12W/98l451pGQndIvaWi0rTK8YrEPx64ymKFQOce5DOzlfs4cdlkA+NzdNpBSRgrJudZpQIINdQOdyuVfQnVdHGzydP9QYO549hXIII45qHkKUL/Ail8EUjBgX+z9k3JLgz9OZJgeInYElAkJlWmCcDUBGkAsrTyWS0isYV9bv803x1OTiWwzlrWtxZ2lDGDO90mWepV3+vZojHL3QQKQE=)

</div>
