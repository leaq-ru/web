<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h1>
      Все сайты на {{ technologyName }} {{ categoryName }}
    </h1>

    <p>
      Список организаций с технологией на сайте «{{ technologyName }}», которая относится к категории «{{ rawCategoryName }}». Это подборка, изменить условия поиска и скачать список email и телефонов можно на
      <b-link to="/">
        главной странице
      </b-link>
    </p>

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
import getCompanies from '~/helpers/company/getCompanies'
import apiAddr from '~/helpers/const/apiAddr'

const makeCategoryName = (resTech: any): string => {
  if (resTech.categories && resTech.categories[0]?.name) {
    return ` (${resTech.categories[0].name})`
  }
  return ''
}

const makeRawCategoryName = (resTech: any): string => {
  if (resTech.categories && resTech.categories[0]?.name) {
    return resTech.categories[0].name
  }
  return ''
}

const makeTechnologyName = (resTech: any): string => {
  let name = resTech.name
  if (resTech.version) {
    name += ` ${resTech.version}`
  }
  return name
}

const makeTitle = (resTech: any):string => {
  if (!resTech) {
    return ''
  }

  let name = makeTechnologyName(resTech)
  name += makeCategoryName(resTech)

  return `Все сайты на ${name} / Каталог компаний LEAQ`
}

const makeDescription = (resTech: any):string => {
  if (!resTech) {
    return ''
  }

  let name = makeTechnologyName(resTech)
  name += makeCategoryName(resTech)

  return `Список всех сайтов на ${name} с возможностью уточнения поиска по городам и категориям и скачивания базы email и телефонов`
}

export default Vue.extend({
  async asyncData ({ error, params }): Promise<any> {
    try {
      if (!params.technologySlug) {
        return error({
          statusCode: 404
        })
      }

      const rawTech = await fetch([
        apiAddr,
        '/v1/technology/getBySlug?',
        new URLSearchParams({
          slug: params.technologySlug
        }).toString()
      ].join(''))

      if (!rawTech.ok) {
        return error({
          statusCode: 404
        })
      }

      const resTech = await rawTech.json()
      if (!resTech?.technology?.id) {
        return error({
          statusCode: 404
        })
      }
      const tech = resTech.technology
      const technologyName = makeTechnologyName(tech)

      const data = {
        breadcrumb: [{
          id: 1,
          text: '🏠',
          to: {
            path: '/'
          }
        }, {
          id: 2,
          text: 'Технологии',
          to: {},
          active: false
        }, {
          id: 3,
          text: tech.categories[0].name,
          to: {},
          active: false
        }, {
          id: 4,
          text: technologyName,
          to: {}
        }],
        company: {
          items: []
        },
        title: makeTitle(tech),
        description: makeDescription(tech),
        technologyId: tech.id,
        technologyName,
        categoryName: makeCategoryName(tech),
        rawCategoryName: makeRawCategoryName(tech)
      }

      const query: any = {
        'opts.limit': '20',
        technologyIds: [tech.id]
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
        technologyIds: [this.technologyId],
        'opts.limit': '20'
      }

      if (this.skip) {
        query['opts.skip'] = this.skip
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
