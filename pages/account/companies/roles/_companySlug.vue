<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Права доступа на {{ companyHost }}
    </h2>

    <p class="text-muted">
      Владелец — может редактировать информацию о компании, продлевать приоритетное размещение (списание средств происходит с личного аккаунта), назначать и снимать Администраторов, передавать права Владельца другому пользователю. У компании может быть только один Владелец
    </p>

    <p class="text-muted">
      Администратор — может редактировать информацию о компании,  продлевать приоритетное размещение (списание средств происходит с личного аккаунта). У компании может быть до 50 Администраторов
    </p>

    <template v-if="meOwner">
      <p class="text-muted">
        Попросите будущего администратора передать ID пользователя с

        <b-link to="/account/profile">
          этой страницы
        </b-link>
      </p>
      <b-input-group class="mt-3">
        <b-form-input
          v-model="newAdminId"
          class="col-sm-4"
          placeholder="ID пользователя"
        />

        <b-input-group-append>
          <b-button
            variant="primary"
            :disabled="addAdminLoading"
            @click="addAdmin"
          >
            Добавить администратора
          </b-button>
        </b-input-group-append>

        <b-icon-arrow-clockwise
          v-if="addAdminLoading"
          class="ml-2 mt-2 text-primary"
          font-scale="1.5"
          animation="spin"
        />
      </b-input-group>
    </template>

    <h3 class="mt-3">
      Менеджеры
    </h3>

    <ManagersList
      :items="managers"
      :company-id="companyId"
      @managerEdit="reloadManagers"
    />

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import makeTitle from '~/helpers/makeTitle'
import apiAddr from '~/helpers/const/apiAddr'
import makeAuthUrl from '~/helpers/makeAuthUrl'
import grant from '~/helpers/role/grant'

export default Vue.extend({
  async asyncData (ctx: Context): Promise<object | void> {
    if (!ctx.store.state?.user?.self?.token) {
      ctx.redirect(makeAuthUrl(ctx.route))
      return
    }

    if (!ctx.params.companySlug) {
      return ctx.error({
        statusCode: 404
      })
    }

    const queryGetBySlug = new URLSearchParams()
    queryGetBySlug.append('slug', ctx.params.companySlug)

    const rawComp = await fetch([
      apiAddr,
      '/v2/company/getBySlug?',
      queryGetBySlug.toString()
    ].join(''))

    if (!rawComp.ok) {
      return ctx.error({
        statusCode: 404
      })
    }

    const resComp = await rawComp.json()

    const query = new URLSearchParams()
    query.append('opts.limit', '100')
    query.append('companyId', resComp.fullCompany.id)

    const rawManagers = await fetch([
      apiAddr,
      '/v1/role/getManagers?',
      query.toString()
    ].join(''), {
      headers: new Headers({
        Authorization: `Bearer ${ctx.store.state.user.self.token}`
      })
    })

    if (!rawManagers.ok) {
      return ctx.error({
        statusCode: 500
      })
    }

    const resManagers = await rawManagers.json()
    const managers = resManagers.managers || []

    return {
      companyId: resComp.fullCompany.id,
      companyHost: resComp.fullCompany.url.slice(7),
      managers
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
        text: this.$route.params.companySlug,
        to: {},
        active: false
      }, {
        id: 5,
        text: 'Права доступа',
        to: {
          path: `/account/companies/roles/${this.$route.params.companySlug}`
        }
      }],
      addAdminLoading: false,
      newAdminId: ''
    }
  },
  computed: {
    meOwner () {
      let myGrant = ''
      for (const man of this.managers) {
        if (man.id === this.$store.state.user.self.id) {
          myGrant = man.grant
          break
        }
      }

      return myGrant === grant.owner
    },
  },
  methods: {
    async reloadManagers () {
      const q = new URLSearchParams()
      q.append('opts.limit', '100')
      q.append('companyId', this.companyId)
      const rawManagers = await fetch([
        apiAddr,
        '/v1/role/getManagers?',
        q.toString()
      ].join(''), {
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state.user.self.token}`
        })
      })

      if (!rawManagers.ok) {
        return this.$nuxt.error({
          statusCode: 500
        })
      }
      const { managers } = await rawManagers.json()
      managers.sort(a => a.grant === grant.owner ? -1 : 1)

      this.managers = managers
    },
    async addAdmin () {
      this.addAdminLoading = true
      const raw = await fetch([
        apiAddr,
        '/v1/role/addCompanyAdmin'
      ].join(''), {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        }),
        body: JSON.stringify({
          companyId: this.companyId,
          userId: this.newAdminId
        })
      })
      this.addAdminLoading = false

      if (!raw.ok) {
        return this.$nuxt.error({
          statusCode: 500
        })
      }

      await this.reloadManagers()
    }
  },
  head () {
    return {
      title: makeTitle('Права доступа')
    }
  }
})
</script>
