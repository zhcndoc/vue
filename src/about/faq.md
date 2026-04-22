# 常见问题解答 {#frequently-asked-questions}

## 谁维护 Vue？ {#who-maintains-vue}

Vue 是一个独立的、由社区驱动的项目。它由 [Evan You](https://x.com/youyuxi) 于 2014 年创建，最初只是一个个人副项目。如今，Vue 由 [一支来自世界各地、由全职和志愿成员组成的团队](/about/team) 积极维护，Evan 担任项目负责人。你可以在这部 [纪录片](https://www.youtube.com/watch?v=OrxmtDw4pVI) 中了解更多关于 Vue 的故事。

Vue 的开发主要通过赞助来资助，自 2016 年以来我们一直在财务上保持可持续。如果你或你的企业受益于 Vue，请考虑通过 [赞助我们](/sponsor/) 来支持 Vue 的开发！

## Vue 2 和 Vue 3 有什么区别？ {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 是 Vue 当前最新的主版本。它包含 Vue 2 中没有的新特性，例如 Teleport、Suspense，以及每个模板支持多个根元素。它还包含一些破坏性变更，使其与 Vue 2 不兼容。完整细节记录在 [Vue 3 迁移指南](https://v3-migration.vuejs.org/) 中。

尽管存在这些差异，Vue 的大部分 API 在两个主版本之间是共享的，因此你在 Vue 2 中掌握的大多数知识在 Vue 3 中仍然适用。值得注意的是，Composition API 最初只是 Vue 3 独有的特性，但现在已经回移植到 Vue 2，并可在 [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01) 中使用。

一般来说，Vue 3 提供更小的打包体积、更好的性能、更好的可扩展性，以及更好的 TypeScript / IDE 支持。如果你今天要开始一个新项目，推荐选择 Vue 3。到目前为止，你只有少数几个理由考虑使用 Vue 2：

- 你需要支持 IE11。Vue 3 利用了现代 JavaScript 特性，不支持 IE11。

如果你打算将现有的 Vue 2 应用迁移到 Vue 3，请查阅 [迁移指南](https://v3-migration.vuejs.org/)。

## Vue 2 仍然受支持吗？ {#is-vue-2-still-supported}

Vue 2.7 于 2022 年 7 月发布，是 Vue 2 版本范围内最后一个次要版本。Vue 2 已进入维护模式：它将不再发布新特性，但会从 2.7 发布之日起继续获得 18 个月的关键 bug 修复和安全更新。这意味着 **Vue 2 已于 2023 年 12 月 31 日达到生命周期终点（End of Life）**。

我们认为这应该为生态系统中的大多数项目迁移到 Vue 3 提供充足时间。不过，我们也理解有些团队或项目可能无法在这个时间表内升级，同时仍需满足安全和合规要求。我们正与行业专家合作，为有此类需求的团队提供 Vue 2 的延长支持——如果你的团队预计会在 2023 年底之后继续使用 Vue 2，请务必提前规划，并了解更多关于 [Vue 2 Extended LTS](https://v2.vuejs.org/lts/) 的信息。

## Vue 使用什么许可证？ {#what-license-does-vue-use}

Vue 是一个在 [MIT 许可证](https://opensource.org/licenses/MIT) 下发布的免费开源项目。

## Vue 支持哪些浏览器？ {#what-browsers-does-vue-support}

Vue 的最新版本（3.x）仅支持 [原生支持 ES2016 的浏览器](https://caniuse.com/es2016)。这不包括 IE11。Vue 3.x 使用了无法在旧版浏览器中通过 polyfill 实现的 ES2016 特性，因此如果你需要支持旧版浏览器，就需要改用 Vue 2.x。

## Vue 可靠吗？ {#is-vue-reliable}

Vue 是一个成熟且经过实战检验的框架。它是当今生产环境中使用最广泛的 JavaScript 框架之一，全球拥有超过 150 万用户，并且在 npm 上每月下载量接近 1000 万次。

Vue 已被全球各地的知名组织在不同场景下用于生产环境，包括 Wikimedia Foundation、NASA、Apple、Google、Microsoft、GitLab、Zoom、腾讯、新浪微博、哔哩哔哩、快手等众多组织。

## Vue 快吗？ {#is-vue-fast}

Vue 3 是性能最强的主流前端框架之一，能够轻松处理大多数 Web 应用场景，而无需手动优化。

在压力测试场景下，Vue 在 [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html) 中比 React 和 Angular 表现更好，且优势明显。它在该基准测试中也能与一些速度最快的生产级非 Virtual DOM 框架平分秋色。

请注意，像上面这样的合成基准测试关注的是经过特定优化的原始渲染性能，可能并不能完全代表真实世界中的性能结果。如果你更关心页面加载性能，欢迎使用 [WebPageTest](https://www.webpagetest.org/lighthouse) 或 [PageSpeed Insights](https://pagespeed.web.dev/) 来审计本网站。本网站由 Vue 本身驱动，采用 SSG 预渲染、整页 hydration 以及 SPA 客户端导航。在慢速 4G 网络、Moto G4 模拟设备、4 倍 CPU 限速条件下，它的性能得分为 100。

你可以在 [渲染机制](/guide/extras/rendering-mechanism) 章节中了解 Vue 如何自动优化运行时性能，也可以在 [性能优化指南](/guide/best-practices/performance) 中了解在特别苛刻的场景下如何优化 Vue 应用。

## Vue 轻量吗？ {#is-vue-lightweight}

当你使用构建工具时，Vue 的许多 API 都是 ["tree-shakable"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) 的。例如，如果你没有使用内置的 `<Transition>` 组件，它就不会被包含在最终的生产构建包中。

一个只使用最基本 API 的 Vue “hello world” 应用，在经过压缩和 brotli 压缩后，基线大小仅约 **16kb**。应用的实际大小取决于你使用了框架中的多少可选功能。在极少见的情况下，如果一个应用用到了 Vue 提供的每一项功能，那么总运行时大小大约是 **27kb**。

在不使用构建工具的情况下使用 Vue，我们不仅失去了 tree-shaking，还必须将模板编译器一并发送到浏览器。这会将体积膨胀到大约 **41kb**。因此，如果你主要将 Vue 用于渐进增强且不使用构建步骤，建议改用 [petite-vue](https://github.com/vuejs/petite-vue)（仅 **6kb**）。

一些框架，比如 Svelte，采用编译策略，在单组件场景下能生成极其轻量的输出。不过，[我们的研究](https://github.com/yyx990803/vue-svelte-size-analysis) 显示，体积差异在很大程度上取决于应用中的组件数量。虽然 Vue 的基线体积更大，但它为每个组件生成的代码更少。在真实场景中，Vue 应用完全有可能最终更轻量。

## Vue 可扩展吗？ {#does-vue-scale}

可以。尽管人们常误以为 Vue 只适合简单场景，但 Vue 完全能够处理大规模应用：

- [单文件组件](/guide/scaling-up/sfc) 提供了一种模块化的开发模型，使应用的不同部分可以独立开发。

- [Composition API](/guide/reusability/composables) 提供一流的 TypeScript 集成，并支持用于组织、提取和复用复杂逻辑的清晰模式。

- [完善的工具支持](/guide/scaling-up/tooling) 确保应用随着增长仍能保持顺畅的开发体验。

- 更低的入门门槛和优秀的文档意味着新开发者的上手和培训成本更低。

## 我如何为 Vue 做贡献？ {#how-do-i-contribute-to-vue}

感谢你的关注！请查看我们的 [社区指南](/about/community-guide)。

## 我应该使用 Options API 还是 Composition API？ {#should-i-use-options-api-or-composition-api}

如果你是 Vue 新手，我们在[这里](/guide/introduction#which-to-choose)提供了这两种风格的高层比较。

如果你之前使用过 Options API，并且正在评估 Composition API，请查看 [这个 FAQ](/guide/extras/composition-api-faq)。

## 我应该在 Vue 中使用 JavaScript 还是 TypeScript？ {#should-i-use-javascript-or-typescript-with-vue}

虽然 Vue 本身是用 TypeScript 实现的，并提供一流的 TypeScript 支持，但它不会强制你作为用户必须使用 TypeScript。

当 Vue 添加新特性时，TypeScript 支持是一个重要的考虑因素。即使你自己没有使用 TypeScript，那些以 TypeScript 为设计考虑的 API 通常也更容易被 IDE 和 lint 工具理解。大家都受益。Vue 的 API 也尽可能设计为在 JavaScript 和 TypeScript 中以相同方式工作。

采用 TypeScript 需要在上手复杂度和长期可维护性收益之间做出权衡。这种权衡是否值得，取决于你的团队背景和项目规模，但 Vue 本身并不是影响这一决定的主要因素。

## Vue 与 Web Components 相比如何？ {#how-does-vue-compare-to-web-components}

Vue 创建于 Web Components 还不能原生使用之前，而 Vue 设计中的某些方面（例如 slots）受到了 Web Components 模型的启发。

Web Components 规范相对偏底层，因为它们的核心是定义自定义元素。作为一个框架，Vue 还处理了其他更高层次的问题，例如高效的 DOM 渲染、响应式状态管理、工具链、客户端路由以及服务端渲染。

Vue 也完全支持使用原生自定义元素或将其导出——更多细节请查看 [Vue 与 Web Components 指南](/guide/extras/web-components)。

<!-- ## TODO Vue 与 React 相比如何？ -->

<!-- ## TODO Vue 与 Angular 相比如何？ -->
