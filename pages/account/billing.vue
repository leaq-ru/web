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
      Мои платежи
    </h2>

    <p class="text-muted">
      Баланс: {{ balance }} руб.
    </p>

    <b-input-group class="mt-3">
      <b-form-input
        v-model="sum"
        type="number"
        class="col-sm-2 col-md-2 col-lg-1"
        placeholder="Сумма"
      />

      <b-input-group-append>
        <b-input-group-text>
          руб.
        </b-input-group-text>
      </b-input-group-append>

      <b-input-group-append>
        <b-button
          variant="primary"
          @click="paymentRedirect"
        >
          Пополнить
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <p
      v-if="!invoices.length"
      class="mt-5 text-muted"
    >
      Здесь будет отображаться история всех операций
    </p>

    <b-button
      v-if="invoices.length >= 20 && !invoicesScrollDone && invoicesLoaded"
      class="mt-3"
      pill
      variant="primary"
      @click="getInvoices"
    >
      <b-icon-arrow-clockwise
        v-if="invoicesLoading"
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

export default Vue.extend({
  async asyncData (ctx: Context): Promise<object | void> {
    try {
      if (!ctx.store.state?.user?.self?.token) {
        ctx.redirect(makeAuthUrl(ctx.route))
        return
      }

      const query = new URLSearchParams()
      query.append('opts.limit', '20')

      const [rawInv, rawBal] = await Promise.all([
        fetch([
          apiAddr,
          '/v1/billing/getMyInvoices?',
          query.toString()
        ].join(''), {
          headers: new Headers({
            Authorization: `Bearer ${ctx.store.state?.user?.self?.token}`
          })
        }),
        fetch([
          apiAddr,
          '/v1/billing/getMyBalance'
        ].join(''), {
          headers: new Headers({
            Authorization: `Bearer ${ctx.store.state?.user?.self?.token}`
          })
        })
      ])

      if (!rawInv.ok || !rawBal.ok) {
        return ctx.error({
          statusCode: 500
        })
      }

      const [resInv, resBal] = await Promise.all([
        rawInv.json(),
        rawBal.json()
      ])

      return {
        balance: Number(resBal.balance) / 100,
        invoices: resInv.invoices || [],
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
        text: 'Мои платежи',
        to: {
          path: '/account/billing'
        }
      }],
      sum: 490,
      invoicesScrollDone: false,
      invoicesLoading: false,
      invoicesLoaded: true
    }
  },
  computed: {
    invoicesSkip (): number | undefined {
      return this.invoices?.length
    }
  },
  methods: {
    async getInvoices () {
      const limit = 20

      const query = new URLSearchParams()
      query.append('opts.limit', limit.toString())
      if (this.invoicesSkip) {
        query.append('opts.skip', this.invoicesSkip)
      }

      this.invoicesLoading = true
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
      this.invoicesLoading = false

      this.invoicesLoaded = false
      if (Array.isArray(res?.invoices)) {
        this.invoices.push(...res.invoices)
      }
      setTimeout(() => {
        this.invoicesLoaded = true
      }, 0)
      if (!res?.invoices || res?.invoices?.length < limit) {
        this.invoicesScrollDone = true
      }
    }
  },
  head () {
    return {
      title: makeTitle('Мои платежи')
    }
  }
})
</script>
