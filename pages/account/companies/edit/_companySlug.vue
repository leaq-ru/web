<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <label for="input-title">
      Название
    </label>
    <b-form-input
      id="input-title"
      v-model="company.title"
      :state="titleState"
      aria-describedby="input-title-help"
      placeholder="Название компании"
    />
    <b-form-text id="input-live-help">
      {{ safeTitleLen(company) }}/48
    </b-form-text>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import apiAddr from '~/helpers/const/apiAddr'
import companyGetters from '~/helpers/company/companyGetters'
import makeTitle from '~/helpers/makeTitle'
import makeAuthUrl from '~/helpers/makeAuthUrl'

export default Vue.extend({
  async asyncData (ctx: Context): Promise<object> {
    if (!ctx.store.state?.user?.self?.token) {
      ctx.redirect(makeAuthUrl(ctx.route.path))
      return
    }

    if (!ctx.params.companySlug) {
      return ctx.error({
        statusCode: 404
      })
    }

    const raw = await fetch([
      apiAddr,
      '/v2/company/getBySlug?',
      new URLSearchParams({
        slug: ctx.params.companySlug
      }).toString()
    ].join(''))

    if (!raw.ok) {
      return ctx.error({
        statusCode: 404
      })
    }

    const res = await raw.json()

    return {
      company: res.fullCompany
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
        to: {
          path: '/account'
        }
      }, {
        id: 3,
        text: 'Мои компании',
        to: {
          path: '/account/companies'
        }
      }, {
        id: 4,
        text: this.$route.params.companySlug,
        to: {},
        active: false
      }, {
        id: 5,
        text: 'Редактировать',
        to: {
          path: `/account/companies/edit/${this.$route.params.companySlug}`
        }
      }],
      titleState: false
    }
  },
  methods: {
    ...companyGetters
  },
  head: {
    title: makeTitle('Редактировать информацию о компании')
  }
})
</script>
