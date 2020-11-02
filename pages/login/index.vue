<template>
  <b-container
    class="text-center"
    fluid="xl"
  >
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <b-alert
      :show="info"
      variant="info"
    >
      Чтобы просматривать эту страницу, нужно зайти на сайт
    </b-alert>

    <h2>
      Войти на LEAQ
    </h2>

    <p>
      Если виджет не отображается, попробуйте отключить AdBlock
    </p>

    <div class="d-flex flex-row justify-content-center align-items-center">
      <div id="vk_auth" />
    </div>

    <script type="text/javascript">
      VK.init({
      apiId: 7646708,
      });

      VK.Widgets.Auth("vk_auth", {
      authUrl: '/login/vk',
      });
    </script>
    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'

export default Vue.extend({
  asyncData (ctx: Context): object {
    return {
      info: Boolean(ctx?.route?.query?.info),
      to: String(ctx?.route?.query?.to)
    }
  },
  data () {
    return {
      breadcrumb: [{
        id: 1,
        text: '🏠',
        to: {
          path: '/'
        }
      }, {
        id: 2,
        text: 'Войти',
        to: {
          path: '/login'
        }
      }]
    }
  },
  head () {
    return {
      title: 'Войти / Каталог компаний LEAQ',
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'Войти или зарегистрироваться в LEAQ'
      }]
    }
  }
})
</script>
