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
          href="https://api.leaq.ru/docs"
        >
          API
        </b-nav-item>
        <b-nav-item
          target="_blank"
          href="https://vk.me/leaq_ru"
        >
          Связаться с нами
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

          <b-dropdown-item to="/account/companies">
            Мои компании
          </b-dropdown-item>

          <b-dropdown-divider />

          <b-dropdown-item @click="logout">
            Выйти
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          v-else
          :href="`https://oauth.vk.com/authorize?client_id=${vkAppId}&display=page&scope=email&redirect_uri=${host}/vk-auth&response_type=code&v=5.124&state=${authRedirectPath}`"
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

export default Vue.extend({
  data () {
    return {
      vkAppId: process.env.VK_APPID,
      host: process.env.HOST,
      authRedirectPath: this.$nuxt.$route.path
    }
  },
  methods: {
    logout () {
      this.$store.commit('user/logout')
    }
  }
})
</script>
