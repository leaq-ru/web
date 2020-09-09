<template>
  <b-container fluid="xl">
    <Header />
    <b-breadcrumb :items="breadcrumb" />

    <h1>
      {{ category.header }} в {{ city.header }}
    </h1>

    <p>
      Список организаций {{ category.description }} {{ city.description }}. Это подборка, изменить условия поиска и скачать список email и телефонов можно на
      <b-link to="/">
        главной странице
      </b-link>
    </p>

    <h3 class="pt-3 pb-3">
      Всего
      <template v-if="!(company.items.length < 20)">
        более
      </template>
      <span class="text-muted">
        {{ company.items.length || 0 }}
      </span>
      компаний
    </h3>

    <template v-for="(_, i) in company.items">
      <template v-if="i % 2 === 0">
        <b-card-group
          :key="company.items[i].id"
          class="mb-4"
          deck
        >
          <Card :company="company.items[i]" />

          <Card
            v-if="company.items[i+1]"
            :company="company.items[i+1]"
          />
        </b-card-group>
      </template>
    </template>

    <client-only v-if="!(company.items.length < 20) && !scrollDone">
      <infinite-loading
        spinner="spiral"
        distance="2000"
        @infinite="collectionInfiniteScroll"
      />
    </client-only>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { cityIn } from 'lvovich'
import getCompanies from '~/helpers/company/getCompanies'
import apiAddr from '~/helpers/const/apiAddr'

export default Vue.extend({
  async asyncData ({ error, params }): Promise<any> {
    try {
      if (!params.citySlug && !params.categorySlug) {
        return error({
          statusCode: 404
        })
      }

      const promises: Array<Promise<Response | null>> = [
        null,
        null
      ]

      if (params.citySlug && params.citySlug !== 'all') {
        promises[0] = fetch([
          apiAddr,
          '/v1/city/getBySlug?',
          new URLSearchParams({
            slug: params.citySlug
          }).toString()
        ].join(''))
      }
      if (params.categorySlug && params.categorySlug !== 'all') {
        promises[1] = fetch([
          apiAddr,
          '/v1/category/getBySlug?',
          new URLSearchParams({
            slug: params.categorySlug
          }).toString()
        ].join(''))
      }

      const [rawCity, rawCategory] = await Promise.all(promises)
      const citySuccess = params.citySlug === 'all' || rawCity.ok
      const categorySuccess = params.categorySlug === 'all' || rawCategory.ok
      if (!citySuccess || !categorySuccess) {
        return error({
          statusCode: 404
        })
      }

      const unmarshal: Array<any> = [
        null,
        null
      ]
      if (rawCity?.ok) {
        unmarshal[0] = rawCity.json()
      }
      if (rawCategory?.ok) {
        unmarshal[1] = rawCategory.json()
      }

      const [city, category] = await Promise.all(unmarshal)

      const data = {
        breadcrumb: [{
          text: '🏠',
          to: {
            path: '/'
          }
        }, {
          text: 'Все города',
          to: {
            path: '/all/all'
          }
        }, {
          text: 'Все категории',
          to: {
            path: '/all/all'
          }
        }],
        city: {
          id: '',
          header: 'России',
          description: 'во всех городах России'
        },
        category: {
          id: '',
          header: 'Все компании',
          description: 'во всех категориях'
        },
        company: {
          items: []
        },
        title: ''
      }

      if (city) {
        data.city.id = city.id
        data.city.header = cityIn(city.title)
        data.city.description = `в городе ${city.title}`

        data.breadcrumb[1].text = city.title

        const toElems = data.breadcrumb[1].to.path.split('/')
        toElems[1] = city.slug

        data.breadcrumb[1].to.path = toElems.join('/')
      }
      if (category) {
        data.category.id = category.id
        data.category.header = category.title
        data.category.description = `в категории «${category.title}»`

        data.breadcrumb[2].text = category.title

        const toElems = data.breadcrumb[1].to.path.split('/')
        toElems[1] = city?.slug || 'all'
        toElems[2] = category.slug

        data.breadcrumb[2].to.path = toElems.join('/')
      }
      data.title = `${data.category.header} в ${data.city.header} / Каталог компаний LEAQ`

      const query: any = {
        'opts.limit': '20'
      }
      if (data.city.id) {
        query.cityIds = [data.city.id]
      }
      if (data.category.id) {
        query.categoryIds = [data.category.id]
      }

      const res = await getCompanies({
        querystring: new URLSearchParams(query).toString()
      })
      data.company.items = res.companies

      return data
    } catch {
      return error({
        statusCode: 500
      })
    }
  },
  data () {
    return {
      scrollDone: false
    }
  },
  computed: {
    fromId (): string | undefined {
      if (this.company?.items?.length) {
        return this.company.items[this.company.items.length - 1].id
      }
      return undefined
    }
  },
  methods: {
    async collectionInfiniteScroll ($state) {
      const query: any = {
        'opts.limit': '20'
      }

      if (this.city?.id) {
        query.cityIds = this.city.id
      }
      if (this.category?.id) {
        query.categoryIds = this.category.id
      }
      if (this.fromId) {
        query['opts.fromId'] = this.fromId
      }

      const res = await getCompanies({
        addr: process.env.API_HOST,
        querystring: new URLSearchParams(query).toString()
      })

      if (res?.companies?.length) {
        this.company.items.push(...res.companies)
      } else {
        this.scrollDone = true
      }
      $state.loaded()
    }
  },
  head () {
    return {
      title: this.title
    }
  }
})
</script>
