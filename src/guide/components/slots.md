# 插槽 {#slots}

> 本页假设你已经阅读过 [组件基础](/guide/essentials/component-basics)。如果你是组件新手，请先阅读那一节。

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-component-slots" title="免费的 Vue.js 插槽课程"/>

## 插槽内容与出口 {#slot-content-and-outlet}

我们已经了解到，组件可以接收 props，而 props 可以是任意类型的 JavaScript 值。但模板内容呢？在某些情况下，我们可能希望将一个模板片段传递给子组件，并让子组件在自己的模板中渲染这个片段。

例如，我们可能有一个 `<FancyButton>` 组件，它支持如下用法：

```vue-html{2}
<FancyButton>
  Click me! <!-- 插槽内容 -->
</FancyButton>
```

`<FancyButton>` 的模板如下所示：

```vue-html{2}
<button class="fancy-btn">
  <slot></slot> <!-- 插槽出口 -->
</button>
```

`<slot>` 元素是一个 **插槽出口**，它表示父组件提供的 **插槽内容** 应该被渲染到哪里。

![Diagram showing slot content from the parent being injected into the slot outlet in the child component](./images/slots.png)

<!-- https://www.figma.com/file/LjKTYVL97Ck6TEmBbstavX/slot -->

最终渲染出的 DOM：

```html
<button class="fancy-btn">Click me!</button>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNpdUdlqAyEU/ZVbQ0kLMdNsXabTQFvoV8yLcRkkjopLSQj596oTwqRvnuM9y9UT+rR2/hs5qlHjqZM2gOch2m2rZW+NC/BDND1+xRCMBuFMD9N5NeKyeNrqphrUSZdA4L1VJPCEAJrRdCEAvpWke+g5NHcYg1cmADU6cB0A4zzThmYckqimupqiGfpXILe/zdwNhaki3n+0SOR5vAu6ReU++efUajtqYGJQ/FIg5w8Wt9FlOx+OKh/nV1c4ZVNqlHE1TIQQ7xnvCN13zkTNalBSc+Jw5wiTac2H1WLDeDeDyXrJVm9LWG7uE3hev3AhHge1cYwnO200L4QljEnd1bCxB1g82UNhe+I6qQs5kuGcE30NrxeaRudzOWtkemeXuHP5tLIKOv8BN+mw3w==)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNptUdtOwzAM/RUThAbSurIbl1ImARJf0ZesSapoqROlKdo07d9x0jF1SHmIT+xzcY7sw7nZTy9Zwcqu9tqFTYW6ddYH+OZYHz77ECyC8raFySwfYXFsUiFAhXKfBoRUvDcBjhGtLbGgxNAVcLziOlVIp8wvelQE2TrDg6QKoBx1JwDgy+h6B62E8ibLoDM2kAAGoocsiz1VKMfmCCrzCymbsn/GY95rze1grja8694rpmJ/tg1YsfRO/FE134wc2D4YeTYQ9QeKa+mUrgsHE6+zC+vfjoz1Bdwqpd5iveX1rvG2R1GA0Si5zxrPhaaY98v5WshmCrerhVi+LmCxvqPiafUslXoYpq0XkuiQ1p4Ax4XQ2BSwdnuYP7p9QlvuG40JHI1lUaenv3o5w3Xvu2jOWU179oQNn5aisNMvLBvDOg==)

</div>

通过插槽，`<FancyButton>` 负责渲染外层的 `<button>`（以及它华丽的样式），而内部内容则由父组件提供。

理解插槽的另一种方式，是将它们与 JavaScript 函数进行比较：

```js
// 父组件传递插槽内容
FancyButton('Click me!')

// FancyButton 在自己的模板中渲染插槽内容
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

插槽内容不只是限于文本。它可以是任何有效的模板内容。例如，我们可以传入多个元素，甚至其他组件：

```vue-html
<FancyButton>
  <span style="color:red">点击我！</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp1UmtOwkAQvspQYtCEgrx81EqCJibeoX+W7bRZaHc3+1AI4QyewH8ewvN4Aa/gbgtNIfFf5+vMfI/ZXbCQcvBmMYiCWFPFpAGNxsp5wlkphTLwQjjdPlljBIdMiRJ6g2EL88O9pnnxjlqU+EpbzS3s0BwPaypH4gqDpSyIQVcBxK3VFQDwXDC6hhJdlZi4zf3fRKwl4aDNtsDHJKCiECqiW8KTYH5c1gEnwnUdJ9rCh/XeM6Z42AgN+sFZAj6+Ux/LOjFaEK2diMz3h0vjNfj/zokuhPFU3lTdfcpShVOZcJ+DZgHs/HxtCrpZlj34eknoOlfC8jSCgnEkKswVSRlyczkZzVLM+9CdjtPJ/RjGswtX3ExvMcuu6mmhUnTruOBYAZKkKeN5BDO5gdG13FRoSVTOeAW2xkLPY3UEdweYWqW9OCkYN6gctq9uXllx2Z09CJ9dJwzBascI7nBYihWDldUGMqEgdTVIq6TQqCEMfUpNSD+fX7/fH+3b7P8AdGP6wA==)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp1Ultu2zAQvMpGQZEWsOzGiftQ1QBpgQK9g35oaikwkUiCj9aGkTPkBPnLIXKeXCBXyJKKBdoIoA/tYGd3doa74tqY+b+ARVXUjltp/FWj5GC09fCHKb79FbzXCoTVA5zNFxkWaWdT8/V/dHrAvzxrzrC3ZoBG4SYRWhQs9B52EeWapihU3lWwyxfPDgbfNYq+ejEppcLjYHrmkSqAOqMmAOB3L/ktDEhV4+v8gMR/l1M7wxQ4v+3xZ1Nw3Wtb8S1TTXG1H3cCJIO69oxc5mLUcrSrXkxSi1lxZGT0//CS9Wg875lzJELE/nLto4bko69dr31cFc8auw+3JHvSEfQ7nwbsHY9HwakQ4kes14zfdlYH1VbQS4XMlp1lraRMPl6cr1rsZnB6uWwvvi9hufpAxZfLryjEp5GtbYs0TlGICTCsbaXqKliZDZx/NpuEDsx2UiUwo5VxT6Dkv73BPFgXxRktlUdL2Jh6OoW8O3pX0buTsoTgaCNQcDjoGwk3wXkQ2tJLGzSYYI126KAso0uTSc8Pjy9P93k2d6+NyRKa)

</div>

使用插槽后，我们的 `<FancyButton>` 更加灵活且可复用。现在我们可以在不同地方使用它，并传入不同的内部内容，但都保持同样华丽的样式。

Vue 组件的插槽机制受到了 [原生 Web Components 的 `<slot>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) 的启发，但它还具备一些我们后面会看到的额外能力。

## 渲染作用域 {#render-scope}

插槽内容可以访问父组件的数据作用域，因为它是在父组件中定义的。例如：

```vue-html
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

这里两个 <span v-pre>`{{ message }}`</span> 插值都会渲染出相同的内容。

插槽内容**不能**访问子组件的数据。Vue 模板中的表达式只能访问其定义所在的作用域，这与 JavaScript 的词法作用域一致。换句话说：

> 父模板中的表达式只能访问父作用域；子模板中的表达式只能访问子作用域。

## 备用内容 {#fallback-content}

有些情况下，为插槽指定备用内容（即默认内容）很有用，这些内容只会在没有提供任何内容时才会被渲染。例如，在一个 `<SubmitButton>` 组件中：

```vue-html
<button type="submit">
  <slot></slot>
</button>
```

如果父组件没有为插槽提供任何内容，我们可能希望在 `<button>` 内部渲染文本 "Submit"。要将 "Submit" 设为备用内容，可以把它放在 `<slot>` 标签之间：

```vue-html{3}
<button type="submit">
  <slot>
    提交 <!-- 备用内容 -->
  </slot>
</button>
```

现在，当我们在父组件中使用 `<SubmitButton>` 且没有为插槽提供内容时：

```vue-html
<SubmitButton />
```

这将渲染备用内容 "Submit"：

```html
<button type="submit">Submit</button>
```

但如果我们提供内容：

```vue-html
<SubmitButton>Save</SubmitButton>
```

那么渲染的将是提供的内容：

```html
<button type="submit">Save</button>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp1kMsKwjAQRX9lzMaNbfcSC/oL3WbT1ikU8yKZFEX8d5MGgi2YVeZxZ86dN7taWy8B2ZlxP7rZEnikYFuhZ2WNI+jCoGa6BSKjYXJGwbFufpNJfhSaN1kflTEgVFb2hDEC4IeqguARpl7KoR8fQPgkqKpc3Wxo1lxRWWeW+Y4wBk9x9V9d2/UL8g1XbOJN4WAntodOnrecQ2agl8WLYH7tFyw5olj10iR3EJ+gPCxDFluj0YS6EAqKR8mi9M3Td1ifLxWShcU=)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp1UEEOwiAQ/MrKxYu1d4Mm+gWvXChuk0YKpCyNxvh3lxIb28SEA8zuDDPzEucQ9mNCcRAymqELdFKu64MfCK6p6Tu6JCLvoB18D9t9/Qtm4lY5AOXwMVFu2OpkCV4ZNZ51HDqKhwLAQjIjb+X4yHr+mh+EfbCakF8AclNVkCJCq61ttLkD4YOgqsp0YbGesJkVBj92NwSTIrH3v7zTVY8oF8F4SdazD7ET69S5rqXPpnigZ8CjEnHaVyInIp5G63O6XIGiIlZMzrGMd8RVfR0q4lIKKV+L+srW+wNTTZq3)

</div>

## 具名插槽 {#named-slots}

有时在单个组件中拥有多个插槽出口会很有用。例如，在 `<BaseLayout>` 组件中有如下模板：

```vue-html
<div class="container">
  <header>
    <!-- 我们希望这里放入 header 内容 -->
  </header>
  <main>
    <!-- 我们希望这里放入 main 内容 -->
  </main>
  <footer>
    <!-- 我们希望这里放入 footer 内容 -->
  </footer>
</div>
```

在这种情况下，`<slot>` 元素有一个特殊属性 `name`，可以用来给不同的插槽分配唯一的 ID，这样你就可以决定内容应该被渲染到哪里：

```vue-html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

没有 `name` 的 `<slot>` 出口会隐式地拥有 "default" 这个名称。

在使用 `<BaseLayout>` 的父组件中，我们需要一种方式来传递多个插槽片段，每个片段都对应不同的插槽出口。这就是**具名插槽**的作用。

要传递具名插槽，我们需要使用带有 `v-slot` 指令的 `<template>` 元素，然后将插槽名称作为参数传给 `v-slot`：

```vue-html
<BaseLayout>
  <template v-slot:header>
    <!-- header 插槽的内容 -->
  </template>
</BaseLayout>
```

`v-slot` 还有一个专用简写 `#`，因此 `<template v-slot:header>` 可以简写为 `<template #header>`。可以把它理解为“将这个模板片段渲染到子组件的 ‘header’ 插槽中”。

![Diagram showing multiple named slots in a layout component, with content from the parent being directed to the corresponding header, main, and footer slots](./images/named-slots.png)

<!-- https://www.figma.com/file/2BhP8gVZevttBu9oUmUUyz/named-slot -->

下面是使用简写语法向 `<BaseLayout>` 传递三个插槽内容的代码：

```vue-html
<BaseLayout>
  <template #header>
    <h1>这里可能是一个页面标题</h1>
  </template>

  <template #default>
    <p>主内容的一段文字。</p>
    <p>还有另一段。</p>
  </template>

  <template #footer>
    <p>这里是一些联系信息</p>
  </template>
</BaseLayout>
```

当一个组件同时接受默认插槽和具名插槽时，所有顶层的非 `<template>` 节点都会被隐式视为默认插槽的内容。因此，上面的内容也可以写成：

```vue-html
<BaseLayout>
  <template #header>
    <h1>这里可能是一个页面标题</h1>
  </template>

  <!-- 隐式默认插槽 -->
  <p>主内容的一段文字。</p>
  <p>还有另一段。</p>

  <template #footer>
    <p>这里是一些联系信息</p>
  </template>
</BaseLayout>
```

现在，`<template>` 元素中的所有内容都会被传递到对应的插槽中。最终渲染出的 HTML 将会是：

```html
<div class="container">
  <header>
    <h1>这里可能是一个页面标题</h1>
  </header>
  <main>
    <p>主内容的一段文字。</p>
    <p>还有另一段。</p>
  </main>
  <footer>
    <p>这里是一些联系信息</p>
  </footer>
</div>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp9UsFuwjAM/RWrHLgMOi5o6jIkdtphn9BLSF0aKU2ixEVjiH+fm8JoQdvRfu/5xS8+ZVvvl4cOsyITUQXtCSJS5zel1a13geBdRvyUR9cR1MG1MF/mt1YvnZdW5IOWVVwQtt5IQq4AxI2cau5ccZg1KCsMlz4jzWrzgQGh1fuGYIcgwcs9AmkyKHKGLyPykcfD1Apr2ZmrHUN+s+U5Qe6D9A3ULgA1bCK1BeUsoaWlyPuVb3xbgbSOaQGcxRH8v3XtHI0X8mmfeYToWkxmUhFoW7s/JvblJLERmj1l0+T7T5tqK30AZWSMb2WW3LTFUGZXp/u8o3EEVrbI9AFjLn8mt38fN9GIPrSp/p4/Yoj7OMZ+A/boN9KInPeZZpAOLNLRDAsPZDgN4p0L/NQFOV/Ayn9x6EZXMFNKvQ4E5YwLBczW6/WlU3NIi6i/sYDn5Qu2qX1OF51MsvMPkrIEHg==)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

</div>

同样地，使用 JavaScript 函数类比也有助于更好地理解具名插槽：

```js
// 使用不同名称传递多个插槽片段
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`
})

// <BaseLayout> 在不同位置渲染它们
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## 条件插槽 {#conditional-slots}

有时候，你希望根据内容是否传入了某个插槽来渲染一些内容。

你可以结合使用 [$slots](/api/component-instance.html#slots) 属性和 [v-if](/guide/essentials/conditional.html#v-if) 来实现这一点。

在下面的示例中，我们定义了一个 Card 组件，它有三个条件插槽：`header`、`footer` 以及 `default`。
当 header / footer / default 的内容存在时，我们希望用额外的样式包裹它们：

```vue-html
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

[在 Playground 中试试](https://play.vuejs.org/#eNqVVMtu2zAQ/BWCLZBLIjVoTq4aoA1yaA9t0eaoCy2tJcYUSZCUKyPwv2dJioplOw4C+EDuzM4+ONYT/aZ1tumBLmhhK8O1IxZcr29LyTutjCN3zNRkZVRHLrLcXzz9opRFHvnIxIuDTgvmAG+EFJ4WTnhOCPnQAqvBjHFE2uvbh5Zbgj/XAolwkWN4TM33VI/UalixXvjyo5yeqVVKOpCuyP0ob6utlHL7vUE3U4twkWP4hJq/jiPP4vSSOouNrHiTPVolcclPnl3SSnWaCzC/teNK2pIuSEA8xoRQ/3+GmDM9XKZ41UK1PhF/tIOPlfSPAQtmAyWdMMdMAy7C9/9+wYDnCexU3QtknwH/glWi9z1G2vde1tj2Hi90+yNYhcvmwd4PuHabhvKNeuYu8EuK1rk7M/pLu5+zm5BXyh1uMdnOu3S+95pvSCWYtV9xQcgqaXogj2yu+AqBj1YoZ7NosJLOEq5S9OXtPZtI1gFSppx8engUHs+vVhq9eVhq9ORRrXdpRyseSqfo6SmmnONK6XTw9yis24q448wXSG+0VAb3sSDXeiBoDV6TpWDV+ktENatrdMGCfAoBfL1JYNzzpINJjVFoJ9yKUKho19ul6OFQ6UYPx1rjIpPYeXIc/vXCgjetawzbni0dPnhhJ3T3DMVSruI=)

## 动态插槽名称 {#dynamic-slot-names}

[动态指令参数](/guide/essentials/template-syntax.md#dynamic-arguments) 同样适用于 `v-slot`，这允许定义动态插槽名称：

```vue-html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 使用简写 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

请注意，该表达式需要遵循动态指令参数的 [语法限制](/guide/essentials/template-syntax.md#dynamic-argument-syntax-constraints)。

## 作用域插槽 {#scoped-slots}

正如在 [渲染作用域](#render-scope) 中所讨论的，插槽内容无法访问子组件中的状态。

不过，在某些情况下，插槽内容同时使用父作用域和子作用域中的数据会很有用。为此，我们需要一种方式，让子组件在渲染插槽时向插槽传递数据。

事实上，我们完全可以这么做——就像向组件传递 props 一样，我们可以向插槽出口传递属性：

```vue-html
<!-- <MyComponent> 模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

接收插槽 props 的方式，在单个默认插槽和具名插槽之间会略有不同。我们先展示如何通过直接在子组件标签上使用 `v-slot` 来接收单个默认插槽的 props：

```vue-html
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![图示展示了一个作用域插槽，其中子组件将数据传回给父组件提供的插槽内容](./images/scoped-slots.svg)

<!-- https://www.figma.com/file/QRneoj8eIdL1kw3WQaaEyc/scoped-slot -->

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNp9kMEKgzAMhl8l9OJlU3aVOhg7C3uAXsRlTtC2tFE2pO++dA5xMnZqk+b/8/2dxMnadBxQ5EL62rWWwCMN9qh021vjCMrn2fBNoya4OdNDkmarXhQnSstsVrOOC8LedhVhrEiuHca97wwVSsTj4oz1SvAUgKJpgqWZEj4IQoCvZm0Gtgghzss1BDvIbFkqdmID+CNdbbQnaBwitbop0fuqQSgguWPXmX+JePe1HT/QMtJBHnE51MZOCcjfzPx04JxsydPzp2Szxxo7vABY1I/p)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqFkNFqxCAQRX9l8CUttAl9DbZQ+rzQD/AlJLNpwKjoJGwJ/nvHpAnusrAg6FzHO567iE/nynlCUQsZWj84+lBmGJ31BKffL8sng4bg7O0IRVllWnpWKAOgDF7WBx2em0kTLElt975QbwLkhkmIyvCS1TGXC8LR6YYwVSTzH8yvQVt6VyJt3966oAR38XhaFjjEkvBCECNcia2d2CLyOACZQ7CDrI6h4kXcAF7lcg+za6h5et4JPdLkzV4B9B6RBtOfMISmxxqKH9TarrGtATxMgf/bDfM/qExEUCdEDuLGXAmoV06+euNs2JK7tyCrzSNHjX9aurQf)

</div>

子组件传给插槽的 props 会作为对应 `v-slot` 指令的值可用，并且可以在插槽内部通过表达式访问。

你可以把作用域插槽看作传入子组件的一个函数。然后子组件再调用它，并把 props 作为参数传入：

```js
MyComponent({
  // 传入默认插槽，但形式是一个函数
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return `<div>${
    // 使用 props 调用插槽函数！
    slots.default({ text: greetingMessage, count: 1 })
  }</div>`
}
```

实际上，这与作用域插槽的编译方式非常接近，也与你在手写 [渲染函数](/guide/extras/render-function) 中使用作用域插槽的方式一致。

注意 `v-slot="slotProps"` 与插槽函数签名的对应关系。和函数参数一样，我们也可以在 `v-slot` 中使用解构：

```vue-html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### 具名作用域插槽 {#named-scoped-slots}

具名作用域插槽的工作方式类似——插槽 props 可以作为 `v-slot` 指令的值来访问：`v-slot:name="slotProps"`。使用简写时，看起来像这样：

```vue-html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

向具名插槽传递 props：

```vue-html
<slot name="header" message="hello"></slot>
```

请注意，插槽的 `name` 不会包含在 props 中，因为它是保留属性——因此得到的 `headerProps` 会是 `{ message: 'hello' }`。

如果你把具名插槽和默认作用域插槽混用，就需要为默认插槽显式使用 `<template>` 标签。尝试直接把 `v-slot` 指令放在组件上会导致编译错误。这样做是为了避免默认插槽 props 的作用域产生任何歧义。例如：

```vue-html
<!-- <MyComponent> 模板 -->
<div>
  <slot :message="hello"></slot>
  <slot name="footer" />
</div>
```

```vue-html
<!-- 此模板不会编译 -->
<MyComponent v-slot="{ message }">
  <p>{{ message }}</p>
  <template #footer>
    <!-- message 属于默认插槽，在这里不可用 -->
    <p>{{ message }}</p>
  </template>
</MyComponent>
```

为默认插槽使用显式的 `<template>` 标签，有助于清楚地表明 `message` prop 在其他插槽内部不可用：

```vue-html
<MyComponent>
  <!-- 使用显式默认插槽 -->
  <template #default="{ message }">
    <p>{{ message }}</p>
  </template>

  <template #footer>
    <p>这里有一些联系信息</p>
  </template>
</MyComponent>
```

### 精彩列表示例 {#fancy-list-example}

你可能会想，作用域插槽的一个好用例会是什么。这里有一个例子：设想一个 `<FancyList>` 组件，它会渲染一个项目列表——它可以封装远程数据加载、使用数据展示列表，甚至分页或无限滚动等高级功能。不过，我们希望它在每个项目的外观上保持灵活，并将每个项目的样式交给使用它的父组件来决定。因此，期望的用法可能如下：

```vue-html
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

在 `<FancyList>` 内部，我们可以用不同的项目数据多次渲染同一个 `<slot>`（注意这里我们使用 `v-bind` 把一个对象作为插槽 props 传入）：

```vue-html
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqFU2Fv0zAQ/StHJtROapNuZTBCNwnQQKBpTGxCQss+uMml8+bYlu2UlZL/zjlp0lQa40sU3/nd3Xv3vA7eax0uSwziYGZTw7UDi67Up4nkhVbGwScm09U5tw5yowoYhFEX8cBBImdRgyQMHRwWWjCHdAKYbdFM83FpxEkS0DcJINZoxpotkCIHkySo7xOixcMep19KrmGustUISotGsgJHIPgDWqg6DKEyvoRUMGsJ4HG9HGX16bqpAlU1izy5baqDFegYweYroMttMwLAHx/Y9Kyan36RWUTN2+mjXfpbrei8k6SjdSuBYFOlMaNI6AeAtcflSrqx5b8xhkl4jMU7H0yVUCaGvVeH8+PjKYWqWnpf5DQYBTtb+fc612Awh2qzzGaBiUyVpBVpo7SFE8gw5xIv/Wl4M9gsbjCCQbuywe3+FuXl9iiqO7xpElEEhUofKFQo2mTGiFiOLr3jcpFImuiaF6hKNxzuw8lpw7kuEy6ZKJGK3TR6NluLYXBVqwRXQjkLn0ueIc3TLonyZ0sm4acqKVovKIbDCVQjGsb1qvyg2telU4Yzz6eHv6ARBWdwjVqUNCbbFjqgQn6aW1J8RKfJhDg+5/lStG4QHJZjnpO5XjT0BMqFu+uZ81yxjEQJw7A1kOA76FyZjaWBy0akvu8tCQKeQ+d7wsy5zLpz1FlzU3kW1QP+x40ApWgWAySEJTv6/NitNMkllcTakwCaZZ5ADEf6cROas/RhYVQps5igEpkZLwzRROmG04OjDBcj7+Js+vYQDo9e0uH1qzeY5/s1vtaaqG969+vTTrsmBTMLLv12nuy7l+d5W673SBzxkzlfhPdWSXokdZMkSFWhuUDzTTtOnk6CuG2fBEwI9etrHXOmRLJUE0/vMH14In5vH30sCS4Nkr+WmARdztHQ6Jr02dUFPtJ/lyxUVgq6/UzyO1olSj9jc+0DcaWxe/fqab/UT51Uu7Znjw6lbUn5QWtR6vtJQM//4zPUt+NOw+lGzCqo/gLm1QS8)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqNVNtq20AQ/ZWpQnECujhO0qaqY+hD25fQl4RCifKwllbKktXushcT1/W/d1bSSnYJNCCEZmbPmcuZ1S76olS6cTTKo6UpNVN2VQjWKqktfCOi3N4yY6HWsoVZmo0eD5kVAqAQ9KU7XNGaOG5h572lRAZBhTV574CJzJv7QuCzzMaMaFjaKk4sRQtgOeUmiiVO85siwncRQa6oThRpKHrO50XUnUdEwMMJw08M7mAtq20MzlAtSEtj4OyZGkweMIiq2AZKToxBgMcdxDCqVrueBfb7ZaaOQiOspZYgbL0FPBySIQD+eMeQc99/HJIsM0weqs+O258mjfZREE1jt5yCKaWiFXpSX0A/5loKmxj2m+YwT69p+7kXg0udw8nlYn19fYGufvSeZBXF0ZGmR2vwmrJKS4WiPswGWWYxzIIgs8fYH6mIJadnQXdNrdMiWAB+yJ7gsXdgLfjqcK10wtJqgmYZ+spnpGgl6up5oaa2fGKi6U8Yau9ZS6Wzpwi7WU1p7BMzaZcLbuBh0q2XM4fZXTc+uOPSGvjuWEWxlaAexr9uiIBf0qG3Uy6HxXwo9B+mn47CvbNSM+LHccDxAyvmjMA9Vdxh1WQiO0eywBVGEaN3Pj972wVxPKwOZ7BJWI2b+K5rOOVUNPbpYJNvJalwZmmahm3j7AhdSz3sPzDRS3R4SQwOCXxP4yVBzJqJarSzcY8H5mXWFfif1QVwPGjGcQWTLp7YrcLxCfyDdAuMW0cq30AOV+plcK1J+dxoXJkqR6igRCeNxjbxp3N6cX5V0Sb2K19dfFrA4uo9Gh8uP9K6Puvw3eyx9SH3IT/qPCZpiW6Y8Gq9mvekrutAN96o/V99ALPj)

</div>

### 无渲染组件 {#renderless-components}

上面讨论的 `<FancyList>` 用例同时封装了可复用的逻辑（数据获取、分页等）和视觉输出，同时又通过作用域插槽将部分视觉输出委托给消费组件。

如果我们把这个概念再向前推进一点，就可以得到一种只封装逻辑、而自身不渲染任何内容的组件——视觉输出会通过作用域插槽完全委托给消费组件。我们把这种类型的组件称为 **无渲染组件**。

一个无渲染组件的例子，是封装当前鼠标位置追踪逻辑的组件：

```vue-html
<MouseTracker v-slot="{ x, y }">
  鼠标位置：{{ x }}, {{ y }}
</MouseTracker>
```

<div class="composition-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqNUcFqhDAQ/ZUhF12w2rO4Cz301t5aaCEX0dki1SQko6uI/96J7i4qLPQQmHmZ9+Y9ZhQvxsRdiyIVmStsZQgcUmtOUlWN0ZbgXbcOP2xe/KKFs9UNBHGyBj09kCpLFj4zuSFsTJ0T+o6yjUb35GpNRylG6CMYYJKCpwAkzWNQOcgphZG/YZoiX/DQNAttFjMrS+6LRCT2rh6HGsHiOQKtmKIIS19+qmZpYLrmXIKxM1Vo5Yj9HD0vfD7ckGGF3LDWlOyHP/idYPQCfdzldTtjscl/8MuDww78lsqHVHdTYXjwCpdKlfoS52X52qGit8oRKrRhwHYdNrrDILouPbCNVZCtgJ1n/6Xx8JYAmT8epD3fr5cC0oGLQYpkd4zpD27R0vA=)

</div>
<div class="options-api">

[在 Playground 中试试](https://play.vuejs.org/#eNqVUU1rwzAM/SvCl7SQJTuHdLDDbttthw18MbW6hjW2seU0oeS/T0lounQfUDBGepaenvxO4tG5rIkoClGGra8cPUhT1c56ghcbA756tf1EDztva0iy/Ds4NCbSAEiD7diicafigeA0oFvLPAYNhWICYEE5IL00fMp8Hs0JYe0OinDIqFyIaO7CwdJGihO0KXTcLriK59NYBlUARTyMn6Hv0yHgIp7ARAvl3FXm8yCRiuu1Fv/x23JakVqtz3t5pOjNOQNoC7hPz0nHyRSzEr7Ghxppb/XlZ6JjRlzhTAlA+ypkLWwAM6c+8G2BdzP+/pPbRkOoL/KOldH2mCmtnxr247kKhAb9KuHKgLVtMEkn2knG+sIVzV9sfmy8hfB/swHKwV0oWja4lQKKjoNOivzKrf4L/JPqaQ==)

</div>

虽然这是一种有趣的模式，但无渲染组件所能实现的大多数内容，都可以通过 Composition API 更高效地实现，而不会产生额外的组件嵌套开销。后面我们会看到如何把同样的鼠标追踪功能实现为一个 [可组合函数](/guide/reusability/composables)。

不过，在需要同时封装逻辑**并且**组合视觉输出的场景中，作用域插槽仍然很有用，例如上面的 `<FancyList>` 示例。
