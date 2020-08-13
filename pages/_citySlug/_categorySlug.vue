<template>
  <div>
    <b-container fluid="xl">
      <Header />
      <b-breadcrumb :items="breadcrumb" />

      {{ city }}

      {{ category }}

      <Footer />
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

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
          process.env.API_HOST,
          '/v1/city/getBySlug?',
          new URLSearchParams({
            slug: params.citySlug
          }).toString()
        ].join(''))
      }
      if (params.categorySlug && params.categorySlug !== 'all') {
        promises[1] = fetch([
          process.env.API_HOST,
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

      const result = {
        city: {
          id: '',
          title: 'во всех городах России',
          slug: ''
        },
        category: {
          id: '',
          title: 'во всех категорях',
          slug: ''
        },
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
        }]
      }

      if (city) {
        result.city.id = city.id
        result.city.title = `в г.${city.title}`
        result.city.slug = city.slug

        result.breadcrumb[1].text = city.title

        const toElems = result.breadcrumb[1].to.path.split('/')
        toElems[1] = city.slug

        result.breadcrumb[1].to.path = toElems.join('/')
      }
      if (category) {
        result.category.id = category.id
        result.category.title = `в категории ${category.title}`
        result.category.slug = category.slug

        result.breadcrumb[2].text = category.title

        const toElems = result.breadcrumb[1].to.path.split('/')
        toElems[1] = city?.slug || 'all'
        toElems[2] = category.slug

        result.breadcrumb[2].to.path = toElems.join('/')
      }

      return result
    } catch {
      return error({
        statusCode: 500
      })
    }
  }
})
</script>
