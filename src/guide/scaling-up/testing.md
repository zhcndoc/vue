<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>
<style>
.lambdatest {
  background-color: var(--vt-c-bg-soft);
  border-radius: 8px;
  padding: 12px 16px 12px 12px;
  font-size: 13px;
  a {
    display: flex;
    color: var(--vt-c-text-2);
  }
  img {
    background-color: #fff;
    padding: 12px 16px;
    border-radius: 6px;
    margin-right: 24px;
  }
  .testing-partner {
    color: var(--vt-c-text-1);
    font-size: 15px;
    font-weight: 600;
  }
}
</style>

# 测试 {#testing}

## 为什么要测试？ {#why-test}

自动化测试可以帮助你和你的团队通过防止回归并鼓励你将应用拆分为可测试的函数、模块、类和组件，从而快速而自信地构建复杂的 Vue 应用。和任何应用一样，你的新 Vue 应用也可能以多种方式出问题，因此能够尽早捕获这些问题并在发布前修复它们非常重要。

在本指南中，我们将介绍基础术语，并就为你的 Vue 3 应用选择哪些工具提供我们的建议。

其中有一个针对 Vue 的特定部分，涵盖组合式函数。有关更多细节，请参见下方的 [测试组合式函数](#testing-composables)。

## 何时测试 {#when-to-test}

尽早开始测试！我们建议你尽可能早地开始编写测试。你越晚给应用添加测试，应用所依赖的内容就越多，启动测试也就越困难。

## 测试类型 {#testing-types}

在设计 Vue 应用的测试策略时，你应该利用以下测试类型：

- **单元测试**：检查给定函数、类或组合式函数的输入是否产生预期的输出或副作用。
- **组件测试**：检查组件是否能挂载、渲染、是否可交互，以及行为是否符合预期。这类测试导入的代码比单元测试更多，更复杂，执行时间也更长。
- **端到端测试**：检查跨多个页面的功能，并针对你生产构建后的 Vue 应用发起真实的网络请求。这类测试通常涉及启动数据库或其他后端。

每一种测试类型都在你的应用测试策略中扮演着角色，并且各自能保护你免受不同类型问题的影响。

## 概览 {#overview}

我们将简要讨论这些测试类型分别是什么、如何为 Vue 应用实现它们，并提供一些通用建议。

## 单元测试 {#unit-testing}

单元测试用于验证小而独立的代码单元是否按预期工作。一个单元测试通常覆盖一个函数、类、组合式函数或模块。单元测试关注逻辑正确性，只关心应用整体功能中的一小部分。它们可能会模拟应用环境的很大一部分（例如初始状态、复杂类、第三方模块和网络请求）。

一般来说，单元测试会捕获函数业务逻辑和逻辑正确性方面的问题。

例如，下面这个 `increment` 函数：

```js [helpers.js]
export function increment(current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

由于它非常独立，我们很容易调用 increment 函数并断言它返回了应有的结果，因此我们会编写一个单元测试。

如果这些断言中的任何一个失败了，就很明显问题出在 `increment` 函数内部。

```js{3-15} [helpers.spec.js]
import { increment } from './helpers'

describe('increment', () => {
  test('increments the current number by 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('does not increment the current number over the max', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('has a default max of 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

如前所述，单元测试通常应用于不涉及 UI 渲染、网络请求或其他环境因素的自包含业务逻辑、组件、类、模块或函数。

这些通常是与 Vue 无关的普通 JavaScript / TypeScript 模块。一般来说，为 Vue 应用中的业务逻辑编写单元测试，与使用其他框架的应用并没有显著差异。

有两种情况你**应该**对 Vue 特有功能进行单元测试：

1. 组合式函数
2. 组件

### 组合式函数 {#composables}

Vue 应用特有的一类函数是 [组合式函数](/guide/reusability/composables)，它们在测试期间可能需要特殊处理。
更多细节请参见下方的 [测试组合式函数](#testing-composables)。

### 组件的单元测试 {#unit-testing-components}

组件可以通过两种方式进行测试：

1. 白盒：单元测试

   所谓“白盒测试”，是指测试会了解组件的实现细节和依赖关系。它们的重点是将被测组件**隔离**出来。这类测试通常会模拟组件的一些甚至全部子组件，以及设置插件状态和依赖项（例如 Pinia）。

2. 黑盒：组件测试

   所谓“黑盒测试”，是指测试不了解组件的实现细节。这类测试尽可能少地进行模拟，以测试你的组件与整个系统之间的集成。它们通常会渲染所有子组件，因此更接近“集成测试”。请参见下方的 [组件测试建议](#component-testing)。

### 建议 {#recommendation}

- [Vitest](https://vitest.dev/)

  由于 `create-vue` 创建的官方脚手架是基于 [Vite](https://vite.dev/) 的，我们建议使用能够直接利用 Vite 中相同配置和转换管线的单元测试框架。[Vitest](https://vitest.dev/) 是专门为此目的设计的单元测试框架，由 Vue / Vite 团队成员创建并维护。它能以极低的成本与基于 Vite 的项目集成，而且速度极快。

### 其他选项 {#other-options}

- [Jest](https://jestjs.io/) 是一个流行的单元测试框架。不过，我们只在你已有一套需要迁移到基于 Vite 的项目中的 Jest 测试套件时才推荐使用 Jest，因为 Vitest 提供了更无缝的集成和更好的性能。

## 组件测试 {#component-testing}

在 Vue 应用中，组件是 UI 的主要构建块。因此，在验证应用行为时，组件是天然的隔离单元。从粒度角度看，组件测试位于单元测试之上，可以被视为一种集成测试。你的 Vue 应用中的大部分内容都应该由组件测试覆盖，我们建议每个 Vue 组件都有自己独立的 spec 文件。

组件测试应该捕获与组件的 props、事件、所提供的插槽、样式、类、生命周期钩子等相关的问题。

组件测试不应该模拟子组件，而应像用户一样通过与组件交互来测试你的组件与其子组件之间的交互。例如，组件测试应该像用户一样点击元素，而不是以编程方式与组件交互。

组件测试应聚焦于组件的公共接口，而不是内部实现细节。对大多数组件来说，公共接口仅限于：触发的事件、props 和插槽。测试时请记住：**测试组件做了什么，而不是它怎么做的**。

**应该**

- 对于**视觉**逻辑：基于输入的 props 和插槽断言正确的渲染输出。
- 对于**行为**逻辑：断言在用户输入事件响应下正确的渲染更新或触发的事件。

  在下面的示例中，我们展示了一个 Stepper 组件，它有一个标记为“increment”的 DOM 元素，并且可以被点击。我们传入一个名为 `max` 的 prop，它会阻止 Stepper 增加超过 `2`，因此如果我们点击按钮 3 次，UI 仍应显示 `2`。

  我们对 Stepper 的实现一无所知，只知道“输入”是 `max` prop，而“输出”是用户所看到的 DOM 状态。

::: code-group

```js [Vue Test Utils]
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

const wrapper = mount(Stepper, {
  props: {
    max: 1
  }
})

expect(wrapper.find(valueSelector).text()).toContain('0')

await wrapper.find(buttonSelector).trigger('click')

expect(wrapper.find(valueSelector).text()).toContain('1')
```

```js [Cypress]
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

mount(Stepper, {
  props: {
    max: 1
  }
})

cy.get(valueSelector)
  .should('be.visible')
  .and('contain.text', '0')
  .get(buttonSelector)
  .click()
  .get(valueSelector)
  .should('contain.text', '1')
```

```js [Testing Library]
const { getByText } = render(Stepper, {
  props: {
    max: 1
  }
})

getByText('0') // 隐式断言 “0” 位于组件中

const button = getByRole('button', { name: /increment/i })

// 向我们的 increment 按钮派发一次 click 事件。
await fireEvent.click(button)

getByText('1')

await fireEvent.click(button)
```

:::

**不应该**

- 不要断言组件实例的私有状态，也不要测试组件的私有方法。测试实现细节会使测试变得脆弱，因为当实现发生变化时，它们更容易失败并需要更新。

  组件最终的职责是渲染正确的 DOM 输出，因此聚焦于 DOM 输出的测试能以同等甚至更高的正确性保证，同时也更稳健、更能适应变化。

  不要完全依赖快照测试。断言 HTML 字符串并不能说明正确性。请有目的地编写测试。

  如果某个方法需要被彻底测试，考虑将其提取为一个独立的工具函数，并为其编写专门的单元测试。如果不能干净地提取出来，则可以将其作为组件、集成或端到端测试的一部分来测试。

### 建议 {#recommendation-1}

- [Vitest](https://vitest.dev/) 适用于头less 渲染的组件或组合式函数（例如 VueUse 中的 [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) 函数）。组件和 DOM 可以使用 [`@vue/test-utils`](https://github.com/vuejs/test-utils) 进行测试。

- [Cypress 组件测试](https://on.cypress.io/component) 适用于预期行为依赖于正确渲染样式或触发原生 DOM 事件的组件。它可以与 Testing Library 结合使用，通过 [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro) 实现。

Vitest 与基于浏览器的运行器之间的主要区别在于速度和执行环境。简而言之，像 Cypress 这样的基于浏览器的运行器可以捕获基于 Node 的运行器（如 Vitest）无法捕获的问题（例如样式问题、真实的原生 DOM 事件、cookies、本地存储和网络故障），但基于浏览器的运行器比 Vitest _慢得多_，因为它们确实需要打开浏览器、编译样式表等等。Cypress 是一个支持组件测试的基于浏览器的运行器。请阅读 [Vitest 的对比页面](https://vitest.dev/guide/comparisons.html#cypress)以获取比较 Vitest 和 Cypress 的最新信息。

### 挂载库 {#mounting-libraries}

组件测试通常涉及将被测组件单独挂载、触发模拟的用户输入事件，并断言渲染后的 DOM 输出。有一些专门的工具库可以让这些任务更简单。

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) 是官方的底层组件测试库，旨在为用户提供访问 Vue 特定 API 的能力。它也是 [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) 的底层基础库。

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) 是一个专注于测试组件而不依赖实现细节的 Vue 测试库。其指导原则是：测试越接近软件的实际使用方式，就越能提供信心。

我们建议在应用中使用 `@vue/test-utils` 来测试组件。`@testing-library/vue` 在测试带有 Suspense 的异步组件时存在问题，因此应谨慎使用。

### 其他选项 {#other-options-1}

- [Nightwatch](https://nightwatchjs.org/) 是一个支持 Vue 组件测试的端到端测试运行器。（[示例项目](https://github.com/nightwatchjs-community/todo-vue)）

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue) 可用于基于标准化自动化、依赖原生用户交互的跨浏览器组件测试。它也可以与 Testing Library 一起使用。

## E2E 测试 {#e2e-testing}

虽然单元测试能为开发者提供一定程度的信心，但单元测试和组件测试在应用部署到生产环境后，无法全面覆盖应用的能力是有限的。因此，端到端（E2E）测试覆盖的是一个应用中可以说最重要的方面：用户实际使用你的应用时会发生什么。

端到端测试聚焦于多页面应用的行为，这些行为会针对你的生产构建版 Vue 应用发起网络请求。它们通常涉及启动数据库或其他后端，甚至可能在真实的预发布环境中运行。

端到端测试通常会捕获路由、状态管理库、顶层组件（例如 App 或 Layout）、公共资源，或任何请求处理方面的问题。正如上面所说，它们能捕获那些单元测试或组件测试可能根本无法捕获的关键问题。

端到端测试不会导入你的 Vue 应用中的任何代码，而是完全依赖在真实浏览器中通过浏览整个页面来测试你的应用。

端到端测试会验证你应用中的多个层级。它们既可以针对本地构建的应用，也可以针对真实的预发布环境。针对预发布环境进行测试，不仅包括你的前端代码和静态服务器，还包括所有相关的后端服务和基础设施。

> 你的测试越接近软件的实际使用方式，它们能给你的信心就越大。- [Kent C. Dodds](https://x.com/kentcdodds/status/977018512689455106) - Testing Library 的作者

通过测试用户操作如何影响你的应用，E2E 测试往往是提高你对应用是否正常运行的信心的关键。

### 选择 E2E 测试方案 {#choosing-an-e2e-testing-solution}

虽然 Web 端的端到端（E2E）测试因不稳定（flaky）和拖慢开发流程而一直声名不佳，但现代 E2E 工具已经取得了进展，能够创建更可靠、更具交互性、更有用的测试。在选择 E2E 测试框架时，以下部分会提供一些在为你的应用挑选测试框架时需要考虑的事项。

#### 跨浏览器测试 {#cross-browser-testing}

端到端（E2E）测试最主要的优势之一，就是它能够跨多个浏览器测试你的应用。虽然拥有 100% 的跨浏览器覆盖看起来很理想，但需要注意的是，由于运行这些测试需要额外的时间和机器算力，跨浏览器测试对团队资源的边际收益会递减。因此，在决定你的应用需要多少跨浏览器测试时，务必注意这种权衡。

#### 更快的反馈循环 {#faster-feedback-loops}

端到端（E2E）测试与开发的一个主要问题是，运行整个测试套件会花费很长时间。通常，这只会在持续集成和部署（CI/CD）流水线中执行。现代 E2E 测试框架通过增加诸如并行化之类的功能帮助解决了这一问题，这使得 CI/CD 流水线通常能比以前快上几个数量级。此外，在本地开发时，能够选择性地只运行你正在处理页面的单个测试，同时还提供测试的热重载，也能帮助提升开发者的工作流和生产力。

#### 一流的调试体验 {#first-class-debugging-experience}

虽然开发者过去通常依赖在终端窗口中查看日志来帮助判断测试中出了什么问题，但现代端到端（E2E）测试框架允许开发者利用他们已经熟悉的工具，例如浏览器开发者工具。

#### 无头模式下的可视化 {#visibility-in-headless-mode}

当端到端（E2E）测试在持续集成/部署流水线中运行时，它们通常会在无头浏览器中运行（即，不会打开可见的浏览器供用户观看）。现代 E2E 测试框架的一个关键特性是能够在测试期间查看应用的快照和/或视频，从而对错误发生的原因提供一些洞察。历史上，维护这些集成是很繁琐的。

### 推荐 {#recommendation-2}

- [Playwright](https://playwright.dev/) 是一个出色的 E2E 测试方案，支持 Chromium、WebKit 和 Firefox。可在 Windows、Linux 和 macOS 上进行测试，无论是本地还是 CI 环境，无头或有头模式，并原生支持 Google Chrome for Android 和 Mobile Safari 的移动端模拟。它拥有信息丰富的 UI、优秀的可调试性、内置断言、并行化、追踪功能，并且旨在消除不稳定测试。它也提供 [组件测试](https://playwright.dev/docs/test-components) 支持，但标记为实验性。Playwright 是开源的，由 Microsoft 维护。

- [Cypress](https://www.cypress.io/) 拥有信息丰富的图形界面、优秀的可调试性、内置断言、存根、抗不稳定性以及快照。如上所述，它为 [组件测试](https://docs.cypress.io/guides/component-testing/introduction) 提供稳定支持。Cypress 支持基于 Chromium 的浏览器、Firefox 和 Electron。WebKit 支持可用，但标记为实验性。Cypress 采用 MIT 许可证，但某些功能，例如并行化，需要订阅 Cypress Cloud。

<div class="lambdatest">
  <a href="https://lambdatest.com" target="_blank">
    <img src="/images/lambdatest.svg">
    <div>
      <div class="testing-partner">测试赞助商</div>
      <div>Lambdatest 是一个云平台，可用于在所有主流浏览器和真实设备上运行 E2E、可访问性和视觉回归测试，并带有 AI 辅助测试生成！</div>
    </div>
  </a>
</div>

### 其他选项 {#other-options-2}

- [Nightwatch](https://nightwatchjs.org/) 是一个基于 [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver) 的 E2E 测试方案。这使它拥有最广泛的浏览器支持范围，包括原生移动端测试。基于 Selenium 的方案会比 Playwright 或 Cypress 更慢。

- [WebdriverIO](https://webdriver.io/) 是一个基于 WebDriver 协议的 Web 和移动端测试自动化框架。

## 食谱 {#recipes}

### 为项目添加 Vitest {#adding-vitest-to-a-project}

在一个基于 Vite 的 Vue 项目中，运行：

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

接下来，更新 Vite 配置，添加 `test` 选项块：

```js{5-11} [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // 启用类似 jest 的全局测试 API
    globals: true,
    // 使用 happy-dom 模拟 DOM
    //（需要将 happy-dom 作为 peer dependency 安装）
    environment: 'happy-dom'
  }
})
```

:::tip
如果你使用 TypeScript，请在 `tsconfig.json` 的 `types` 字段中添加 `vitest/globals`。

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

然后，在你的项目中创建一个以 `*.test.js` 结尾的文件。你可以把所有测试文件放在项目根目录下的 test 目录中，或者放在源文件旁边的 test 目录中。Vitest 会根据命名约定自动搜索它们。

```js [MyComponent.test.js]
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('it should work', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // 断言输出
  getByText('...')
})
```

最后，更新 `package.json` 以添加测试脚本并运行它：

```json{4} [package.json]
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
> npm test
```

### 测试 Composables {#testing-composables}

> 本节假设你已经阅读了 [Composables](/guide/reusability/composables) 部分。

在测试 composables 时，我们可以将它们分为两类：不依赖宿主组件实例的 composable，以及依赖宿主组件实例的 composable。

当 composable 使用以下 API 时，它就依赖宿主组件实例：

- 生命周期钩子
- Provide / Inject

如果一个 composable 只使用响应式 API，那么可以直接调用它，并断言其返回的状态/方法：

```js [counter.js]
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

```js [counter.test.js]
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

依赖生命周期钩子或 Provide / Inject 的 composable，需要包裹在宿主组件中进行测试。我们可以创建如下辅助函数：

```js [test-utils.js]
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // 屏蔽缺少模板的警告
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // 返回结果和 app 实例
  // 以便测试 provide/unmount
  return [result, app]
}
```

```js [foo.test.js]
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // 为测试注入模拟 provide
  app.provide(...)
  // 执行断言
  expect(result.foo.value).toBe(1)
  // 如有需要，触发 onUnmounted 钩子
  app.unmount()
})
```

对于更复杂的 composable，也可以通过使用 [组件测试](#component-testing) 技术，编写针对包装组件的测试来更容易地进行测试。

<!--
TODO 未来可以添加更多测试食谱，例如
- 如何通过 GitHub Actions 配置 CI
- 如何在组件测试中进行 mock
-->
