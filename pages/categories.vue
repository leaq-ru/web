<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2 class="mb-4">
      Всего
      <span class="text-muted">
        {{ categories.length }}
      </span>
      категорий
    </h2>

    <b-form-input
      v-model="filter"
      class="mb-4"
      type="text"
      placeholder="Фильтр"
    />

    <template
      v-for="c in categories"
    >
      <b-link
        v-if="!c.hidden"
        :key="c.id"
        class="mr-4"
        :to="`all/${c.slug}`"
      >
        {{ c.title }}
      </b-link>
    </template>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import apiAddr from '~/helpers/const/apiAddr'

export default Vue.extend({
  async asyncData () {
    try {
      const raw = await fetch([
        apiAddr,
        '/v1/category/getAll'
      ].join(''))

      const result = await raw.json()
      result.categories.sort((a, b) => a.title.localeCompare(b.title))

      return result
    } catch {
      return {
        categories: []
      }
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
        text: 'Категории',
        to: {
          path: '/categories'
        }
      }],
      filter: ''
    }
  },
  watch: {
    filter (val) {
      if (!this.categories.length) {
        return
      }
      const lowVal = val.toLowerCase()

      this.categories.forEach((category) => {
        category.hidden = !category.title.toLowerCase().includes(lowVal)
      })
    }
  },
  head () {
    return {
      title: 'Все категории / Каталог компаний LEAQ'
    }
  }
})
</script>
