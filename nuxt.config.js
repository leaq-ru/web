import ssrBotsOnly from './middleware/ssrBotsOnly'

export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [{
    src: '~/plugins/vue-infinite-loading',
    mode: 'client',
    ssr: false
  }, {
    src: '~plugins/localStorage.js',
    ssr: false
  }],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/fontawesome'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt'
  ],
  bootstrapVue: {
    components: [
      'BIcon',
      'BIconArrowClockwise',
      'BIconSearch',
      'BIconEnvelope',
      'BIconTelephone',
      'BIconGlobe',
      'BIconBuilding',
      'BIconGrid',
      'BIconMap',
      'BIconClock',
      'BIconPeople',
      'BIconPersonCircle',
      'BIconInfoCircle',
      'BIconCloud',
      'BIconHdd',
      'BIconCircleFill',
      'BIconArrowUpCircle',
      'BIconArrowDownCircle',
      'BIconTags',
      'BIconArrowLeftCircle',
      'BIconEmojiFrown',
      'BIconCardHeading',
      'BIconList',
      'BIconGear',
      'BIconCloudDownload',
      'BIconArrowDownCircle',

      'BContainer',
      'BRow',
      'BCol',
      'BButton',
      'BJumbotron',
      'BLink',
      'BFormGroup',
      'BFormTag',
      'BFormText',
      'BFormInput',
      'BFormSelect',
      'BFormRadioGroup',
      'BCard',
      'BCardBody',
      'BCardGroup',
      'BCardFooter',
      'BCardText',
      'BCardImgLazy',
      'BAlert',
      'BImgLazy',
      'BCollapse',
      'BListGroup',
      'BListGroupItem',
      'BAvatar',
      'BBreadcrumb',
      'BBreadcrumbItem',
      'BNavbar',
      'BNavbarBrand',
      'BNavbarToggle',
      'BNavbarNav',
      'BNavItem',
      'BNavItemDropdown',
      'BDropdownItem'
    ]
  },
  fontawesome: {
    component: 'fa',
    icons: {
      brands: [
        'faVk',
        'faInstagram',
        'faYoutube',
        'faFacebook',
        'faTwitter',
        'faAppStore',
        'faGooglePlay'
      ]
    }
  },
  /*
  ** Content module configuration
  ** See https://content.nuxtjs.org/configuration
  */
  content: {},
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    extractCSS: true,
    transpile: [
      () => 'vue-bootstrap-typeahead'
    ],
    extend (config, ctx) {
      if (process.env.NODE_ENV !== 'production') {
        config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'
      }
    }
  },
  env: {
    HOST: process.env.NODE_ENV === 'production' ? 'https://leaq.ru' : 'http://leaq.local',
    API_HOST: process.env.NODE_ENV === 'production' ? 'https://api.leaq.ru' : 'http://localhost:1111'
  },
  router: {
    prefetchLinks: false,
    trailingSlash: false
  },
  serverMiddleware: [{
    handler: ssrBotsOnly
  }]
}
