---
pageClass: api
---

# 内置组件 {#built-in-components}

:::info 注册与使用
内置组件可以直接在模板中使用，无需注册。它们也是可 tree-shake 的：只有在被使用时才会被包含到构建结果中。

在 [渲染函数](/guide/extras/render-function) 中使用时，需要显式导入它们。例如：

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `<Transition>` {#transition}

为**单个**元素或组件提供动画过渡效果。

- **Props**

  ```ts
  interface TransitionProps {
    /**
     * 用于自动生成过渡 CSS 类名。
     * 例如，`name: 'fade'` 会自动展开为 `.fade-enter`、
     * `.fade-enter-active` 等。
     */
    name?: string
    /**
     * 是否应用 CSS 过渡类。
     * 默认值：true
     */
    css?: boolean
    /**
     * 指定要等待的过渡事件类型，
     * 以确定过渡结束的时机。
     * 默认行为是自动检测持续时间更长的类型。
     */
    type?: 'transition' | 'animation'
    /**
     * 指定过渡的明确时长。
     * 默认行为是等待根过渡元素上的第一个 `transitionend`
     * 或 `animationend` 事件。
     */
    duration?: number | { enter: number; leave: number }
    /**
     * 控制离开/进入过渡的时间顺序。
     * 默认行为是同时进行。
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * 是否在初始渲染时应用过渡。
     * 默认值：false
     */
    appear?: boolean

    /**
     * 用于自定义过渡类的 props。
     * 在模板中使用 kebab-case，例如 enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **Events**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (`v-show` only)
  - `@appear-cancelled`

- **Example**

  简单元素：

  ```vue-html
  <Transition>
    <div v-if="ok">切换内容</div>
  </Transition>
  ```

  通过更改 `key` 属性强制触发过渡：

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  动态组件，带过渡模式 + 出现时动画：

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  监听过渡事件：

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">切换内容</div>
  </Transition>
  ```

- **See also** [指南 - Transition](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

为列表中的**多个**元素或组件提供过渡效果。

- **Props**

  `<TransitionGroup>` 接受与 `<Transition>` 相同的 props，除了 `mode` 外，另外还有两个额外的 props：

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * 如果未定义，则渲染为一个 fragment。
     */
    tag?: string
    /**
     * 用于自定义在移动过渡期间应用的 CSS 类。
     * 在模板中使用 kebab-case，例如 move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **Events**

  `<TransitionGroup>` 会发出与 `<Transition>` 相同的事件。

- **Details**

  默认情况下，`<TransitionGroup>` 不会渲染一个包裹性的 DOM 元素，但可以通过 `tag` prop 来定义。

  请注意，`<transition-group>` 中的每个子元素都必须使用[**唯一的 key**](/guide/essentials/list#maintaining-state-with-key)，动画才能正常工作。

  `<TransitionGroup>` 通过 CSS transform 支持移动过渡。当子元素在更新后其屏幕位置发生变化时，它会应用一个移动 CSS 类（根据 `name` 属性自动生成，或通过 `move-class` prop 配置）。如果在应用移动类时 CSS `transform` 属性是“可过渡的”，元素就会使用 [FLIP 技术](https://aerotwist.com/blog/flip-your-animations/)平滑地动画到目标位置。

- **Example**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **See also** [指南 - TransitionGroup](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

缓存包裹在其中的动态切换组件。

- **Props**

  ```ts
  interface KeepAliveProps {
    /**
     * 如果指定，则只会缓存名称与
     * `include` 匹配的组件。
     */
    include?: MatchPattern
    /**
     * 任何名称与 `exclude` 匹配的组件都
     * 不会被缓存。
     */
    exclude?: MatchPattern
    /**
     * 要缓存的组件实例最大数量。
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Details**

  当包裹动态组件时，`<KeepAlive>` 会缓存未激活的组件实例，而不会销毁它们。

  在任意时刻，`<KeepAlive>` 的直接子节点中只能有一个处于激活状态的组件实例。

  当组件在 `<KeepAlive>` 中切换时，它的 `activated` 和 `deactivated` 生命周期钩子会相应地被调用，作为不会被调用的 `mounted` 和 `unmounted` 的替代方案。这同样适用于 `<KeepAlive>` 的直接子节点及其所有后代。

- **Example**

  基本用法：

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  与 `v-if` / `v-else` 分支一起使用时，同一时刻只能渲染一个组件：

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  与 `<Transition>` 一起使用：

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  使用 `include` / `exclude`：

  ```vue-html
  <!-- 逗号分隔字符串 -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- 正则表达式（使用 `v-bind`） -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- 数组（使用 `v-bind`） -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  与 `max` 一起使用：

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **See also** [指南 - KeepAlive](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

将其插槽内容渲染到 DOM 的另一部分。

- **Props**

  ```ts
  interface TeleportProps {
    /**
     * 必需。指定目标容器。
     * 可以是选择器，也可以是真实元素。
     */
    to: string | HTMLElement
    /**
     * 当为 `true` 时，内容将保留在原位置，
     * 而不是移动到目标容器中。
     * 可以动态更改。
     */
    disabled?: boolean
    /**
     * 当为 `true` 时，Teleport 会延迟到应用的
     * 其他部分挂载完成后再解析其目标。
     * （3.5+）
     */
    defer?: boolean
  }
  ```

- **Example**

  指定目标容器：

  ```vue-html
  <Teleport to="#some-id" />
  <Teleport to=".some-class" />
  <Teleport to="[data-teleport]" />
  ```

  有条件地禁用：

  ```vue-html
  <Teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </Teleport>
  ```

  延迟目标解析 <sup class="vt-badge" data-text="3.5+" />：

  ```vue-html
  <Teleport defer to="#late-div">...</Teleport>

  <!-- 模板中的后面某处 -->
  <div id="late-div"></div>
  ```

- **See also** [指南 - Teleport](/guide/built-ins/teleport)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

用于协调组件树中的嵌套异步依赖。

- **Props**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
    suspensible?: boolean
  }
  ```

- **Events**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Details**

  `<Suspense>` 接受两个插槽：`#default` 插槽和 `#fallback` 插槽。它会在内存中渲染默认插槽的同时显示 fallback 插槽的内容。

  如果在渲染默认插槽时遇到异步依赖（[异步组件](/guide/components/async) 和带有 [`async setup()`](/guide/built-ins/suspense#async-setup) 的组件），它会等待所有依赖都解析完成后再显示默认插槽。

  通过将 Suspense 设为 `suspensible`，所有异步依赖处理都将由父级 Suspense 负责。参见 [实现细节](https://github.com/vuejs/core/pull/6736)

- **See also** [指南 - Suspense](/guide/built-ins/suspense)
