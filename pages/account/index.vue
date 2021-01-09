<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Аккаунт
    </h2>

    <b-link to="/account/profile">
      <b-icon-person-circle />

      Профиль
    </b-link>

    <b-row />

    <b-link to="/account/companies">
      <b-icon-window />

      Компании
    </b-link>

    <b-row />

    <b-link to="/account/exports">
      <b-icon-file-text />

      Выгрузки
    </b-link>

    <b-row />

    <b-link to="/account/billing">
      <b-icon-receipt />

      Платежи
    </b-link>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import makeTitle from '~/helpers/makeTitle'
import makeLoginUrl from '~/helpers/makeLoginUrl'

export default Vue.extend({
  asyncData (ctx: Context): void {
    if (!ctx.store.state?.user?.self?.token) {
      ctx.redirect(makeLoginUrl(ctx.route))
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
      }]
    }
  },
  head () {
    return {
      title: makeTitle('Аккаунт')
    }
  }
})
</script>
