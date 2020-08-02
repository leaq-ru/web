<template>
  <b-navbar toggleable="lg" type="light" variant="light" :sticky="true">
    <b-navbar-brand href="#">
      LEAQ
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">
          Главная
        </b-nav-item>
        <b-nav-item href="#">
          Города
        </b-nav-item>
        <b-nav-item href="#">
          Категории
        </b-nav-item>
        <b-nav-item href="#">
          API
        </b-nav-item>
        <b-nav-item href="#">
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
