<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <div class="text-center">
      <h1>
        Войти в LEAQ
      </h1>

      <p class="text-muted">
        Управляйте аккаунтом, компаниями, выгрузками csv
      </p>

      <b-button
        class="col-xl-4 col-md-4 mb-3"
        variant="primary"
        pill
        @click="vkLogin"
      >
        <fa
          :icon="['fab', 'vk']"
        />
        Продолжить в VK
      </b-button>

      <b-row />

      <b-button
        class="col-xl-4 col-md-4"
        variant="outline-primary"
        pill
        @click="yandexLogin"
      >
        <fa
          :icon="['fab', 'yandex']"
          class="mr-1"
        />
        Продолжить в Yandex, Google, Facebook
      </b-button>
    </div>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import makeTitle from '~/helpers/makeTitle'
import makeAuthRedirect, { authKind } from '~/helpers/makeAuthRedirect'

export default Vue.extend({
  asyncData (ctx: Context): object {
    let to = '/'
    const rawTo = ctx.route?.query?.to
    if (rawTo && typeof rawTo === 'string') {
      to = rawTo
    }

    return {
      to
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
        text: 'Вход',
        to: {
          path: '/login'
        }
      }]
    }
  },
  methods: {
    vkLogin () {
      window.location.assign(makeAuthRedirect(this.to, authKind.vk))
    },
    yandexLogin () {
      window.location.assign(makeAuthRedirect(this.to, authKind.yandex))
    }
  },
  head () {
    return {
      title: makeTitle('Вход'),
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'Войти или зарегистрироваться в LEAQ'
      }]
    }
  }
})
</script>
