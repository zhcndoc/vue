---
outline: deep
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# 发布版本 {#releases}

<p v-if="version">
Vue 当前最新稳定版本是 <strong>{{ version }}</strong>。
</p>
<p v-else>
正在检查最新版本...
</p>

过去发布版本的完整更新日志可在 [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md) 上查看。

## 发布周期 {#release-cycle}

Vue 没有固定的发布周期。

- 补丁版本会在需要时发布。

- 次版本始终包含新功能，通常间隔为 3~6 个月。次版本发布始终会经过 beta 预发布阶段。

- 主版本会提前公告，并会经历早期讨论阶段以及 alpha / beta 预发布阶段。

## 语义化版本控制的边界情况 {#semantic-versioning-edge-cases}

Vue 的发布遵循 [语义化版本控制](https://semver.org/)，但有一些边界情况。

### TypeScript 定义 {#typescript-definitions}

我们可能会在 **次版本** 之间为 TypeScript 定义引入不兼容变更。这是因为：

1. 有时 TypeScript 本身会在次版本之间引入不兼容变更，而我们可能需要调整类型以支持更新版本的 TypeScript。

2. 有时我们可能需要采用只有较新版本 TypeScript 才提供的特性，从而提高 TypeScript 的最低要求版本。

如果你在使用 TypeScript，可以使用一个 semver 范围来锁定当前次版本，并在 Vue 发布新次版本时手动升级。

### 与旧运行时的编译代码兼容性 {#compiled-code-compatibility-with-older-runtime}

较新的 Vue 编译器 **次版本** 可能会生成与较旧次版本 Vue 运行时不兼容的代码。例如，由 Vue 3.2 编译器生成的代码，在由 Vue 3.1 运行时时可能无法完全兼容。

这只会影响库作者，因为在应用中，编译器版本和运行时版本始终相同。只有当你将预编译的 Vue 组件代码作为包发布，而使用者在一个采用较旧 Vue 版本的项目中使用它时，才会发生版本不匹配。因此，你的包可能需要明确声明 Vue 所需的最低次版本。

## 预发布版本 {#pre-releases}

次版本和主版本通常会经历一系列预发布阶段：**alpha**、**beta** 和 **release candidate（RC）**。预发布版本的数量和类型取决于变更范围。例如，更新较少的次版本可能只会有 beta 阶段，而主版本通常会包含全部三个阶段，以便进行充分测试和社区反馈。

你可以使用 `npx install-vue@alpha`、`npx install-vue@beta` 或 `npx install-vue@rc` 从 npm 安装最新的预发布版本。对于测试尚未包含在已标记预发布版本中的变更，`vuejs/core` 仓库中的每一次提交都会发布为临时的持续发布预览版，你可以使用 `npx install-vue@edge` 安装。

预发布版本用于集成 / 稳定性测试，以及让早期采用者为不稳定特性提供反馈。不要在生产环境中使用预发布版本。所有预发布版本都被视为不稳定版本，并且中间可能会发布破坏性变更，因此在使用预发布版本时务必锁定到确切版本。

## 弃用 {#deprecations}

我们可能会定期弃用在次版本中已有更新、更好替代方案的特性。被弃用的特性仍将继续工作，并会在进入弃用状态后的下一个主版本中移除。

## RFC {#rfcs}

具有较大 API 面积和重大变更的新特性将通过 **Request for Comments**（RFC）流程。RFC 流程旨在为新特性进入框架提供一条一致且受控的路径，并让用户有机会参与并在设计过程中提供反馈。

RFC 流程在 GitHub 上的 [vuejs/rfcs](https://github.com/vuejs/rfcs) 仓库中进行。

## 实验性特性 {#experimental-features}

某些特性会随 Vue 的稳定版本一起发布并记录在文档中，但会被标记为实验性。实验性特性通常是指已经有相关 RFC 讨论、且大部分设计问题已在纸面上解决，但仍缺少真实世界使用反馈的特性。

实验性特性的目标，是让用户能够在生产环境中对其进行测试并提供反馈，而无需使用不稳定版本的 Vue。实验性特性本身被视为不稳定，应仅以受控方式使用，并且要接受该特性可能在任何发布类型之间发生变化的预期。
