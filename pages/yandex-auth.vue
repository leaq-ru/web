<template>
  <b-container
    class="text-center"
    fluid="xl"
  >
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <div class="mt-5 mb-5 text-center">
      <b-spinner variant="secondary" />
    </div>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import makeTitle from '~/helpers/makeTitle'

export default Vue.extend({
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
        to: {}
      }]
    }
  },
  async beforeCreate (): Promise<void> {
    try {
      const query: any = this.$nuxt.context.route?.query

      const raw = await fetch([
        process.env.API_HOST,
        '/v1/user/yandexAuth'
      ].join(''), {
        method: 'POST',
        body: JSON.stringify({
          code: query.code
        })
      })

      if (!raw.ok) {
        this.$nuxt.context.error({
          statusCode: 500
        })
        return
      }

      const res = await raw.json()

      this.$store.commit('user/login', res)

      let to = '/'
      if (query.state) {
        to = query.state
      }

      await this.$router.push(to)
    } catch {
      this.$nuxt.context.error({
        statusCode: 500
      })
    }
  },
  head () {
    return {
      title: makeTitle('Войти'),
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'Войти или зарегистрироваться в LEAQ'
      }]
    }
  }
})
</script>
