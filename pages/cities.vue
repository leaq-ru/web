<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Всего
      <span class="text-muted">
        {{ cities.length }}
      </span>
      городов
    </h2>

    <b-form-input
      v-model="filter"
      class="mb-4"
      type="text"
      placeholder="Фильтр"
    />

    <template
      v-for="c in cities"
    >
      <b-link
        v-if="!c.hidden"
        :key="c.id"
        class="mr-4"
        :to="`${c.slug}/all`"
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
import makeTitle from '~/helpers/makeTitle'

export default Vue.extend({
  async asyncData () {
    try {
      const raw = await fetch([
        apiAddr,
        '/v1/city/getAll'
      ].join(''))

      const result = await raw.json()
      result.cities.sort((a, b) => a.title.localeCompare(b.title))

      return result
    } catch {
      return {
        cities: []
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
        text: 'Города',
        to: {
          path: '/cities'
        }
      }],
      filter: ''
    }
  },
  watch: {
    filter (val) {
      if (!this.cities.length) {
        return
      }
      const lowVal = val.toLowerCase()

      this.cities.forEach((city) => {
        city.hidden = !city.title.toLowerCase().includes(lowVal)
      })
    }
  },
  head () {
    return {
      title: makeTitle('Все города'),
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'Список городов доступных для поиска'
      }]
    }
  }
})
</script>
