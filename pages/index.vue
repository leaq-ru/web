<template>
  <b-container fluid="lg">
    <Header />
    <b-breadcrumb :items="breadcrumb" />
    <b-jumbotron header="Каталог компаний России" lead="Более 4,000,000 фирм доступно для поиска">
      <p>
        Город, сфера деятельности, телефон, email, и многое другое в карточках компаний. Все данные доступны по
        <a href="https://api.leaq.ru/api/docs" target="_blank">
          API
        </a>
        для интеграции с вашим бизнесом
      </p>
    </b-jumbotron>
    <b-card bg-variant="default">
      <b-form-group label="Город">
        <vue-bootstrap-typeahead
          v-model="city.search"
          :data="city.list"
          :serializer="s => s.title"
          placeholder="Все"
          @hit="city.selected = $event"
        />
      </b-form-group>

      <b-form-group label="Категория">
        <b-form-input placeholder="Все" />
      </b-form-group>

      <b-form-group>
        <b-form-checkbox>
          Телефон указан
        </b-form-checkbox>
        <b-form-checkbox>
          Email указан
        </b-form-checkbox>
      </b-form-group>
    </b-card>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore - no types for this module
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import _ from 'underscore'

export default Vue.extend({
  components: {
    VueBootstrapTypeahead
  },
  data () {
    return {
      breadcrumb: [{
        text: 'Главная',
        to: {
          name: 'index'
        }
      }],
      city: {
        list: [],
        search: '',
        selected: null
      },
      category: {
        list: [],
        search: '',
        selected: null
      }
    }
  },
  watch: {
    'city.search': _.debounce(function (title: string) {
      // @ts-ignore
      this.getCitiesHints(title)
    }, 500),
    'category.search': _.debounce(function (title: string) {
      // @ts-ignore
      this.getCategoriesHints(title)
    }, 500)
  },
  methods: {
    async getCitiesHints (title: string) {
      const rawCities = await fetch([
        process.env.API_HOST,
        '/v1/city/getHints?',
        new URLSearchParams({
          title,
          limit: '10'
        }).toString()
      ].join(''))
      const suggs = await rawCities.json()
      this.city.list = suggs.cities || []
    },
    async getCategoriesHints (title: string) {
      const rawCategories = await fetch([
        process.env.API_HOST,
        '/v1/category/getHints?',
        new URLSearchParams({
          title,
          limit: '10'
        }).toString()
      ].join(''))
      const suggs = await rawCategories.json()
      this.category.list = suggs.categories || []
    }
  }
})
</script>
