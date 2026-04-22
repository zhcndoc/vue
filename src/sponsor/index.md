---
sidebar: false
ads: false
editLink: false
sponsors: false
---

<script setup>
import SponsorsGroup from '@theme/components/SponsorsGroup.vue'
import { load, data } from '@theme/components/sponsors'
import { onMounted } from 'vue'

onMounted(load)
</script>

# 成为 Vue.js 赞助商 {#become-a-vue-js-sponsor}

Vue.js 是一个采用 MIT 许可证的开源项目，完全可以免费使用。
维护这样一个庞大的生态系统并为项目开发新功能所需付出的巨大努力，只有在赞助商慷慨的资金支持下才能得以持续。

## 如何赞助 {#how-to-sponsor}

赞助可以通过 [GitHub Sponsors](https://github.com/sponsors/yyx990803) 或 [OpenCollective](https://opencollective.com/vuejs) 完成。发票可通过 GitHub 的支付系统获取。我们接受按月持续赞助和一次性捐赠。持续赞助可按照 [赞助等级](#tier-benefits) 的规定获得徽标展示位置。

如果你对等级、支付流程或赞助曝光数据有任何疑问，请联系 [sponsor@vuejs.org](mailto:sponsor@vuejs.org?subject=Vue.js%20sponsorship%20inquiry)。

## 作为企业赞助 Vue {#sponsoring-vue-as-a-business}

赞助 Vue 可让你通过我们的网站和 GitHub 项目 README，在全球范围内向超过 **200 万** Vue 开发者获得极佳曝光。这不仅能直接带来潜在客户，还能提升你作为重视开源的企业品牌认知。这是一项无形但极其重要的资产，尤其适合面向开发者构建产品的公司，因为它能提高转化率。

如果你正在使用 Vue 构建一个能产生收入的产品，那么赞助 Vue 的开发在商业上是合理的：**这能确保你的产品所依赖的项目保持健康并持续维护。** 在 Vue 社区中的曝光和积极品牌形象，也能让你更容易吸引和招募 Vue 开发者。

如果你正在构建的产品目标客户是开发者，那么你将通过赞助曝光获得高质量流量，因为我们所有的访问者都是开发者。赞助还能够建立品牌认知并提高转化率。

## 作为个人赞助 Vue {#sponsoring-vue-as-an-individual}

如果你是个人用户，并且已经享受到了使用 Vue 带来的效率提升，欢迎考虑捐赠以表达感谢——就像偶尔请我们喝杯咖啡一样。我们团队中的许多成员都通过 GitHub Sponsors 接受赞助和捐赠。请在我们的 [团队页面](/about/team) 中查看每位团队成员个人资料上的 “Sponsor” 按钮。

你也可以尝试说服你的雇主以企业身份赞助 Vue。这可能并不容易，但企业赞助通常比个人捐赠对 OSS 项目的可持续性产生更大的影响，因此如果你成功了，你将会帮助我们更多。

## 等级权益 {#tier-benefits}

- **全球特别赞助商**：
  - 全球仅限 **一** 位赞助商。<span v-if="!data?.special">目前空缺。[联系我们](mailto:sponsor@vuejs.org?subject=Vue.js%20special%20sponsor%20inquiry)！</span><span v-else>（目前已满）</span>
  - （独占）在 [vuejs.org](/) 首页首屏展示徽标。
  - （独占）通过 [Vue 官方 X 账号](https://x.com/vuejs)（32 万关注者）对重大产品发布进行特别致谢和定期转发。
  - 在所有低于该等级的位置中拥有最醒目的徽标展示。
- **铂金（USD$2,000/月）**：
  - 在 [vuejs.org](/) 首页显著展示徽标。
  - 在所有内容页的侧边栏中显著展示徽标。
  - 在 [`vuejs/core`](https://github.com/vuejs/core) 和 [`vuejs/vue`](https://github.com/vuejs/core) 的 README 中显著展示徽标。
- **黄金（USD$500/月）**：
  - 在 [vuejs.org](/) 首页以大尺寸展示徽标。
  - 在 `vuejs/core` 和 `vuejs/vue` 的 README 中以大尺寸展示徽标。
- **白银（USD$250/月）**：
  - 在 `vuejs/core` 和 `vuejs/vue` 的 `BACKERS.md` 文件中以中等尺寸展示徽标。
- **青铜（USD$100/月）**：
  - 在 `vuejs/core` 和 `vuejs/vue` 的 `BACKERS.md` 文件中以小尺寸展示徽标。
- **慷慨支持者（USD$50/月）**：
  - 名字列在 `vuejs/core` 和 `vuejs/vue` 的 `BACKERS.md` 文件中，位于其他个人支持者之上。
- **个人支持者（USD$5/月）**：
  - 名字列在 `vuejs/core` 和 `vuejs/vue` 的 `BACKERS.md` 文件中。

## 当前赞助商 {#current-sponsors}

### 全球特别赞助商 {#special-global-sponsor}

<SponsorsGroup tier="special" placement="page" />

### 铂金 {#platinum}

<SponsorsGroup tier="platinum" placement="page" />

### 铂金（中国） {#platinum-china}

<SponsorsGroup tier="platinum_china" placement="page" />

### 黄金 {#gold}

<SponsorsGroup tier="gold" placement="page" />

### 白银 {#silver}

<SponsorsGroup tier="silver" placement="page" />
