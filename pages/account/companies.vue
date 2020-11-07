<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'

export default Vue.extend({
  async asyncData (ctx: Context): Promise<object> {
    try {
      const raw = await fetch([
        process.env.API_HOST,
        '/v1/company/getMy'
      ].join(''), {
        headers: new Headers({
          Authorization: `Bearer ${ctx.store.state?.user?.self?.token}`
        })
      })

      if (!raw.ok) {
        return ctx.error({
          statusCode: 500
        })
      }

      const res = await raw.json()

      return {
        companies: res.companies || []
      }
    } catch {
      return ctx.error({
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
        text: 'Аккаунт',
        to: {},
        active: false
      }, {
        id: 3,
        text: 'Мои компании',
        to: {
          path: '/account/companies'
        }
      }]
    }
  }
})
</script>
