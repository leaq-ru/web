<template>
  <b-navbar
    toggleable="lg"
    type="light"
    variant="light"
    sticky
  >
    <ScrollToTop />

    <b-navbar-brand to="/">
      LEAQ
    </b-navbar-brand>

    <b-button
      to="/"
      pill
      variant="outline-primary"
    >
      <b-icon-search />
      Поиск
    </b-button>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav>
        <b-nav-item
          to="/about"
        >
          О сервисе
        </b-nav-item>
        <b-nav-item
          to="/plans"
        >
          Тарифы
        </b-nav-item>
        <b-nav-item
          to="/cities"
        >
          Города
        </b-nav-item>
        <b-nav-item
          to="/categories"
        >
          Категории
        </b-nav-item>
        <b-nav-item
          target="_blank"
          href="https://api.leaq.ru/docs/"
        >
          API
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/account/companies/apply">
          Добавить компанию
        </b-nav-item>

        <b-nav-item-dropdown v-if="$store.state.user.self.id">
          <template slot="button-content">
            <b-avatar
              size="21px"
              :src="$store.state.user.self.photo"
              class="mr-1"
            />

            {{ $store.state.user.self.firstName }}
          </template>

          <b-dropdown-item to="/account/profile">
            Профиль
          </b-dropdown-item>

          <b-dropdown-item to="/account/companies">
            Компании
          </b-dropdown-item>

          <b-dropdown-item to="/account/exports">
            Выгрузки
          </b-dropdown-item>

          <b-dropdown-item to="/account/billing">
            Платежи
          </b-dropdown-item>

          <b-dropdown-divider />

          <b-dropdown-item @click="logout">
            Выйти
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          v-else
          :href="methodMakeAuthUrl()"
        >
          <fa :icon="['fab', 'vk']" />

          Войти
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue'
import makeAuthUrl from '~/helpers/makeAuthUrl'

export default Vue.extend({
  methods: {
    logout () {
      this.$store.commit('user/logout')
    },
    methodMakeAuthUrl () {
      return makeAuthUrl(this.$nuxt.$route)
    }
  }
})
</script>
