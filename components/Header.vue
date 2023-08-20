<template>
  <b-navbar
    toggleable="lg"
    type="light"
    variant="light"
    sticky
  >
    <ScrollToTop />

    <b-navbar-brand :to="'/'">
      LEAQ
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav>
        <b-nav-item-dropdown text="Базы" right>
          <b-dropdown-item
            :active="isPath('/')"
            to="/"
          >
            Сайты
          </b-dropdown-item>
          <b-dropdown-item
            :active="isPath('/orgs')"
            to="/orgs"
          >
            Юрлица и ИП
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          :active="isPath('/about')"
          to="/about"
        >
          О сервисе
        </b-nav-item>
        <b-nav-item
          :active="isPath('/plans')"
          to="/plans"
        >
          Тарифы
        </b-nav-item>
        <b-nav-item
          :active="isPath('/account/companies/apply')"
          to="/account/companies/apply"
        >
          Добавить компанию
        </b-nav-item>
        <b-nav-item
          target="_blank"
          href="https://api.leaq.ru/docs/"
        >
          API
        </b-nav-item>
        <b-nav-item
          :class="classPathStartsWithOrgs"
          :active="isPath('/cities')"
          to="/cities"
        >
          Города
        </b-nav-item>
        <b-nav-item
          :class="classPathStartsWithOrgs"
          :active="isPath('/categories')"
          to="/categories"
        >
          Категории
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown v-if="$store.state.user.self.id">
          <template slot="button-content">
            <b-avatar
              size="21px"
              :src="$store.state.user.self.photo"
              class="mr-1"
            />

            {{ $store.state.user.self.firstName }}
          </template>

          <b-dropdown-item
            :active="isPath('/account/profile')"
            to="/account/profile"
          >
            Профиль
          </b-dropdown-item>

          <b-dropdown-item
            :active="isPath('/account/companies')"
            to="/account/companies"
          >
            Компании
          </b-dropdown-item>

          <b-dropdown-item
            :active="isPath('/account/exports')"
            to="/account/exports"
          >
            Выгрузки
          </b-dropdown-item>

          <b-dropdown-item
            :active="isPath('/account/billing')"
            to="/account/billing"
          >
            Платежи
          </b-dropdown-item>

          <b-dropdown-divider />

          <b-dropdown-item @click="logout">
            Выйти
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          v-else
          :active="isPath('/login')"
          @click="login"
        >
          Войти
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue'
import makeLoginUrl from '~/helpers/makeLoginUrl'

export default Vue.extend({
  computed: {
    classPathStartsWithOrgs (): string {
      return this.$route.path.startsWith('/orgs') ? 'd-none' : ''
    }
  },
  methods: {
    isPath (p: string): boolean {
      return this.$route.path === p
    },
    async logout () {
      if (this.$route.path.startsWith('/account')) {
        await this.$router.push('/')
      }

      this.$store.commit('user/logout')
    },
    async login () {
      await this.$router.push(makeLoginUrl(this.$nuxt.$route))
    }
  }
})
</script>
