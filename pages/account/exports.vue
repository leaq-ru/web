<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Мои выгрузки
    </h2>

    <b-card class="col-sm-8 col-md-6 col-lg-4 mt-3">
      <p>
        <b-link to="/plans#company">
          Приоритетное размещение
        </b-link>

        <template v-if="dataPremium">
          до {{ unifyDate(dataPremiumDeadline).toLocaleDateString() }}
        </template>
      </p>

      <b-row />

      <b-button
        v-if="dataPremium"
        size="sm"
        pill
        variant="success"
        :disabled="renewDataPremiumLoading"
        @click="renewDataPremium"
      >
        <b-icon-arrow-clockwise
          v-if="renewDataPremiumLoading"
          animation="spin"
        />
        <b-icon-lightning-fill v-else />

        Продлить
      </b-button>
      <b-button
        v-else
        size="sm"
        pill
        variant="success"
        :disabled="renewDataPremiumLoading"
        @click="renewDataPremium"
      >
        <b-icon-arrow-clockwise
          v-if="renewDataPremiumLoading"
          animation="spin"
        />
        <b-icon-lightning-fill v-else />

        Активировать
      </b-button>

      <b-button
        variant="link"

        size="sm"
        :disabled="renewDataPremiumLoading"
        @click="rotateMonths"
      >
        на {{ monthAmount }} мес ({{ amount }} руб)
      </b-button>

      <p
        v-if="errInsufficientFunds"
        class="text-danger mt-3"
      >
        Недостаточно средств.

        <b-link to="/account/billing">
          Пополнить баланс?
        </b-link>
      </p>
    </b-card>

    <p
      v-if="!invoices.length"
      class="mt-3 text-muted"
    >
      Здесь будет отображаться история всех выгрузок csv баз компаний
    </p>
    <b-table
      v-else
      class="mt-3"
      striped
      hover
      :items="invoices"
    />

    <b-button
      v-if="invoices.length >= 20 && !exportsScrollDone && exportsLoaded"
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

const transformExports = (exports: any[]): any[] => exports.map((exp) => {
  const toStatus = (st) => {
    switch (st) {
      case 'PENDING':
        return 'Ожидание'
      case 'SUCCESS':
        return 'Успешно'
      case 'IN_PROGRESS':
        return 'Обработка'
      case 'FAIL':
        return 'Ошибка'
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
    Дата: unifyDate(exp.createdAt).toLocaleDateString(),
    Операция: toOp(exp.kind),
    Статус: toStatus(exp.status),
    Тип: toKind(exp.kind),
    Детали: toDetails(exp),
    Сумма: toAmount(exp.amount)
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
        exports: transformExports(resInv.invoices || [])
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
        text: 'Мои выгрузки',
        to: {
          path: '/account/exports'
        }
      }],
      exportsScrollDone: false,
      exportsLoading: false,
      exportsLoaded: true,
      errInsufficientFunds: false
    }
  },
  computed: {
    invoicesSkip (): number | undefined {
      return this.exports?.length
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
      if (this.exportsSkip) {
        query.append('opts.skip', this.exportsSkip)
      }

      this.exportsLoading = true
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
      this.exportsLoading = false

      this.exportsLoaded = false
      if (Array.isArray(res?.invoices)) {
        this.exports.push(...transformInvoices(res.invoices))
      }
      setTimeout(() => {
        this.exportsLoaded = true
      }, 0)
      if (!res?.invoices || res?.invoices?.length < limit) {
        this.exportsScrollDone = true
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
