<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb
      :ads="true"
      :items="breadcrumb"
    />

    <h1>
      {{ item.header }}
    </h1>

    <p>
      {{ item.description }}
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

const getOrgs = async (managerId: string, skip: string): Promise<any> => {
  const raw = await fetch([
    apiAddr,
    '/v1/org/getByManagerId?',
    new URLSearchParams({
      'opts.limit': '20',
      'opts.skip': skip,
      managerId
    }).toString()
  ].join(''))
  const res = await raw.json()
  return res || {}
}

export default Vue.extend({
  async asyncData ({ error, params }): Promise<any> {
    try {
      if (!params.slug) {
        return error({
          statusCode: 404
        })
      }

      const raw = await fetch([
        apiAddr,
        '/v1/org/getManagerBySlug?',
        new URLSearchParams({
          slug: params.slug
        }).toString()
      ].join(''))
      if (!raw.ok) {
        return error({
          statusCode: 500
        })
      }

      const { manager } = await raw.json()

      const h = manager.name
      const description = `Список всех юрлиц, где руководитель ${manager.name}`

      const data = {
        breadcrumb: [{
          id: 1,
          text: '🏠',
          to: {
            path: '/orgs'
          }
        }, {
          id: 2,
          text: manager.name,
          to: {
            path: '/orgs/manager/' + manager.slug
          }
        }],
        item: {
          id: manager.id,
          header: h,
          description
        },
        org: {
          items: []
        },
        title: makeTitle(`Юрлица где ${h} руководитель`),
        description
      }

      const res = await getOrgs(data.item.id, '0')
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
      const res = await getOrgs(this.item.id, this.skip)

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
