<template>
  <b-media>
    <template #aside>
      <b-img-lazy
        rounded
        :src="company.avatar || ''"
        width="100"
        height="100"
      />
    </template>

    <h5 class="mt-0 mb-1">
      <PatchLightning v-if="company.premium" />

      <PatchCheck v-if="company.verified" />

      {{ company.title || company.slug }}
    </h5>

    <b-row />

    <b-link
      v-if="company.url"
      itemprop="url"
      :href="company.url"
      target="_blank"
      rel="nofollow"
    >
      <b-icon-globe variant="primary" />
      {{ company.url }}
    </b-link>

    <b-row class="mb-3" />

    <b-link
      :to="`/company/${company.slug}`"
    >
      <b-icon-info-circle />

      Посмотреть
    </b-link>

    <b-row />

    <b-link
      :to="`/account/companies/edit/${company.slug}`"
    >
      <b-icon-pencil />

      Редактировать
    </b-link>

    <b-row />

    <b-link
      :to="`/account/companies/roles/${company.slug}`"
    >
      <b-icon-person-check />

      Права доступа
    </b-link>

    <b-row class="mb-3" />

    <p>
      <b-link to="/plans#company">
        Приоритетное размещение
      </b-link>

      <template v-if="company.premium">
        до {{ unifyDate(company.premiumDeadline).toLocaleDateString() }}
      </template>
    </p>

    <b-row />

    <b-button
      v-if="company.premium"
      size="sm"
      pill
      variant="success"
      :disabled="renewCompanyPremiumLoading"
      @click="renewCompanyPremium"
    >
      <b-icon-arrow-clockwise
        v-if="renewCompanyPremiumLoading"
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
      :disabled="renewCompanyPremiumLoading"
      @click="renewCompanyPremium"
    >
      <b-icon-arrow-clockwise
        v-if="renewCompanyPremiumLoading"
        animation="spin"
      />
      <b-icon-lightning-fill v-else />

      Запустить
    </b-button>

    <b-button
      variant="link"

      size="sm"
      :disabled="renewCompanyPremiumLoading"
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

    <p
      v-if="!company.verified"
      class="text-danger mt-3"
    >
      Требуется
      <b-link :to="`/account/companies/edit/${company.slug}`">
        отредактировать / подтвердить
      </b-link>
      информацию о компании чтобы получить знак <PatchCheck />
    </p>
  </b-media>
</template>

<script lang="ts">
import Vue from 'vue'
import unifyDate from '~/helpers/unifyDate'
import apiAddr from '~/helpers/const/apiAddr'
import goal from '~/helpers/const/goal'
import yandexMetrika from '~/helpers/const/yandexMetrika'

export default Vue.extend({
  props: {
    company: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      monthAmount: 1,
      renewCompanyPremiumLoading: false,
      errInsufficientFunds: false
    }
  },
  computed: {
    amount () {
      return this.monthAmount * 490
    }
  },
  methods: {
    unifyDate,
    async renewCompanyPremium (): Promise<void> {
      this.errInsufficientFunds = false
      this.renewCompanyPremiumLoading = true
      const raw = await fetch([
        apiAddr,
        '/v1/billing/renewCompanyPremium'
      ].join(''), {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        }),
        body: JSON.stringify({
          companyId: this.company.id,
          monthAmount: this.monthAmount
        })
      })
      this.renewCompanyPremiumLoading = false

      if (!raw.ok) {
        const res = await raw.json()
        if (res?.error === 'insufficient funds') {
          this.errInsufficientFunds = true
          return
        }

        return this.$nuxt.context.error({
          statusCode: 500
        })
      }

      const w = window as any
      if (w.ym) {
        w.ym(yandexMetrika.counter, 'reachGoal', goal.moneySpent, {
          order_price: this.amount,
          currency: 'RUB'
        })
      }
      this.$emit('paymentOk')
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
  }
})
</script>
