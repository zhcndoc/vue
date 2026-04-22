# 响应式 API：工具 {#reactivity-api-utilities}

## isRef() {#isref}

检查一个值是否是 ref 对象。

- **类型**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  注意返回类型是一个 [类型谓词](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)，这意味着 `isRef` 可以作为类型守卫使用：

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // foo 的类型被缩小为 Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

如果参数是 ref，则返回其内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 的语法糖函数。

- **类型**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **示例**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // 现在可以保证 unwrapped 是 number
  }
  ```

## toRef() {#toref}

可用于将值 / refs / getters 规范化为 refs（3.3+）。

也可用于为源响应式对象上的某个属性创建 ref。创建的 ref 会与其源属性同步：修改源属性会更新 ref，反之亦然。

- **类型**

  ```ts
  // 规范化签名（3.3+）
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // 对象属性签名
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **示例**

  规范化签名（3.3+）：

  ```js
  // 原样返回已存在的 refs
  toRef(existingRef)

  // 创建一个只读 ref，在访问 .value 时调用 getter
  toRef(() => props.foo)

  // 从非函数值创建普通 ref
  // 等同于 ref(1)
  toRef(1)
  ```

  对象属性签名：

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // 一个与原始属性同步的双向 ref
  const fooRef = toRef(state, 'foo')

  // 修改 ref 会更新原始值
  fooRef.value++
  console.log(state.foo) // 2

  // 修改原始值也会更新 ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  注意这与以下写法不同：

  ```js
  const fooRef = ref(state.foo)
  ```

  上面的 ref **不会** 与 `state.foo` 同步，因为 `ref()` 接收的是一个普通数字值。

  当你想把 prop 的 ref 传递给组合式函数时，`toRef()` 很有用：

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // 将 `props.foo` 转换为 ref，然后传入
  // 一个组合式函数
  useSomeFeature(toRef(props, 'foo'))

  // getter 语法 - 3.3+ 推荐
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  当 `toRef` 与组件 props 一起使用时，关于修改 props 的常规限制仍然适用。尝试给该 ref 赋新值等同于尝试直接修改 prop，这是不被允许的。在这种场景下，你可能需要考虑改用带有 `get` 和 `set` 的 [`computed`](./reactivity-core#computed)。更多信息请参见[在组件中使用 `v-model`](/guide/components/v-model) 指南。

  使用对象属性签名时，即使源属性当前不存在，`toRef()` 也会返回一个可用的 ref。这使得它可以处理可选属性，而这些属性不会被 [`toRefs`](#torefs) 捕获。

## toValue() {#tovalue}

- 仅在 3.3+ 中支持

将值 / refs / getters 规范化为值。这类似于 [unref()](#unref)，不同之处在于它也会规范化 getters。如果参数是 getter，则会被调用并返回其返回值。

这可用于 [组合式函数](/guide/reusability/composables.html) 中，对可以是值、ref 或 getter 的参数进行规范化。

- **类型**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **示例**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  在组合式函数中规范化参数：

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // 响应 id 的变化
    })
  }

  // 这个组合式函数支持以下任意一种：
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

将一个响应式对象转换为普通对象，其中结果对象的每个属性都是一个 ref，指向原始对象中对应的属性。每个单独的 ref 都是使用 [`toRef()`](#toref) 创建的。

- **类型**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **示例**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  stateAsRefs 的类型：{
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // ref 与原始属性是“关联”的
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  当你想从组合式函数返回一个响应式对象，以便消费它的组件可以对返回对象进行解构/展开而不丢失响应性时，`toRefs` 很有用：

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...对 state 进行的逻辑操作

    // 返回时转换为 refs
    return toRefs(state)
  }

  // 可以在不丢失响应性的情况下进行解构
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` 只会为调用时源对象上可枚举的属性生成 refs。若要为可能尚不存在的属性创建 ref，请改用 [`toRef`](#toref)。

## isProxy() {#isproxy}

检查一个对象是否是由 [`reactive()`](./reactivity-core#reactive)、[`readonly()`](./reactivity-core#readonly)、[`shallowReactive()`](./reactivity-advanced#shallowreactive) 或 [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) 创建的代理。

- **类型**

  ```ts
  function isProxy(value: any): boolean
  ```

## isReactive() {#isreactive}

检查一个对象是否是由 [`reactive()`](./reactivity-core#reactive) 或 [`shallowReactive()`](./reactivity-advanced#shallowreactive) 创建的代理。

- **类型**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

检查传入的值是否为只读对象。只读对象的属性可以变化，但不能通过传入的对象直接赋值。

由 [`readonly()`](./reactivity-core#readonly) 和 [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) 创建的代理都被视为只读对象，此外，未提供 `set` 函数的 [`computed()`](./reactivity-core#computed) ref 也同样被视为只读。

- **类型**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
