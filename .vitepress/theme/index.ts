import './styles/index.css'
import { h, App } from 'vue'
import { VPTheme } from '@vue/theme'
import PreferenceSwitch from './components/PreferenceSwitch.vue'
// import SecurityUpdateBtn from './components/SecurityUpdateBtn.vue'
import {
  preferComposition,
  preferSFC,
  filterHeadersByPreference
} from './components/preferences'
// import SponsorsAside from './components/SponsorsAside.vue'
// import VueSchoolLink from './components/VueSchoolLink.vue'
// import WwAds from './components/WwAds.vue'
// // import Banner from './components/Banner.vue'
// import TextAd from './components/TextAd.vue'

export default Object.assign({}, VPTheme, {
  Layout: () => {
    // @ts-ignore
    return h(VPTheme.Layout, null, {
      // banner: () => h(Banner),
      'sidebar-top': () => h(PreferenceSwitch),
      // 'sidebar-bottom': () => h(SecurityUpdateBtn),
      // 'aside-mid': () => h(SponsorsAside),
      // 'aside-bottom': () => h(WwAds),
      'aside-bottom': () =>
        h('div', {
          class: 'wwads-cn wwads-vertical',
          'data-id': '354'
        }),
      'content-bottom': () =>
        h('div', {
          class: 'wwads-cn wwads-horizontal',
          'data-id': '354'
        })
    })
  },
  enhanceApp({ app }: { app: App }) {
    app.provide('prefer-composition', preferComposition)
    app.provide('prefer-sfc', preferSFC)
    app.provide('filter-headers', filterHeadersByPreference)
    // app.component('VueSchoolLink', VueSchoolLink)
    // app.component('TextAd', TextAd)
  }
})
