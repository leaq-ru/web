<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <b-alert
      v-if="successMsg"
      variant="success"
      show
      dismissible
    >
      {{ successMsg }}
    </b-alert>

    <h2>
      Мои компании
    </h2>

    <p class="text-muted">
      Вы можете подтвердить права на сайты из каталога, и бесплатно управлять информацией о своей компании
    </p>

    <b-link to="/account/companies/apply">
      <b-icon-plus-circle />
      Добавить
    </b-link>

    <b-card
      v-for="company in companies"
      :key="company.id"
      class="mt-3 col-lg-8"
    >
      <MyCompanyCard
        :company="company"
        @paymentOk="loadMyCompaniesFirstPage"
      />
    </b-card>

    <b-button
      v-if="companies.length >= 20 && !companiesScrollDone && companiesLoaded"
      class="mt-3"
      pill
      variant="primary"
      @click="getCompanies"
    >
      <b-icon-arrow-clockwise
        v-if="companiesLoading"
        animation="spin"
      />
      <b-icon-arrow-down-circle v-else />

      Показать еще
    </b-button>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import makeTitle from '~/helpers/makeTitle'
import apiAddr from '~/helpers/const/apiAddr'
import makeAuthUrl from '~/helpers/makeAuthUrl'
import unifyDate from '~/helpers/unifyDate'

const loadMyCompaniesFirstPage = async (token: string): Promise<any[]> => {
  const query = new URLSearchParams()
  query.append('opts.limit', '20')

  const raw = await fetch([
    apiAddr,
    '/v1/company/getMy?',
    query.toString()
  ].join(''), {
    headers: new Headers({
      Authorization: `Bearer ${token}`
    })
  })
  const res = await raw.json()

  return res.companies || []
}

export default Vue.extend({
  async asyncData (ctx: Context): Promise<object | void> {
    try {
      if (!ctx.store.state?.user?.self?.token) {
        ctx.redirect(makeAuthUrl(ctx.route))
        return
      }

      const companies = await loadMyCompaniesFirstPage(ctx.store.state?.user?.self?.token)

      return {
        companies,
        successMsg: ctx.query?.successMsg
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
        to: {
          path: '/account'
        }
      }, {
        id: 3,
        text: 'Мои компании',
        to: {
          path: '/account/companies'
        }
      }],
      companiesScrollDone: false,
      companiesLoading: false,
      companiesLoaded: true
    }
  },
  computed: {
    companiesSkip (): number | undefined {
      return this.companies?.length
    }
  },
  methods: {
    async loadMyCompaniesFirstPage () {
      this.companies = await loadMyCompaniesFirstPage(this.$store.state?.user?.self?.token)
    },
    unifyDate,
    async getCompanies () {
      const limit = 20

      const query = new URLSearchParams()
      query.append('opts.limit', limit.toString())
      if (this.companiesSkip) {
        query.append('opts.skip', this.companiesSkip)
      }

      this.companiesLoading = true
      const raw = await fetch([
        apiAddr,
        '/v1/company/getMy?',
        query.toString()
      ].join(''), {
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        })
      })
      const res = await raw.json()
      this.companiesLoading = false

      this.companiesLoaded = false
      if (Array.isArray(res?.companies)) {
        this.companies.push(...res.companies)
      }
      setTimeout(() => {
        this.companiesLoaded = true
      }, 0)
      if (!res?.companies || res?.companies?.length < limit) {
        this.companiesScrollDone = true
      }
    }
  },
  head () {
    return {
      title: makeTitle('Мои компании')
    }
  }
})
</script>
