<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <b-jumbotron header="База юрлиц и ИП России">
      <p>
        Все данные доступны по
        <b-link href="http://api.leaq.ru/docs/" target="_blank">
          API
        </b-link>
      </p>
    </b-jumbotron>

    <OrgCardDeck :items="org.items" />

    <client-only v-if="!$fetchState.pending && org.items.length >= 20 && !scrollDone">
      <infinite-loading
        spinner="spiral"
        :distance="2000"
        @infinite="infiniteScroll"
      />
    </client-only>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import apiAddr from '~/helpers/const/apiAddr'

const getOrgs = async (skip: string): Promise<any> => {
  const raw = await fetch([
    apiAddr,
    '/v1/org/get?',
    new URLSearchParams({
      'opts.limit': '20',
      'opts.skip': skip
    }).toString()
  ].join(''))
  const res = await raw.json()
  return res || {}
}

export default Vue.extend({
  async fetch (): Promise<void> {
    const res = await getOrgs('0')
    this.org.items = res.orgs || []
  },
  data (): any {
    return {
      breadcrumb: [{
        id: 1,
        text: '🏠',
        to: {
          path: '/orgs'
        }
      }],
      org: {
        items: []
      },
      scrollDone: false
    }
  },
  computed: {
    skip (): string {
      return this.org?.items?.length || 0
    }
  },
  methods: {
    async infiniteScroll ($state) {
      const raw = await fetch([
        apiAddr,
        '/v1/org/get?',
        new URLSearchParams({
          'opts.limit': '20',
          'opts.skip': this.skip.toString()
        }).toString()
      ].join(''))
      const res = await raw.json()

      if (res?.orgs?.length) {
        this.org.items.push(...res.orgs)
      } else {
        this.scrollDone = true
      }
      $state.loaded()
    }
  },
  head () {
    return {
      title: 'База компаний России LEAQ — более 1.8 млн организаций, 1097 категорий и 579 городов',
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'База компаний из разных городов от Москвы до Владивостока, из категорий от «Создания сайтов» до «Черной металлургии». Доступно скачивание CSV базы, email и телефонов компаний с учетом фильтров поиска. Попробуйте бесплатно или пользуйтесь без ограничений за 990 руб/мес'
      }]
    }
  }
})
</script>
