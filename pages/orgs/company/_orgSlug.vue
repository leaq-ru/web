<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb
      :items="breadcrumb"
      :ads="true"
    />

    <h1>
      {{ org.name || org.slug }}
    </h1>

    <b-row>
      <b-col md="6">
        <b-card>
          <span class="text-muted">
            {{ capitalize(safeAreaTypeFull(org)) || 'Город' }}
          </span>
          <b-row />
          <template v-if="safeAreaSlug(org)">
            <b-link :to="`/orgs/${safeAreaSlug(org)}/all`">
              {{ safeAreaName(org) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row class="mt-1" />

          <span class="text-muted">
            Адрес регистрации
          </span>
          <b-row />
          <template v-if="safeLocationSlug(org)">
            <b-link :to="`/orgs/location/${safeLocationSlug(org)}`">
              {{ safeLocationName(org) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row class="mt-1" />

          <span class="text-muted">
            Руководитель
          </span>
          <b-row />
          <template v-if="safeManagerSlug(org)">
            <b-link :to="`/orgs/manager/${safeManagerSlug(org)}`">
              {{ safeManagerName(org) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row class="mt-1" />

          <span class="text-muted">
            Тип компании
          </span>
          <b-row />
          {{ kind }}

          <b-row class="mt-1" />

          <span class="text-muted">
            ОПФ
          </span>
          <b-row />
          <span class="text-muted">
            {{ org.opfCode || none }}
          </span>
          {{ org.opfFull || org.opfShort || none }}
        </b-card>
      </b-col>

      <b-col md="6">
        <b-card>
          <span class="text-muted">
            Статус
          </span>
          <b-row />
          <b-icon-circle-fill :variant="statusColor" />
          {{ statusText }}

          <b-row class="mt-1" />

          <span class="text-muted">
            Дата присвоения ОГРН
          </span>
          <b-row />
          {{ safeEmptyDate(org.ogrnDate) }}

          <b-row class="mt-1" />

          <span class="text-muted">
            Дата регистрации
          </span>
          <b-row />
          {{ safeEmptyDate(org.registrationDate) }}

          <b-row class="mt-1" />

          <span class="text-muted">
            Дата ликвидации
          </span>
          <b-row />
          {{ safeEmptyDate(org.liqudationDate) }}
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-card class="mt-3">
          <b-row>
            <b-col md="6">
              <span class="text-muted">
                ИНН
              </span>
              <b-row />
              {{ org.inn || none }}

              <b-row class="mt-1" />

              <span class="text-muted">
                КПП
              </span>
              <b-row />
              {{ org.kpp || none }}

              <b-row class="mt-1" />

              <span class="text-muted">
                ОГРН
              </span>
              <b-row />
              {{ org.ogrn || none }}

              <b-row class="mt-1" />

              <span class="text-muted">
                ОКАТО
              </span>
              <b-row />
              {{ org.okato || none }}
            </b-col>

            <b-col md="6">
              <span class="text-muted">
                ОКФС
              </span>
              <b-row />
              {{ org.okfs || none }}

              <b-row class="mt-1" />

              <span class="text-muted">
                ОКОГУ
              </span>
              <b-row />
              {{ org.okogu || none }}

              <b-row class="mt-1" />

              <span class="text-muted">
                ОКПО
              </span>
              <b-row />
              {{ org.okpo || none }}

              <b-row class="mt-1" />

              <span class="text-muted">
                ОКТМО
              </span>
              <b-row />
              {{ org.oktmo || none }}
            </b-col>
          </b-row>
        </b-card>
      </b-col>

      <b-col md="6">
        <b-card class="mt-3">
          <span class="text-muted">
            Ближайшие станции метро
          </span>
          <b-row />
          <span
            v-for="m in org.metros"
            :key="m.id"
          >
            <b-link :to="`/orgs/metro/${m.slug}`">
              {{ m.name }}
            </b-link>{{ m.line ? ` (${m.line} линия)` : '' }}
            <span
              v-if="m.distance"
              class="text-muted"
            >
              {{ m.distance.toFixed(2) }} км
            </span>
            <b-row />
          </span>
          <template v-if="!org.metros">
            {{ none }}
          </template>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12">
        <b-card class="mt-3">
          <span class="text-muted">
            Основной вид деятельности
          </span>
          <b-row />
          <template v-if="safeOkvedSlug(org)">
            <b-link :to="`/orgs/all/${safeOkvedSlug(org)}`">
              <span class="text-muted">
                {{ safeOkvedCode(org) }}
              </span>
              {{ safeOkvedName(org) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row class="mt-3" />

          <b-link
            v-if="!showOkvedDop"
            @click="showOkvedDop = true"
          >
            <b-icon-arrow-down />
            Показать дополнительные
          </b-link>
          <span v-else>
            <span
              v-for="okvedDop in org.okvedDop"
              :key="okvedDop.id"
            >
              <b-row />
              <b-link :to="`/orgs/all/${okvedDop.slug}`">
                {{ okvedDop.name }}
              </b-link>
            </span>
          </span>
        </b-card>
      </b-col>
    </b-row>

    <template v-if="branches && branches.length">
      <b-row class="mt-3" />

      <h2>
        Филиалы
      </h2>

      <b-card
        v-for="(b, i) in branches"
        :key="b.name+i"
        :header="b.name"
      >
        <span class="text-muted">
          Город
        </span>
        <b-row />
        <template v-if="b.area">
          <b-link :to="`/orgs/${b.area.slug}/all`">
            {{ b.area.name }}
          </b-link>
        </template>
        <template v-else>
          {{ none }}
        </template>

        <b-row class="mt-1" />

        <span class="text-muted">
          Адрес регистрации
        </span>
        <b-row />
        <template v-if="b.location">
          <b-link :to="`/orgs/location/${b.location.slug}`">
            {{ b.location.name }}
          </b-link>
        </template>
        <template v-else>
          {{ none }}
        </template>

        <b-row class="mt-1" />

        <span class="text-muted">
          Статус
        </span>
        <b-row />
        <b-icon-circle-fill :variant="branchStatuses[i].color" />
        {{ branchStatuses[i].text }}
      </b-card>
    </template>

    <div
      id="horizontal-2"
      class="mt-5 w-100"
    />

    <b-row
      v-if="related && related.length"
      class="mt-5"
    >
      <b-col>
        <h2>
          Похожие компании
        </h2>
      </b-col>
    </b-row>
    <OrgCardDeck :items="related" />
    <client-only v-if="related && related.length >= 6 && !relatedScrollDone">
      <infinite-loading
        spinner="spiral"
        :distance="1000"
        @infinite="collectionInfiniteScroll"
      />
    </client-only>

    <b-row class="mb-2" />
    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import orgGetters from '~/helpers/org/getters'
import apiAddr from '~/helpers/const/apiAddr'
import unifyDate from '~/helpers/unifyDate'
import capitalize from '~/helpers/capitalize'
import getStatus from '~/helpers/org/getStatus'

const getRelated = async ({
  addr = apiAddr,
  org,
  limit,
  skip
}: {
  addr?: string
  org: any
  limit: number
  skip: number
}): Promise<any> => {
  const queryRelated = new URLSearchParams()
  queryRelated.append('opts.limit', limit.toString())
  if (org.area?.id) {
    queryRelated.append('areaId', org.area.id)
  }
  if (org.okved?.id) {
    queryRelated.append('okvedId', org.okved.id)
  }
  if (skip) {
    queryRelated.append('opts.skip', skip.toString())
  }

  const rawRelated = await fetch([
    addr,
    '/v1/org/getRelated?',
    queryRelated.toString()
  ].join(''))

  const resRelated = await rawRelated.json()

  return resRelated.orgs || []
}

const makeTitle = (org: any): string => {
  let areaName = ''
  if (org.area?.name) {
    areaName = `, ${org.area.name}`
  }

  const elems = [`${org.name}${areaName} (ИНН ${org.inn}, ОГРН ${org.ogrn})`]

  elems.push('LEAQ')
  return elems.join(' / ')
}

const makeDescription = (org: any): string => {
  let desc = 'Информация о компании'

  if (org.manager?.name) {
    desc += `. Руководитель ${org.manager.name}`
  }

  if (org.location?.name) {
    desc += `. Адрес регистрации ${org.location.name}`
  }

  if (org.okved?.codeWithName) {
    desc += `. ОКВЭД ${org.okved.codeWithName}`
  }

  if (org.registrationDate) {
    desc += `. Дата регистрации ${unifyDate(org.registrationDate).toLocaleDateString()}`
  }

  return desc
}

export default Vue.extend({
  async asyncData ({ error, params }): Promise<any> {
    try {
      if (!params.orgSlug) {
        return error({
          statusCode: 404
        })
      }

      const raw = await fetch([
        apiAddr,
        '/v1/org/getBySlug?',
        new URLSearchParams({
          slug: params.orgSlug
        }).toString()
      ].join(''))

      if (!raw.ok) {
        return error({
          statusCode: 404
        })
      }

      const {
        main,
        branches = [],
        related = []
      } = await raw.json()

      const st = getStatus(main.statusKind)

      const data: any = {
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
        }, {
          id: 4,
          text: main.name || main.slug,
          to: {
            path: `/orgs/company/${main.slug}`
          }
        }],
        title: makeTitle(main),
        description: makeDescription(main),
        org: main,
        branches,
        branchStatuses: [],
        related,
        statusText: st.text,
        statusColor: st.color
      }

      branches.forEach((br) => {
        let text = '—'
        let color = 'secondary'
        switch (br.statusKind) {
          case 'ACTIVE':
            text = 'Действующий'
            color = 'success'
            break
          case 'LIQUIDATING':
            text = 'Ликвидируется'
            color = 'warning'
            break
          case 'REORGANIZING':
            text = 'В процессе присоединения к другому юрлицу, с последующей ликвидацией'
            color = 'warning'
            break
          case 'LIQUIDATED':
            text = 'Ликвидирован'
            color = 'danger'
            break
          case 'BANKRUPT':
            text = 'Банкротство'
            color = 'danger'
            break
        }
        data.branchStatuses.push({
          text,
          color
        })
      })

      switch (main.kind) {
        case 'LEGAL':
          data.kind = 'Юридическое лицо'
          break
        case 'INDIVIDUAL':
          data.kind = 'Индивидуальный предприниматель'
          break
      }

      if (main.area) {
        data.breadcrumb[1].text = main.area.name
        const toElems = data.breadcrumb[1].to.path.split('/')
        toElems[2] = main.area.slug
        data.breadcrumb[1].to.path = toElems.join('/')
      }
      if (main.okved) {
        data.breadcrumb[2].text = main.okved.name
        const toElems = data.breadcrumb[1].to.path.split('/')
        toElems[2] = main.area?.slug || 'all'
        toElems[3] = main.okved.slug
        data.breadcrumb[2].to.path = toElems.join('/')
      }

      return data
    } catch {
      return error({
        statusCode: 404
      })
    }
  },
  data () {
    return {
      none: '—',
      relatedScrollDone: false,
      showOkvedDop: false
    }
  },
  computed: {
    relatedSkip (): number | undefined {
      return this.related?.length
    }
  },
  mounted () {
    this.injectAds()
  },
  methods: {
    ...orgGetters,
    injectAds () {
      if (process.env.ADS) {
        const w = window as any
        w.yaContextCb.push(() => {
          w.Ya.Context.AdvManager.render({
            renderTo: 'horizontal-2',
            blockId: 'R-A-2665526-2',
            type: 'feed'
          })
        })
      }
    },
    unifyDate,
    capitalize,
    safeEmptyDate (d: string): string {
      return d ? unifyDate(d).toLocaleDateString() : this.none
    },
    async collectionInfiniteScroll ($state) {
      const res = await getRelated({
        org: this.org,
        limit: 20,
        skip: this.relatedSkip
      })

      if (res?.length) {
        this.related.push(...res)
      } else {
        this.relatedScrollDone = true
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

<style scoped>
.ml-21 {
  margin-left: 21px;
}
</style>
