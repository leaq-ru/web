<template>
  <b-container
    class="text-center"
    fluid="xl"
  >
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <div class="mt-5 mb-5">
      <b-icon-arrow-clockwise
        animation="spin"
        variant="secondary"
        scale="6"
      />
    </div>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async fetch (): Promise<void> {
    try {
      const query: any = this.$nuxt.context.route?.query

      const raw = await fetch([
        process.env.API_HOST,
        '/v1/user/vkAuth'
      ].join(''), {
        method: 'POST',
        body: JSON.stringify({
          code: query.code
        })
      }).catch()

      if (!raw.ok) {
        return this.$nuxt.context.error({
          statusCode: 500
        })
      }

      const res = await raw.json()

      this.$store.commit('user/login', res)

      let redirect = '/'
      if (query.state) {
        redirect = query.state
      }

      return this.$nuxt.context.redirect(redirect)
    } catch {
      return this.$nuxt.context.error({
        statusCode: 500
      })
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
          path: '/login/vk'
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
