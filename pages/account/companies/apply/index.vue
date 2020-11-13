<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Адрес сайта
    </h2>

    <p class="text-muted">
      Укажите адрес вашего сайта. Если его нет в каталоге, он будет добавлен автоматически
    </p>

    <b-input-group class="mt-3">
      <b-form-input
        v-model="url"
        class="col-sm-4"
        placeholder="yourcompany.ru"
      />

      <b-input-group-append>
        <b-button
          variant="primary"
          :disabled="sendApplyLoading"
          @click="sendApply"
        >
          Добавить
        </b-button>
      </b-input-group-append>

      <b-icon-arrow-clockwise
        v-if="sendApplyLoading"
        class="ml-2 mt-2 text-primary"
        font-scale="1.5"
        animation="spin"
      />
    </b-input-group>

    <p
      v-if="errNoContacts"
      class="text-danger mt-3"
    >
      Мы не можем добавить ваш сайт в каталог, потому что на нем не найдены контактные телефон и email. Пожалуйста, добавьте эту информацию на сайт и попробуйте еще раз. Если вы считаете, что ошибка с нашей стороны, обратитесь в <a href="https://vk.me/leaq_ru" target="_blank" rel="nofollow">поддержку</a>
    </p>

    <p
      v-if="errAlreadyHasOwner"
      class="text-danger mt-3"
    >
      У компании уже есть владелец. Если вы считаете, что это ошибка, обратитесь в <a href="https://vk.me/leaq_ru" target="_blank" rel="nofollow">поддержку</a>
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

    const data = {
      url: ''
    }

    if (ctx.query?.url) {
      data.url = String(ctx.query?.url)
    }

    return data
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
      }],
      sendApplyLoading: false,
      errNoContacts: false,
      errAlreadyHasOwner: false
    }
  },
  methods: {
    async sendApply () {
      let res
      try {
        this.errNoContacts = false
        this.errAlreadyHasOwner = false

        this.sendApplyLoading = true
        const raw = await fetch([
          process.env.API_HOST,
          '/v1/role/applyCompanyOwner'
        ].join(''), {
          method: 'POST',
          body: JSON.stringify({
            companyUrl: this.url
          }),
          headers: new Headers({
            Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
          })
        })
        res = await raw.json()

        if (!raw.ok) {
          throw new Error('not ok')
        }

        this.$nuxt.context.redirect('/account/companies/apply/verify', {
          url: this.url,
          metaContent: res.metaContent,
          metaName: res.metaName
        })
      } catch {
        if (res?.error?.includes('company not found')) {
          this.errNoContacts = true
          return
        }

        if (res?.error?.includes('company already has owner')) {
          this.errAlreadyHasOwner = true
          return
        }

        this.$nuxt.context.error({
          statusCode: 500
        })
      } finally {
        this.sendApplyLoading = false
      }
    }
  },
  head () {
    return {
      title: makeTitle('Добавить компанию')
    }
  }
})
</script>
