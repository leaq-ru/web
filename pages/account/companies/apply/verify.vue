<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Подтверждение прав на {{ url }}
    </h2>

    <p>
      Добавьте в код главной страницы вашего сайта (в раздел head) метатег. Не удаляйте его даже после завершения подтверждения, чтобы не лишиться прав владельца:
    </p>

    <p class="pt-3 pb-3 text-monospace bg-light">
      {{ verificationSnippet }}
    </p>

    <p>
      Зайдите на главную страницу сайта и убедитесь, что метатег появился в HTML-коде страницы. В большинстве браузеров это можно сделать выбрав пункт «Исходный код страницы» в контекстном меню. На некоторых сайтах обновление мета-тегов может занимать несколько минут.
    </p>

    <p>
      Нажмите кнопку «Проверить» после того, как метатег появится
    </p>

    <b-button
      pill
      variant="primary"
      :disabled="sendVerifyLoading"
      @click="sendVerify"
    >
      Проверить
    </b-button>

    <b-icon-arrow-clockwise
      v-if="sendVerifyLoading"
      class="ml-2 text-primary"
      font-scale="1.5"
      animation="spin"
    />

    <p
      v-if="errVerify"
      class="text-danger mt-3"
    >
      Произошла ошибка при подтверждении прав. Если вы разместили метатег верно, и полагаете что ошибка с нашей стороны, обратитесь в <a href="https://vk.me/leaq_ru" target="_blank" rel="nofollow">поддержку</a>
    </p>
    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import makeTitle from '~/helpers/makeTitle'
import makeAuthUrl from '~/helpers/makeAuthUrl'

export default Vue.extend({
  asyncData (ctx: Context): object {
    if (!ctx.store.state?.user?.self?.token) {
      ctx.redirect(makeAuthUrl(ctx.route.path))
      return
    }

    return {
      url: ctx.query.url,
      verificationSnippet: `<meta name="${ctx.query.metaName}" content="${ctx.query.metaContent}" />`
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
        text: 'Адрес сайта',
        to: {
          path: '/account/companies/apply'
        }
      }, {
        id: 5,
        text: 'Подтверждение прав',
        to: {
          path: '/account/companies/apply/verify'
        }
      }],
      sendVerifyLoading: false,
      errVerify: false
    }
  },
  methods: {
    async sendVerify () {
      this.sendVerifyLoading = true
      const raw = await fetch([
        process.env.API_HOST,
        '/v1/role/verifyCompanyOwner'
      ].join(''), {
        method: 'POST',
        body: JSON.stringify({
          companyUrl: this.url
        }),
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        })
      })
      this.sendVerifyLoading = false

      if (!raw.ok) {
        this.errVerify = true
        return
      }

      this.$nuxt.context.redirect({
        path: '/account/companies',
        query: {
          newUrl: this.url
        }
      })
    }
  },
  head () {
    return {
      title: makeTitle('Подтвердить права')
    }
  }
})
</script>
