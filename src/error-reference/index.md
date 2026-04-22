<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# 生产环境错误代码参考 {#error-reference}

## 运行时错误 {#runtime-errors}

在生产构建中，传递给以下错误处理 API 的第 3 个参数将是一个简短的代码，而不是完整的信息字符串：

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured)（组合式 API）
- [`errorCaptured`](/api/options-lifecycle#errorcaptured)（选项式 API）

下表将这些代码映射到它们原始的完整信息字符串。

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## 编译器错误 {#compiler-errors}

下表提供了生产环境编译器错误代码与其原始消息之间的映射。

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
