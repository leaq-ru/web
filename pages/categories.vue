<template>
  <b-container fluid="xl">
    <Header />
    <b-breadcrumb :items="breadcrumb" />

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

export default Vue.extend({
  async asyncData () {
    try {
      const raw = await fetch([
        process.env.API_HOST,
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
        text: '🏠',
        to: {
          name: 'index'
        }
      }, {
        text: 'Категории',
        to: {
          name: 'categories'
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
  }
})
</script>
