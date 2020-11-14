<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <b-row>
      <b-col md="4">
        <b-img-lazy
          thumbnail
          :src="$store.state.user.self.photoRec"
        />
      </b-col>

      <b-col md="8">
        <h3 class="mb-3">
          {{ $store.state.user.self.firstName }}
          {{ $store.state.user.self.lastName }}
        </h3>

        <span class="text-muted">
          ID пользователя
        </span>
        <b-row />
        {{ $store.state.user.self.id }}

        <b-row class="mt-3" />

        <span class="text-muted">
          Токен для доступа по

          <a href="https://api.leaq.ru/docs" target="_blank">
            API
          </a>

          (не передавайте никому)
        </span>
        <b-row />
        <template v-if="showToken">
          {{ $store.state.user.self.token }}
        </template>
        <b-link
          v-else
          @click="showToken = true"
        >
          {{ `${$store.state.user.self.token.slice(0, 7)}-***` }}
        </b-link>
      </b-col>
    </b-row>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import makeTitle from '~/helpers/makeTitle'
import makeAuthUrl from '~/helpers/makeAuthUrl'

export default Vue.extend({
  asyncData (ctx: Context): void {
    if (!ctx.store.state?.user?.self?.token) {
      ctx.redirect(makeAuthUrl(ctx.route))
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
        text: 'Мой профиль',
        to: {
          path: '/account/profile'
        }
      }],
      showToken: false
    }
  },
  head () {
    return {
      title: makeTitle('Мой профиль')
    }
  }
})
</script>
