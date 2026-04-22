# Vue 的使用方式 {#ways-of-using-vue}

我们相信，Web 并不存在“一刀切”的方案。这也是为什么 Vue 被设计为灵活且可逐步采用的。根据你的使用场景，Vue 可以以不同方式使用，从而在技术栈复杂度、开发体验和最终性能之间取得最佳平衡。

## 独立脚本 {#standalone-script}

Vue 可以作为一个独立的脚本文件使用——无需构建步骤！如果你已经有后端框架在渲染大部分 HTML，或者你的前端逻辑还不够复杂，不值得引入构建步骤，那么这就是将 Vue 集成到你的技术栈中的最简单方式。在这种情况下，你可以把 Vue 看作是对 jQuery 更具声明性的替代方案。

我们之前提供过一个名为 [petite-vue](https://github.com/vuejs/petite-vue) 的替代发行版，它专门针对对现有 HTML 进行渐进式增强进行了优化。不过，petite-vue 现已不再积极维护，最后一个版本发布于 Vue 3.2.27。

## 内嵌 Web Components {#embedded-web-components}

你可以使用 Vue 来[构建标准 Web Components](/guide/extras/web-components)，并将它们嵌入到任何 HTML 页面中，而不受其渲染方式的限制。这个选项允许你以完全不依赖具体使用方的方式利用 Vue：生成的 web components 可以嵌入到传统应用、静态 HTML，甚至是使用其他框架构建的应用中。

## 单页应用（SPA） {#single-page-application-spa}

有些应用需要丰富的交互性、较深的会话深度，以及非平凡的前端状态逻辑。构建这类应用的最佳方式，是采用一种架构，让 Vue 不仅控制整个页面，还能在无需重新加载页面的情况下处理数据更新和导航。这类应用通常被称为单页应用（SPA）。

Vue 提供核心库和[完善的工具链支持](/guide/scaling-up/tooling)，为构建现代 SPA 带来出色的开发体验，包括：

- 客户端路由
- 极速构建工具链
- IDE 支持
- 浏览器开发者工具
- TypeScript 集成
- 测试工具

SPA 通常需要后端暴露 API 端点——但你也可以将 Vue 与 [Inertia.js](https://inertiajs.com) 之类的方案配合使用，在保留以服务器为中心的开发模式的同时获得 SPA 的优势。

## 全栈 / SSR {#fullstack-ssr}

当应用对 SEO 和首屏可用时间敏感时，纯客户端 SPA 会带来问题。这是因为浏览器接收到的 HTML 页面大多是空的，并且必须等到 JavaScript 加载完成后才能渲染任何内容。

Vue 提供一流的 API，可在服务器上将 Vue 应用“渲染”为 HTML 字符串。这使得服务器可以返回已经渲染好的 HTML，让最终用户在 JavaScript 下载的同时立即看到内容。随后，Vue 会在客户端对应用进行“激活”，使其具备交互能力。这被称为[服务端渲染（SSR）](/guide/scaling-up/ssr)，它能显著提升诸如[最大内容绘制（LCP）](https://web.dev/lcp/)等核心网页指标。

基于这一范式，还有更高层的 Vue 框架，例如 [Nuxt](https://nuxt.com/)，可以让你使用 Vue 和 JavaScript 开发全栈应用。

## JAMStack / SSG {#jamstack-ssg}

如果所需数据是静态的，就可以提前进行服务端渲染。这意味着我们可以将整个应用预渲染为 HTML，并以静态文件的形式提供服务。这样可以提升站点性能，并大大简化部署，因为我们不再需要在每次请求时动态渲染页面。Vue 仍然可以对这类应用进行激活，以在客户端提供丰富的交互体验。这种技术通常被称为静态站点生成（SSG），也称为 [JAMStack](https://jamstack.org/what-is-jamstack/)。

SSG 有两种形式：单页和多页。这两种形式都会将站点预渲染为静态 HTML，区别在于：

- 在初始页面加载之后，单页 SSG 会将页面“激活”为一个 SPA。这需要更多前置 JS 负载和激活成本，但后续导航会更快，因为它只需部分更新页面内容，而不必重新加载整个页面。

- 多页 SSG 会在每次导航时加载新页面。其优点是可以发送极少量的 JS——如果页面不需要交互，甚至可以完全不发送 JS！一些多页 SSG 框架，例如 [Astro](https://astro.build/)，也支持“部分激活”——这使你可以使用 Vue 组件在静态 HTML 内创建可交互的“孤岛”。

如果你预计会有较复杂的交互、较长的会话时长，或者需要在导航之间保留元素 / 状态，那么单页 SSG 更适合。否则，多页 SSG 会是更好的选择。

Vue 团队还维护着一个名为 [VitePress](https://vitepress.dev/) 的静态站点生成器，它驱动着你现在正在阅读的这个网站！VitePress 同时支持这两种 SSG 形式。[Nuxt](https://nuxt.com/) 也支持 SSG。你甚至可以在同一个 Nuxt 应用中为不同路由混合使用 SSR 和 SSG。

## 超越 Web {#beyond-the-web}

虽然 Vue 主要是为构建 Web 应用而设计的，但它绝不仅限于浏览器。你可以：

- 使用 [Electron](https://www.electronjs.org/) 或 [Wails](https://wails.io) 构建桌面应用
- 使用 [Ionic Vue](https://ionicframework.com/docs/vue/overview) 构建移动应用
- 使用 [Quasar](https://quasar.dev/) 或 [Tauri](https://tauri.app) 基于同一代码库构建桌面和移动应用
- 使用 [TresJS](https://tresjs.org/) 构建 3D WebGL 体验
- 使用 Vue 的[自定义渲染器 API](/api/custom-renderer)来构建自定义渲染器，例如用于[终端](https://github.com/vue-terminal/vue-termui)的渲染器！
