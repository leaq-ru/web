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

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
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
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
