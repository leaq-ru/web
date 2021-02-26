<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb
      :ads="true"
      :items="breadcrumb"
    />

    <h1>
      {{ category.header }} в {{ city.header }}
    </h1>

    <p>
      Список организаций {{ category.description }} {{ city.description }}
    </p>

    <b-button
      pill
      variant="primary"
      :to="downloadBtnLink"
    >
      <b-icon-cloud-download />
      Скачать базу компаний
    </b-button>

    <h3 class="pt-3 pb-3">
      Всего
      <template v-if="company.items && company.items.length >= 20">
        более
      </template>
      <span class="text-muted">
        {{ (company.items && company.items.length) || 0 }}
      </span>
      компаний
    </h3>

    <CardDeck :items="company.items" />

    <client-only v-if="company.items && company.items.length >= 20 && !scrollDone">
      <infinite-loading
        spinner="spiral"
        :distance="2000"
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
import makeTitle from '~/helpers/makeTitle'

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
      if (rawCity) {
        unmarshal[0] = rawCity.json()
      }
      if (rawCategory) {
        unmarshal[1] = rawCategory.json()
      }

      const [city, category] = await Promise.all(unmarshal)

      const data = {
        breadcrumb: [{
          id: 1,
          text: '🏠',
          to: {
            path: '/'
          }
        }, {
          id: 2,
          text: 'Все города',
          to: {
            path: '/all/all'
          }
        }, {
          id: 3,
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
        title: '',
        description: '',
        downloadBtnLink: `/${city?.slug || 'all'}/${category?.slug || 'all'}/download`
      }

      if (city) {
        data.city.id = city.id
        data.city.header = cityIn(city.title)
        data.city.description = `в городе ${city.title}`

        data.breadcrumb[1].text = city.title
      }
      if (category) {
        data.category.id = category.id
        data.category.header = category.title
        data.category.description = `в категории «${category.title}»`

        data.breadcrumb[2].text = category.title
      }

      const cityToElems = ['']
      cityToElems.push(city?.slug || 'all')
      cityToElems.push('all')
      data.breadcrumb[1].to.path = cityToElems.join('/')

      const categoryToElems = ['']
      categoryToElems.push(city?.slug || 'all')
      categoryToElems.push(category?.slug || 'all')
      data.breadcrumb[2].to.path = categoryToElems.join('/')

      data.title = makeTitle(`${data.category.header} в ${data.city.header}`)
      data.description = `Список всех сайтов компаний в ${data.city.header} из категории ${data.category.header} с возможностью уточнения поиска и скачивания базы email и телефонов`

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
    skip (): string | undefined {
      return this.company?.items?.length
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
      if (this.skip) {
        query['opts.skip'] = this.skip
      }

      const res = await getCompanies({
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
      title: this.title,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.description
      }]
    }
  }
})
</script>
