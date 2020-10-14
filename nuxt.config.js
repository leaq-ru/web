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
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
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
    'bootstrap-vue/nuxt',
    '@nuxtjs/component-cache'
  ],
  bootstrapVue: {
    components: [
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
      'BIcon',

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
      'BCard',
      'BCardBody',
      'BCardGroup',
      'BCardFooter',
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
      'BNavItem'
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
    API_HOST: 'https://api.leaq.ru'
  },
  router: {
    prefetchLinks: false,
    trailingSlash: false
  }
}
