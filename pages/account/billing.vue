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

    <b-card class="col-sm-8 col-md-6 col-lg-4 mt-3">
      <span class="text-muted">
        <b-icon-wallet />

        Баланс
      </span>

      {{ `${balance} руб` }}

      <b-row />

      <b-input-group class="mt-3">
        <b-form-input
          v-model="sum"
          :state="sumState"
          class="no-spin"
          type="number"
          placeholder="Сумма"
        />

        <b-input-group-append>
          <b-input-group-text>
            руб
          </b-input-group-text>
        </b-input-group-append>

        <b-input-group-append>
          <b-button
            :disabled="!sumState || paymentRedirectLoading"
            variant="primary"
            @click="paymentRedirect"
          >
            Пополнить
          </b-button>
        </b-input-group-append>

        <b-input-group-append v-if="paymentRedirectLoading">
          <b-icon-arrow-clockwise
            class="ml-2 mt-2 text-primary"
            font-scale="1.5"
            animation="spin"
          />
        </b-input-group-append>
      </b-input-group>

      <b-row />

      <b-form-text
        v-if="!sumState"
        text-variant="danger"
      >
        Минимум 490 руб
      </b-form-text>
    </b-card>

    <p
      v-if="!invoices.length"
      class="mt-3 text-muted"
    >
      Здесь будет отображаться история всех операций
    </p>
    <b-table
      v-else
      class="mt-3"
      striped
      hover
      :items="invoices"
    />

    <b-button
      v-if="invoices.length >= 20 && !invoicesScrollDone && invoicesLoaded"
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
import unifyDate from '~/helpers/unifyDate'

const transformInvoices = (invs: any[]): any[] => invs.map((inv) => {
  const toStatus = (st) => {
    switch (st) {
      case 'PENDING':
        return 'Ожидание'
      case 'SUCCESS':
        return 'Успешно'
    }
  }
  const toOp = (kind) => {
    switch (kind) {
      case 'DEBIT_ROBOKASSA':
        return 'Пополнение'
      case 'DEBIT_MANUAL':
        return 'Пополнение'
      case 'CREDIT_COMPANY_PREMIUM':
        return 'Списание'
    }
  }
  const toKind = (kind) => {
    switch (kind) {
      case 'DEBIT_ROBOKASSA':
        return 'Robokassa'
      case 'DEBIT_MANUAL':
        return 'Операция вручную'
      case 'CREDIT_COMPANY_PREMIUM':
        return 'Приоритетное размещение'
    }
  }
  const toDetails = (inv) => {
    if (inv?.debitRobokassa?.invoiceId) {
      return `Счет #${inv.debitRobokassa.invoiceId}`
    }

    if (inv?.creditCompanyPremium?.companySlug) {
      return `${inv.creditCompanyPremium.companySlug} (${inv?.creditCompanyPremium?.monthAmount} мес)`
    }
  }
  const toAmount = (am) => {
    return `${am / 100} руб`
  }

  return {
    Дата: unifyDate(inv.createdAt).toLocaleDateString(),
    Операция: toOp(inv.kind),
    Статус: toStatus(inv.status),
    Тип: toKind(inv.kind),
    Детали: toDetails(inv),
    Сумма: toAmount(inv.amount)
  }
})

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
        invoices: transformInvoices(resInv.invoices || []),
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
      invoicesLoaded: true,
      paymentRedirectLoading: false
    }
  },
  computed: {
    invoicesSkip (): number | undefined {
      return this.invoices?.length
    },
    sumState (): boolean {
      return this.sum >= 490
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
        '/v1/billing/getMyInvoices?',
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
        this.invoices.push(...transformInvoices(res.invoices))
      }
      setTimeout(() => {
        this.invoicesLoaded = true
      }, 0)
      if (!res?.invoices || res?.invoices?.length < limit) {
        this.invoicesScrollDone = true
      }
    },
    async paymentRedirect () {
      this.paymentRedirectLoading = true
      const raw = await fetch([
        apiAddr,
        '/v1/billing/createInvoice?'
      ].join(''), {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        }),
        body: JSON.stringify({
          amount: this.sum * 100
        })
      })
      const res = await raw.json()
      window.open(res.url, '_self')
    }
  },
  head () {
    return {
      title: makeTitle('Мои платежи')
    }
  }
})
</script>

<style scoped>
.no-spin::-webkit-inner-spin-button, .no-spin::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
  margin: 0 !important;
}

.no-spin {
  -moz-appearance:textfield !important;
}
</style>
