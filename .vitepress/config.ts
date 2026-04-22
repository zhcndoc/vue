import fs from 'fs'
import path from 'path'
import {
  defineConfigWithTheme,
  type HeadConfig,
  type Plugin
} from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import llmstxt from 'vitepress-plugin-llms'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'

const nav: ThemeConfig['nav'] = [
  {
    text: '文档',
    activeMatch: `^/(guide|tutorial|examples|api|glossary|error-reference)/`,
    items: [
      { text: '快速开始', link: '/guide/quick-start' },
      { text: '指南', link: '/guide/introduction' },
      { text: '教程', link: '/tutorial/' },
      { text: '示例', link: '/examples/' },
      { text: 'API', link: '/api/' },
      // { text: 'Style Guide', link: '/style-guide/' },
      { text: '术语表', link: '/glossary/' },
      { text: '错误参考', link: '/error-reference/' },
      {
        text: 'Vue 2 文档',
        link: 'https://v2.vuejs.org'
      },
      {
        text: '从 Vue 2 迁移',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: '在线演练场',
    link: 'https://play.vuejs.org'
  },
  {
    text: '生态系统',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: '资源',
        items: [
          { text: '主题', link: '/ecosystem/themes' },
          { text: 'UI 组件', link: 'https://ui-libs.vercel.app/' },
          {
            text: '插件集合',
            link: 'https://www.vue-plugins.org/'
          },
          {
            text: '认证',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          { text: '招聘', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'T 恤商店', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: '官方库',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          { text: '工具指南', link: '/guide/scaling-up/tooling.html' }
        ]
      },
      {
        text: '视频课程',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: '帮助',
        items: [
          {
            text: 'Discord 聊天',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'GitHub 讨论区',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'DEV 社区', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: '资讯',
        items: [
          { text: '博客', link: 'https://blog.vuejs.org/' },
          { text: 'X', link: 'https://x.com/vuejs' },
          { text: '活动', link: 'https://events.vuejs.org/' },
          { text: '新闻通讯', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: '关于',
    activeMatch: `^/about/`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: '团队', link: '/about/team' },
      { text: '发布版本', link: '/about/releases' },
      {
        text: '社区指南',
        link: '/about/community-guide'
      },
      { text: '行为准则', link: '/about/coc' },
      { text: '隐私政策', link: '/about/privacy' },
      {
        text: '纪录片',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: '支持',
    activeMatch: `^/(sponsor|partners)/`,
    items: [
      { text: '赞助', link: '/sponsor/' },
      { text: '合作伙伴', link: '/partners/' }
    ]
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '介绍', link: '/guide/introduction' },
        {
          text: '快速开始',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: '基础',
      items: [
        {
          text: '创建一个应用',
          link: '/guide/essentials/application'
        },
        {
          text: '模板语法',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: '响应式基础',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: '计算属性',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Class 与 Style 绑定',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: '条件渲染',
          link: '/guide/essentials/conditional'
        },
        { text: '列表渲染', link: '/guide/essentials/list' },
        {
          text: '事件处理',
          link: '/guide/essentials/event-handling'
        },
        { text: '表单输入绑定', link: '/guide/essentials/forms' },
        { text: '侦听器', link: '/guide/essentials/watchers' },
        { text: '模板引用', link: '/guide/essentials/template-refs' },
        {
          text: '组件基础',
          link: '/guide/essentials/component-basics'
        },
        {
          text: '生命周期钩子',
          link: '/guide/essentials/lifecycle'
        }
      ]
    },
    {
      text: '深入组件',
      items: [
        {
          text: '注册',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        { text: '事件', link: '/guide/components/events' },
        { text: '组件 v-model', link: '/guide/components/v-model' },
        {
          text: '透传 Attributes',
          link: '/guide/components/attrs'
        },
        { text: '插槽', link: '/guide/components/slots' },
        {
          text: 'Provide / Inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: '异步组件',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: '复用',
      items: [
        {
          text: '组合式函数',
          link: '/guide/reusability/composables'
        },
        {
          text: '自定义指令',
          link: '/guide/reusability/custom-directives'
        },
        { text: '插件', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: '内置组件',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: '规模化',
      items: [
        { text: '单文件组件', link: '/guide/scaling-up/sfc' },
        { text: '工具链', link: '/guide/scaling-up/tooling' },
        { text: '路由', link: '/guide/scaling-up/routing' },
        {
          text: '状态管理',
          link: '/guide/scaling-up/state-management'
        },
        { text: '测试', link: '/guide/scaling-up/testing' },
        {
          text: '服务端渲染（SSR）',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: '最佳实践',
      items: [
        {
          text: '生产环境部署',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: '性能',
          link: '/guide/best-practices/performance'
        },
        {
          text: '无障碍',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: '安全',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: '概览', link: '/guide/typescript/overview' },
        {
          text: 'Composition API 与 TS',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'Options API 与 TS',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: '进阶主题',
      items: [
        {
          text: '使用 Vue 的多种方式',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'Composition API 常见问答',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: '深入响应式系统',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: '渲染机制',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: '渲染函数与 JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue 与 Web Components',
          link: '/guide/extras/web-components'
        },
        {
          text: '动画技巧',
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: '全局 API',
      items: [
        { text: '应用实例', link: '/api/application' },
        {
          text: '通用',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: '响应式：核心',
          link: '/api/reactivity-core'
        },
        {
          text: '响应式：工具',
          link: '/api/reactivity-utilities'
        },
        {
          text: '响应式：进阶',
          link: '/api/reactivity-advanced'
        },
        {
          text: '生命周期钩子',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: '依赖注入',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: '辅助函数',
          link: '/api/composition-api-helpers'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options：状态', link: '/api/options-state' },
        { text: 'Options：渲染', link: '/api/options-rendering' },
        {
          text: 'Options：生命周期',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options：组合',
          link: '/api/options-composition'
        },
        { text: 'Options：其他', link: '/api/options-misc' },
        {
          text: '组件实例',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: '内置内容',
      items: [
        { text: '指令', link: '/api/built-in-directives' },
        { text: '组件', link: '/api/built-in-components' },
        {
          text: '特殊元素',
          link: '/api/built-in-special-elements'
        },
        {
          text: '特殊 Attributes',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: '单文件组件',
      items: [
        { text: '语法规范', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'CSS 特性', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: '高级 API',
      items: [
        { text: '自定义元素', link: '/api/custom-elements' },
        { text: '渲染函数', link: '/api/render-function' },
        { text: '服务端渲染', link: '/api/ssr' },
        { text: 'TypeScript 工具类型', link: '/api/utility-types' },
        { text: '自定义渲染器', link: '/api/custom-renderer' },
        { text: '编译时标志', link: '/api/compile-time-flags' }
      ]
    }
  ],
  '/examples/': [
    {
      text: '基础',
      items: [
        {
          text: '你好，世界',
          link: '/examples/#hello-world'
        },
        {
          text: '处理用户输入',
          link: '/examples/#handling-input'
        },
        {
          text: '属性绑定',
          link: '/examples/#attribute-bindings'
        },
        {
          text: '条件与循环',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: '表单绑定',
          link: '/examples/#form-bindings'
        },
        {
          text: '简单组件',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: '实战',
      items: [
        {
          text: 'Markdown 编辑器',
          link: '/examples/#markdown'
        },
        {
          text: '获取数据',
          link: '/examples/#fetching-data'
        },
        {
          text: '支持排序与筛选的表格',
          link: '/examples/#grid'
        },
        {
          text: '树形视图',
          link: '/examples/#tree'
        },
        {
          text: 'SVG 图表',
          link: '/examples/#svg'
        },
        {
          text: '带过渡效果的模态框',
          link: '/examples/#modal'
        },
        {
          text: '带过渡效果的列表',
          link: '/examples/#list-transition'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: '计数器',
          link: '/examples/#counter'
        },
        {
          text: '温度转换器',
          link: '/examples/#temperature-converter'
        },
        {
          text: '航班预订',
          link: '/examples/#flight-booker'
        },
        {
          text: '计时器',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: '画圆',
          link: '/examples/#circle-drawer'
        },
        {
          text: '表格单元格',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: '风格指南',
      items: [
        {
          text: '概览',
          link: '/style-guide/'
        },
        {
          text: 'A - 必要',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - 强烈推荐',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - 推荐',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - 谨慎使用',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

// Placeholder of the i18n config for @vuejs-translations.
// const i18n: ThemeConfig['i18n'] = {
// }

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8'
    )
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://vue.zhcndoc.com'
  },

  lang: 'zh-CN',
  title: 'Vue.js 中文文档',
  titleTemplate: ':title - Vue.js 中文文档',
  description: 'Vue.js - 渐进式 JavaScript 框架',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - 渐进式 JavaScript 框架'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vue.zhcndoc.com/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://automation.vuejs.org'
      }
    ],
    inlineScript('restorePreference.js'),
    inlineScript('uwu.js'),
    [
      'script',
      {
        src: 'https://www.zhcndoc.com/js/common.js',
        async: 'true'
      }
    ],
    [
      'script',
      {
        src: 'https://media.bitterbrains.com/main.js?from=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    // Placeholder of the i18n config for @vuejs-translations.
    // i18n,

    localeLinks: [
      {
        link: 'https://vuejs.org',
        text: 'English',
        repo: 'https://github.com/vuejs/docs'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/vuejs-translations/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: 'https://pl.vuejs.org',
        text: 'Polski',
        repo: 'https://github.com/vuejs-translations/docs-pl'
      },
      {
        link: '/translations/',
        text: '帮助我们翻译！',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: '10e7a8b13e6aec4007343338ab134e05',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    // carbonAds: {
    //   code: 'CEBDT27Y',
    //   placement: 'vuejsorg'
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://x.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'zhcndoc/vue',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin).use(groupIconMdPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    },
    plugins: [
      llmstxt({
        ignoreFiles: [
          'about/team/**/*',
          'about/team.md',
          'about/privacy.md',
          'about/coc.md',
          'developers/**/*',
          'ecosystem/themes.md',
          'examples/**/*',
          'partners/**/*',
          'sponsor/**/*',
          'index.md'
        ],
        customLLMsTxtTemplate: `\
# Vue.js

Vue.js - The Progressive JavaScript Framework

## Table of Contents

{toc}`
      }) as Plugin,
      groupIconVitePlugin({
        customIcon: {
          cypress: 'vscode-icons:file-type-cypress',
          'testing library': 'logos:testing-library'
        }
      }) as Plugin
    ]
  }
})
