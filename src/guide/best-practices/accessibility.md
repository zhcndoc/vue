# 可访问性 {#accessibility}

Web 可访问性（也称为 a11y）指的是创建任何人都能使用的网站的实践——无论是有残障的人、网络连接较慢的人、使用过时或损坏硬件的人，还是仅仅身处不利环境中的人。例如，为视频添加字幕既能帮助失聪和听力障碍用户，也能帮助身处嘈杂环境、听不到手机声音的用户。同样，确保文本对比度不过低，既能帮助低视力用户，也能帮助在强烈阳光下尝试使用手机的用户。

准备开始了，但不确定从哪里入手？

请查看由 [World Wide Web Consortium (W3C)](https://www.w3.org/) 提供的 [规划和管理 Web 可访问性指南](https://www.w3.org/WAI/planning-and-managing/)

## 跳过链接 {#skip-link}

你应该在每个页面顶部添加一个链接，直接跳转到主要内容区域，这样用户就可以跳过多个网页中重复出现的内容。

通常这会放在 `App.vue` 的顶部，因为它会是你所有页面中第一个可聚焦元素：

```vue-html
<span ref="backToTop" tabindex="-1" />
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink" class="skip-link">跳转到主要内容</a>
  </li>
</ul>
```

要在链接未获得焦点时将其隐藏，可以添加以下样式：

```css
.skip-links {
  list-style: none;
}
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

当用户切换路由后，将焦点带回页面最开始的位置，也就是跳过链接之前。这可以通过调用 `backToTop` 模板 ref 的 focus 来实现（假设使用的是 `vue-router`）：

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.backToTop.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const backToTop = ref()

watch(
  () => route.path,
  () => {
    backToTop.value.focus()
  }
)
</script>
```

</div>

[阅读有关跳转到主要内容的链接的文档](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## 内容结构 {#content-structure}

可访问性中最重要的一部分之一，是确保设计能够支持可访问的实现。设计不仅应考虑颜色对比度、字体选择、文本大小和语言，还应考虑应用中的内容是如何组织的。

### 标题 {#headings}

用户可以通过标题在应用中导航。为应用的每个部分提供描述性的标题，会让用户更容易预测每个部分的内容。关于标题，有几条推荐的可访问性实践：

- 按层级顺序嵌套标题：`<h1>` - `<h6>`
- 不要在同一部分中跳过标题层级
- 使用真正的标题标签，而不是通过样式把文本做成标题外观

[阅读更多关于标题的内容](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">主标题</h1>
  <section aria-labelledby="section-title-1">
    <h2 id="section-title-1">章节标题</h2>
    <h3>章节副标题</h3>
    <!-- 内容 -->
  </section>
  <section aria-labelledby="section-title-2">
    <h2 id="section-title-2">章节标题</h2>
    <h3>章节副标题</h3>
    <!-- 内容 -->
    <h3>章节副标题</h3>
    <!-- 内容 -->
  </section>
</main>
```

### 地标区域 {#landmarks}

[地标区域](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) 为应用中的各个部分提供程序化访问。依赖辅助技术的用户可以导航到应用的每个部分并跳过内容。你可以使用 [ARIA 角色](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) 来帮助实现这一点。

| HTML            | ARIA 角色           | 地标用途                                                                                                   |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------- |
| header          | role="banner"        | 主要标题：页面标题                                                                                         |
| nav             | role="navigation"    | 链接集合，适用于浏览文档或相关文档时使用                                                                   |
| main            | role="main"          | 文档的主要或中心内容。                                                                                     |
| footer          | role="contentinfo"   | 关于父文档的信息：脚注/版权/隐私声明链接                                                                   |
| aside           | role="complementary" | 支持主要内容，但又相互独立且本身具有意义的内容                                                             |
| search          | role="search"        | 这一部分包含应用的搜索功能                                                                               |
| form            | role="form"          | 表单相关元素的集合                                                                                         |
| section         | role="region"        | 与内容相关且用户很可能希望导航到的内容。该元素必须提供标签                                                   |

[阅读更多关于地标区域的内容](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## 语义化表单 {#semantic-forms}

创建表单时，你可以使用以下元素：`<form>`、`<label>`、`<input>`、`<textarea>` 和 `<button>`

标签通常放在表单字段的上方或左侧：

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">提交</button>
</form>
```

注意，你可以在 form 元素上添加 `autocomplete='on'`，它会应用到表单中的所有输入框。你也可以为每个输入框设置不同的 [autocomplete 属性值](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)。

### 标签 {#labels}

提供标签来描述所有表单控件的用途；通过 `for` 和 `id` 进行关联：

```vue-html
<label for="name">姓名： </label>
<input type="text" name="name" id="name" v-model="name" />
```

如果你在 Chrome 开发者工具中检查这个元素，并在 Elements 标签页中打开 Accessibility 面板，你会看到输入框是如何从标签中获取名称的：

![Chrome Developer Tools showing input accessible name from label](./images/AccessibleLabelChromeDevTools.png)

:::warning 警告：
虽然你可能见过像这样包裹输入框的标签：

```vue-html
<label>
  姓名：
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

显式地使用匹配的 id 来设置标签，能获得更好的辅助技术支持。
:::

#### `aria-label` {#aria-label}

你也可以使用 [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) 为输入框提供可访问名称。

```vue-html
<label for="name">姓名： </label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

你可以随意在 Chrome 开发者工具中检查这个元素，看看可访问名称是如何变化的：

![Chrome Developer Tools showing input accessible name from aria-label](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby` {#aria-labelledby}

使用 [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) 与 `aria-label` 类似，只不过它用于屏幕上可见标签文本的情况。它通过各元素的 `id` 进行关联，并且可以链接多个 `id`：

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">账单</h1>
  <div class="form-item">
    <label for="name">姓名： </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">提交</button>
</form>
```

![Chrome Developer Tools showing input accessible name from aria-labelledby](./images/AccessibleARIAlabelledbyDevTools.png)

当这种模式用于可复用组件中时，应使用 [`useId()`](/api/composition-api-helpers.html#useid) 生成 ID，而不是硬编码。这样既能保持每个组件实例的 `id` 值唯一，又能将可见文本与表单控件关联起来：

```vue
<script setup>
import { useId } from 'vue'

const sectionId = useId()
const nameId = useId()
</script>

<template>
  <section class="form-section">
    <h2 :id="sectionId">账单</h2>

    <label :id="nameId" :for="`${nameId}-input`">姓名： </label>
    <input
      :id="`${nameId}-input`"
      type="text"
      name="name"
      :aria-labelledby="`${sectionId} ${nameId}`"
    />
  </section>
</template>
```

#### `aria-describedby` {#aria-describedby}

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) 的使用方式与 `aria-labelledby` 类似，但它提供的是带有额外信息的描述，供用户需要时查看。这可以用于描述任何输入框的填写要求：

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">账单</h1>
  <div class="form-item">
    <label for="name">全名： </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">请提供名和姓。</p>
  </div>
  <button type="submit">提交</button>
</form>
```

你可以通过检查 Chrome 开发者工具来查看该描述：

![Chrome Developer Tools showing input accessible name from aria-labelledby and description with aria-describedby](./images/AccessibleARIAdescribedby.png)

### 占位符 {#placeholder}

应避免使用占位符，因为它们会让很多用户感到困惑。

占位符的一个问题是它们默认不满足 [颜色对比度标准](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)；修复颜色对比度后，占位符会看起来像输入框中的预填数据。看下面的例子，你可以看到满足颜色对比度标准的姓氏占位符看起来像预填数据：

![Accessible placeholder](./images/AccessiblePlaceholder.png)

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">提交</button>
</form>
```

```css
/* https://www.w3schools.com/howto/howto_css_placeholder.asp */

#lastName::placeholder {
  /* Chrome、Firefox、Opera、Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

#lastName:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

#lastName::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
```

最好把用户填写表单所需的所有信息都放在输入框之外。

### 说明 {#instructions}

在为输入字段添加说明时，请确保将其正确关联到输入框。
你可以在 [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) 中提供额外说明并绑定多个 id。这能带来更灵活的设计。

```vue-html
<fieldset>
  <legend>使用 aria-labelledby</legend>
  <label id="date-label" for="date">当前日期： </label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

或者，你可以使用 [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) 将说明附加到输入框上：

```vue-html
<fieldset>
  <legend>使用 aria-describedby</legend>
  <label id="dob" for="dob">出生日期： </label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

### 隐藏内容 {#hiding-content}

通常不建议在视觉上隐藏标签，即使输入框已经有可访问名称。不过，如果输入框的功能可以通过周围内容理解，那么我们可以隐藏视觉标签。

来看这个搜索字段：

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">搜索： </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">搜索</button>
</form>
```

我们之所以可以这样做，是因为搜索按钮会帮助视觉用户识别输入字段的用途。

我们可以使用 CSS 在视觉上隐藏元素，但仍让辅助技术可以访问它们：

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

#### `aria-hidden="true"` {#aria-hidden-true}

添加 `aria-hidden="true"` 会让辅助技术看不到该元素，但仍对其他用户可见。不要把它用于可聚焦元素，只用于纯装饰性、重复或屏幕外内容。

```vue-html
<p>这段内容不会被屏幕阅读器隐藏。</p>
<p aria-hidden="true">这段内容会对屏幕阅读器隐藏。</p>
```

### 按钮 {#buttons}

在表单中使用按钮时，你必须设置 type，以避免提交表单。
你也可以使用 input 来创建按钮：

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- 按钮 -->
  <button type="button">取消</button>
  <button type="submit">提交</button>

  <!-- 输入按钮 -->
  <input type="button" value="取消" />
  <input type="submit" value="提交" />
</form>
```

### 功能性图片 {#functional-images}

你可以使用这种技术来创建功能性图片。

- 输入字段

  - 这些图片会在表单中充当提交类型按钮

  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">搜索： </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="搜索"
    />
  </form>
  ```

- 图标

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">搜索： </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">搜索</span>
  </button>
</form>
```

## 标准 {#standards}

万维网联盟（W3C）网页无障碍倡议（WAI）为不同组件制定网页无障碍标准：

- [用户代理无障碍指南（UAAG）](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - 网页浏览器和媒体播放器，包括辅助技术的某些方面
- [创作工具无障碍指南（ATAG）](https://www.w3.org/WAI/standards-guidelines/atag/)
  - 创作工具
- [网页内容无障碍指南（WCAG）](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - 网页内容——供开发人员、创作工具和无障碍评估工具使用

### 网页内容无障碍指南（WCAG） {#web-content-accessibility-guidelines-wcag}

[WCAG 2.1](https://www.w3.org/TR/WCAG21/) 是对 [WCAG 2.0](https://www.w3.org/TR/WCAG20/) 的扩展，并通过应对网页变化来支持新技术的实现。在开发或更新网页无障碍政策时，W3C 鼓励使用最新版本的 WCAG。

#### WCAG 2.1 四个主要指导原则（简称 POUR）：{#wcag-2-1-four-main-guiding-principles-abbreviated-as-pour}

- [可感知](https://www.w3.org/TR/WCAG21/#perceivable)
  - 用户必须能够感知所呈现的信息
- [可操作](https://www.w3.org/TR/WCAG21/#operable)
  - 界面表单、控件和导航必须可操作
- [可理解](https://www.w3.org/TR/WCAG21/#understandable)
  - 信息以及用户界面的操作必须对所有用户都易于理解
- [健壮](https://www.w3.org/TR/WCAG21/#robust)
  - 随着技术发展，用户必须仍然能够访问内容

#### 网页无障碍倡议 – 可访问的富互联网应用（WAI-ARIA） {#web-accessibility-initiative-–-accessible-rich-internet-applications-wai-aria}

W3C 的 WAI-ARIA 提供了有关如何构建动态内容和高级用户界面控件的指导。

- [可访问的富互联网应用（WAI-ARIA）1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA 创作实践 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## 资源 {#resources}

### 文档 {#documentation}

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [可访问的富互联网应用（WAI-ARIA）1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA 创作实践 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### 辅助技术 {#assistive-technologies}

- 屏幕阅读器
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- 放大工具
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.freedomscientific.com/products/software/zoomtext/)
  - [放大镜](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### 测试 {#testing}

- 自动化工具
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?hl=en-US)
- 颜色工具
  - [WebAim 颜色对比度](https://webaim.org/resources/contrastchecker/)
  - [WebAim 链接颜色对比度](https://webaim.org/resources/linkcontrastchecker)
- 其他有用工具
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)
  - [Visual Aria](https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-US)
  - [Silktide 网站无障碍模拟器](https://chrome.google.com/webstore/detail/silktide-website-accessib/okcpiimdfkpkjcbihbmhppldhiebhhaf?hl=en-US)

### 用户 {#users}

世界卫生组织估计，全球有 15% 的人口存在某种形式的残障，其中 2-4% 为严重残障。也就是说，全球约有 10 亿人；这使得残障人士成为世界上最大的少数群体。

残障类型非常多，大致可分为四类：

- _[视觉](https://webaim.org/articles/visual/)_ - 这些用户可受益于使用屏幕阅读器、屏幕放大、控制屏幕对比度或盲文显示器。
- _[听觉](https://webaim.org/articles/auditory/)_ - 这些用户可受益于字幕、文字稿或手语视频。
- _[运动](https://webaim.org/articles/motor/)_ - 这些用户可受益于多种 [运动障碍辅助技术](https://webaim.org/articles/motor/assistive)：语音识别软件、眼动追踪、单键开关访问、头部指示棒、吸吹开关、大号轨迹球鼠标、自适应键盘或其他辅助技术。
- _[认知](https://webaim.org/articles/cognitive/)_ - 这些用户可受益于补充媒体、内容的结构化组织、清晰简洁的写作。

查看以下来自 WebAim 的链接，以从用户角度加深理解：

- [网页无障碍视角：探索其对每个人的影响和益处](https://www.w3.org/WAI/perspective-videos/)
- [网页用户故事](https://www.w3.org/WAI/people-use-web/user-stories/)
