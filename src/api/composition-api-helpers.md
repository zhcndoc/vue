# Composition API：辅助函数 {#composition-api-helpers}

## useAttrs() {#useattrs}

返回来自 [Setup Context](/api/composition-api-setup#setup-context) 的 `attrs` 对象，其中包含当前组件的 [透传属性](/guide/components/attrs#fallthrough-attributes)。这旨在用于 `<script setup>` 中，因为此时无法获取 setup context 对象。

- **类型**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

返回来自 [Setup Context](/api/composition-api-setup#setup-context) 的 `slots` 对象，其中包含父组件传入的插槽，作为可调用的函数，这些函数会返回虚拟 DOM 节点。这旨在用于 `<script setup>` 中，因为此时无法获取 setup context 对象。

如果使用 TypeScript，应优先使用 [`defineSlots()`](/api/sfc-script-setup#defineslots)。

- **类型**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

这是为 [`defineModel()`](/api/sfc-script-setup#definemodel) 提供底层支持的辅助函数。如果使用 `<script setup>`，应优先使用 `defineModel()`。

- 仅在 3.4+ 中可用

- **类型**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> & [
    ModelRef<T, M, G, S>,
    Record<M, true | undefined>
  ]
  ```

- **示例**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **详情**

  `useModel()` 可用于非 SFC 组件，例如在使用原始 `setup()` 函数时。它要求第一个参数为 `props` 对象，第二个参数为模型名称。可选的第三个参数可用于为结果模型 ref 声明自定义的 getter 和 setter。请注意，与 `defineModel()` 不同，你需要自己声明 `props` 和 `emits`。

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

返回一个浅层 ref，其值会与带有匹配 ref 属性的模板元素或组件同步。

- **类型**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **示例**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **另请参阅**
  - [指南 - 模板 refs](/guide/essentials/template-refs)
  - [指南 - 模板 Ref 的类型标注](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [指南 - 组件模板 Ref 的类型标注](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

用于生成应用内唯一的 ID，以便用于可访问性属性或表单元素。

- **类型**

  ```ts
  function useId(): string
  ```

- **示例**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">姓名：</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **详情**

  `useId()` 生成的 ID 在应用内是唯一的。它可用于为表单元素和可访问性属性生成 ID。在同一个组件中多次调用会生成不同的 ID；同一个组件的多个实例调用 `useId()` 也会得到不同的 ID。

  `useId()` 生成的 ID 还保证在服务端和客户端渲染之间保持稳定，因此可用于 SSR 应用，而不会导致 hydration 不匹配。

  如果同一页面上有多个 Vue 应用实例，可以通过使用 [`app.config.idPrefix`](/api/application#app-config-idprefix) 为每个应用设置一个 ID 前缀，从而避免 ID 冲突。

  :::warning 注意
  不应在 `computed()` 属性内部调用 `useId()`，因为这可能会导致实例冲突。应将 ID 声明在 `computed()` 外部，并在计算函数中引用它。
  :::
