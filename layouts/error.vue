<template>
  <b-container fluid="xl">
    <Header />
    <b-breadcrumb :items="breadcrumb" />

    <div class="text-center">
      <h1
        v-if="error.statusCode === 404"
        class="mb-5"
      >
        Страница не найдена
      </h1>
      <h1
        v-else
        class="mb-5"
      >
        Произошла ошибка
      </h1>

      <div>
        <b-icon-emoji-frown
          variant="secondary"
          scale="6"
          class="mb-5"
        />
      </div>

      <div>
        <b-link to="/">
          <b-icon-arrow-left-circle />
          Вернуться на главную
        </b-link>
      </div>

      <Footer />
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { NuxtError } from '~/.nuxt'

export default Vue.extend({
  props: {
    error: {
      type: NuxtError,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      breadcrumb: [{
        text: '🏠',
        to: {
          path: '/'
        }
      }, {
        text: 'Ошибка'
      }]
    }
  }
})
</script>
