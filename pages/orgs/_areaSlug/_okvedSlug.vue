<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h1>
      {{ okved.header }} ({{ area.header }})
    </h1>

    <p>
      Список юрлиц и ИП
    </p>

    <h3 class="pt-3 pb-3">
      Всего
      <template v-if="org.items && org.items.length >= 20">
        более
      </template>
      <span class="text-muted">
        {{ (org.items && org.items.length) || 0 }}
      </span>
      компаний
    </h3>

    <OrgCardDeck :items="org.items" />

    <client-only v-if="org.items && org.items.length >= 20 && !scrollDone">
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
import apiAddr from '~/helpers/const/apiAddr'
import makeTitle from '~/helpers/makeTitle'

const getOrgs = async (areaId: string, okvedId: string, skip: string): Promise<any> => {
  let raw
  if (areaId && okvedId) {
    raw = await fetch([
      apiAddr,
      '/v1/org/getRelated?',
      new URLSearchParams({
        'opts.limit': '20',
        'opts.skip': skip,
        areaId,
        okvedId
      }).toString()
    ].join(''))
  } else if (areaId) {
    raw = await fetch([
      apiAddr,
      '/v1/org/getByAreaId?',
      new URLSearchParams({
        'opts.limit': '20',
        'opts.skip': skip,
        areaId
      }).toString()
    ].join(''))
  } else if (okvedId) {
    raw = await fetch([
      apiAddr,
      '/v1/org/getByOkvedId?',
      new URLSearchParams({
        'opts.limit': '20',
        'opts.skip': skip,
        okvedId
      }).toString()
    ].join(''))
  } else {
    raw = await fetch([
      apiAddr,
      '/v1/org/get?',
      new URLSearchParams({
        'opts.limit': '20',
        'opts.skip': skip
      }).toString()
    ].join(''))
  }
  const res = await raw.json()
  return res || {}
}

export default Vue.extend({
  async asyncData ({ error, params }): Promise<any> {
    try {
      if (!params.areaSlug && !params.okvedSlug) {
        return error({
          statusCode: 404
        })
      }

      const promises: Array<Promise<Response | null>> = [
        null,
        null
      ]

      if (params.areaSlug && params.areaSlug !== 'all') {
        promises[0] = fetch([
          apiAddr,
          '/v1/org/getAreaBySlug?',
          new URLSearchParams({
            slug: params.areaSlug
          }).toString()
        ].join(''))
      }
      if (params.okvedSlug && params.okvedSlug !== 'all') {
        promises[1] = fetch([
          apiAddr,
          '/v1/org/getOkvedBySlug?',
          new URLSearchParams({
            slug: params.okvedSlug
          }).toString()
        ].join(''))
      }

      const [rawArea, rawOkved] = await Promise.all(promises)
      const areaSuccess = params.areaSlug === 'all' || rawArea.ok
      const okvedSuccess = params.okvedSlug === 'all' || rawOkved.ok
      if (!areaSuccess || !okvedSuccess) {
        return error({
          statusCode: 404
        })
      }

      const unmarshal: Array<any> = [
        null,
        null
      ]
      if (rawArea) {
        unmarshal[0] = rawArea.json()
      }
      if (rawOkved) {
        unmarshal[1] = rawOkved.json()
      }

      const [nullArea, nullOkved] = await Promise.all(unmarshal)
      const area = nullArea?.area
      const okved = nullOkved?.okved

      const data = {
        breadcrumb: [{
          id: 1,
          text: '🏠',
          to: {
            path: '/orgs'
          }
        }, {
          id: 2,
          text: 'Все города',
          to: {
            path: '/orgs/all/all'
          }
        }, {
          id: 3,
          text: 'Все ОКВЭД',
          to: {
            path: '/orgs/all/all'
          }
        }],
        area: {
          id: '',
          header: 'Россия',
          description: 'во всех городах России'
        },
        okved: {
          id: '',
          header: 'Все юрлица и ИП',
          description: 'во всех категориях'
        },
        org: {
          items: []
        },
        title: '',
        description: ''
      }

      if (area) {
        data.area.id = area.id
        data.area.header = area.name

        data.breadcrumb[1].text = area.name
      }
      if (okved) {
        data.okved.id = okved.id
        data.okved.header = okved.codeWithName

        data.breadcrumb[2].text = okved.name
      }

      const areaToElems = ['/orgs']
      areaToElems.push(area?.slug || 'all')
      areaToElems.push('all')
      data.breadcrumb[1].to.path = areaToElems.join('/')

      const okvedToElems = ['/orgs']
      okvedToElems.push(area?.slug || 'all')
      okvedToElems.push(okved?.slug || 'all')
      data.breadcrumb[2].to.path = okvedToElems.join('/')

      data.title = makeTitle(`${data.okved.header} (${data.area.header})`)
      data.description = `${data.area.header}: список всех юрлиц и ИП - ${data.okved.header}`

      const res = await getOrgs(data.area.id, data.okved.id, '0')
      data.org.items = res.orgs

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
    skip (): string {
      return this.org?.items?.length || '0'
    }
  },
  methods: {
    async collectionInfiniteScroll ($state) {
      const res = await getOrgs(this.area.id, this.okved.id, this.skip)

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
