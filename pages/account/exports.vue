<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Мои выгрузки
    </h2>

    <b-card class="col-sm-9 col-md-7 col-lg-5">
      <p>
        <b-link to="/plans#data">
          Расширенный доступ к данным
        </b-link>

        <template v-if="dataPremium">
          до {{ dataPremiumDeadline }}
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
      v-if="!exports.length"
      class="mt-3 text-muted"
    >
      Здесь будет отображаться история всех выгрузок csv баз компаний
    </p>
    <b-table
      v-else
      class="mt-3"
      striped
      hover
      :items="exports"
    />

    <b-button
      v-if="exports.length >= 20 && !exportsScrollDone && exportsLoaded"
      pill
      variant="primary"
      @click="getExports"
    >
      <b-icon-arrow-clockwise
        v-if="exportsLoading"
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

export default Vue.extend({
  async asyncData (ctx: Context): Promise<object | void> {
    try {
      if (!ctx.store.state?.user?.self?.token) {
        ctx.redirect(makeAuthUrl(ctx.route))
        return
      }

      const query = new URLSearchParams()
      query.append('opts.limit', '20')

      const [rawFiles, rawDataPlan] = await Promise.all([
        fetch([
          apiAddr,
          '/v1/exporter/getMyFiles?',
          query.toString()
        ].join(''), {
          headers: new Headers({
            Authorization: `Bearer ${ctx.store.state?.user?.self?.token}`
          })
        }),
        fetch([
          apiAddr,
          '/v1/billing/getMyDataPlan'
        ].join(''), {
          headers: new Headers({
            Authorization: `Bearer ${ctx.store.state?.user?.self?.token}`
          })
        })
      ])

      if (!rawFiles.ok || !rawDataPlan.ok) {
        return ctx.error({
          statusCode: 500
        })
      }

      const [resFiles, resDataPlan] = await Promise.all([
        rawFiles.json(),
        rawDataPlan.json()
      ])

      const data = {
        exports: resFiles?.files || [],
        dataPremium: resDataPlan?.premium || false,
        dataPremiumDeadline: null
      }

      if (data.dataPremium) {
        data.dataPremiumDeadline = unifyDate(resDataPlan.premiumDeadline).toLocaleDateString()
      }

      return data
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
      renewDataPremiumLoading: false,
      errInsufficientFunds: false,
      monthAmount: 1
    }
  },
  computed: {
    exportsSkip (): number | undefined {
      return this.exports?.length
    },
    amount () {
      return this.monthAmount * 1990
    }
  },
  methods: {
    unifyDate,
    async renewDataPremium () {
      this.errInsufficientFunds = false
      this.renewDataPremiumLoading = true

      const token = this.$store.state?.user?.self?.token

      const rawRenew = await fetch([
        apiAddr,
        '/v1/billing/renewDataPremium'
      ].join(''), {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`
        }),
        body: JSON.stringify({
          monthAmount: this.monthAmount
        })
      })
      this.renewDataPremiumLoading = false

      if (!rawRenew.ok) {
        const res = await rawRenew.json()
        if (res?.error === 'insufficient funds') {
          this.errInsufficientFunds = true
          return
        }

        return this.$nuxt.context.error({
          statusCode: 500
        })
      }

      const rawDataPlan = await fetch([
        apiAddr,
        '/v1/billing/getMyDataPlan'
      ].join(''), {
        headers: new Headers({
          Authorization: `Bearer ${token}`
        })
      })

      const resDataPlan = await rawDataPlan.json()

      this.dataPremium = resDataPlan?.premium
      if (this.dataPremium) {
        this.dataPremiumDeadline = unifyDate(resDataPlan?.premiumDeadline).toLocaleDateString()
      }
    },
    async getExports () {
      const limit = 20

      const query = new URLSearchParams()
      query.append('opts.limit', limit.toString())
      if (this.exportsSkip) {
        query.append('opts.skip', this.exportsSkip)
      }

      this.exportsLoading = true
      const raw = await fetch([
        apiAddr,
        '/v1/exporter/getMyFiles?',
        query.toString()
      ].join(''), {
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        })
      })
      const res = await raw.json()
      this.exportsLoading = false

      this.exportsLoaded = false
      if (Array.isArray(res?.files)) {
        this.exports.push(...res.files)
      }
      setTimeout(() => {
        this.exportsLoaded = true
      }, 0)
      if (!res?.files || res?.files?.length < limit) {
        this.exportsScrollDone = true
      }
    },
    rotateMonths () {
      switch (this.monthAmount) {
        case 1:
          this.monthAmount = 3
          return
        case 3:
          this.monthAmount = 6
          return
        case 6:
          this.monthAmount = 12
          return
        case 12:
          this.monthAmount = 1
      }
    }
  },
  head () {
    return {
      title: makeTitle('Мои выгрузки')
    }
  }
})
</script>
