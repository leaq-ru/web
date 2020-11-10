<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <b-row>
      <b-col md="6">
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
        <b-form-text id="input-title-help">
          {{ safeTitleLen(company) }}/48 символов
        </b-form-text>
      </b-col>

      <b-col md="6">
        <label for="input-description">
          Описание
        </label>
        <b-form-textarea
          id="input-description"
          v-model="company.description"
          :state="descriptionState"
          aria-describedby="input-description-help"
          placeholder="Описание товаров, услуг, деятельности компании"
        />
        <b-form-text id="input-description-help">
          {{ safeDescriptionLen(company) }}/1500 символов
        </b-form-text>
      </b-col>
    </b-row>
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
      ctx.error({
        statusCode: 404
      })
      return
    }

    const raw = await fetch([
      apiAddr,
      '/v2/company/getBySlug?',
      new URLSearchParams({
        slug: ctx.params.companySlug
      }).toString()
    ].join(''))

    if (!raw.ok) {
      ctx.error({
        statusCode: 404
      })
      return
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
      }]
    }
  },
  computed: {
    titleState () {
      return this.company.title?.length <= 48
    },
    descriptionState () {
      return this.company.description?.length <= 1500
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
