<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <b-jumbotron
      header="Каталог компаний России"
      :lead="`Более ${titleCompaniesCount} фирм доступно для поиска`"
    >
      <p>
        Город, сфера деятельности, телефон, email, и многое другое в карточках компаний. Все данные доступны по
        <b-link href="https://api.leaq.ru/docs/" target="_blank">
          API
        </b-link>
        для интеграции с вашим бизнесом
      </p>
      <span id="search" />
    </b-jumbotron>
    <b-card
      border-variant="primary"
      class="mb-4"
    >
      <b-row>
        <b-col md="6">
          <b-form-group label="Город">
            <b-form-tag
              v-for="tag in city.tags"
              :key="tag.id"
              :title="tag.title"
              pill
              variant="primary"
              class="mr-1 mb-2"
              @remove="city.removeTag(tag)"
            >
              {{ tag.title }}
            </b-form-tag>
            <vue-bootstrap-typeahead
              ref="cityinput"
              v-model="city.search"
              :data="city.list"
              :serializer="s => s.title"
              placeholder="Например «Москва», «Бор», «Владивосток» ..."
              @hit="city.addTag($event)"
            />
            <b-form-text v-if="city.tags.length === 0">
              Все города
            </b-form-text>
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group label="Категория">
            <b-form-tag
              v-for="tag in category.tags"
              :key="tag.id"
              :title="tag.title"
              pill
              variant="primary"
              class="mr-1 mb-2"
              @remove="category.removeTag(tag)"
            >
              {{ tag.title }}
            </b-form-tag>
            <vue-bootstrap-typeahead
              ref="categoryinput"
              v-model="category.search"
              :data="category.list"
              :serializer="s => s.title"
              placeholder="Например «Создание сайтов», «Металлургия», «Фитнес» ..."
              @hit="category.addTag($event)"
            />
            <b-form-text v-if="category.tags.length === 0">
              Все категории
            </b-form-text>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <b-form-group label="Технологии на сайте">
            <b-form-tag
              v-for="tag in technology.tags"
              :key="tag.id"
              :title="tag"
              pill
              variant="primary"
              class="mr-1 mb-2"
              @remove="technology.removeTag(tag)"
            >
              {{ makeTechnologyTagName(tag) }}
            </b-form-tag>

            <b-form-radio-group
              v-if="technology.tags.length >= 2"
              v-model="query.technologyFindRule"
              class="mb-2"
              :options="findRuleOptions"
            />

            <vue-bootstrap-typeahead
              ref="technologyinput"
              v-model="technology.search"
              :data="technology.list"
              :serializer="s => makeTechnologyTagName(s)"
              placeholder="Например «Интернет-магазин», «1C-Bitrix», «Vue.js» ..."
              @hit="technology.addTag($event)"
            />
            <b-form-text v-if="technology.tags.length === 0">
              Все технологии
            </b-form-text>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

    <b-row>
      <b-col md="6">
        <b-card
          class="mb-4"
          header="Наличие контактов"
        >
          <b-form-group>
            <b-row>
              <b-col md="6">
                <b-form-group label="Email">
                  <b-form-select
                    v-model="query.hasEmail"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group label="Телефон">
                  <b-form-select
                    v-model="query.hasPhone"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-form-group>
        </b-card>

        <b-card
          header="Наличие приложений"
          class="mb-4"
        >
          <b-form-group>
            <b-row>
              <b-col md="6">
                <b-form-group label="App Store">
                  <b-form-select
                    v-model="query.hasAppStore"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group label="Google Play">
                  <b-form-select
                    v-model="query.hasGooglePlay"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-form-group>
        </b-card>
      </b-col>

      <b-col md="6">
        <b-card
          header="Наличие соцсетей"
          class="mb-4"
        >
          <b-form-group>
            <b-row>
              <b-col md="6">
                <b-form-group label="VK">
                  <b-form-select
                    v-model="query.hasVk"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group label="VK подписчиков">
                  <b-row>
                    <b-col md="6">
                      <b-form-input
                        v-model="query['vkMembersCount.from']"
                        :disabled="query.hasVk !== 'YES'"
                        type="number"
                        placeholder="От"
                        min="0"
                        step="1"
                        :class="query['vkMembersCount.from'] === '' ? '' : 'mb-3'"
                      />
                      <b-form-text
                        v-if="query['vkMembersCount.from'] === ''"
                        class="mb-3"
                      >
                        Не важно
                      </b-form-text>
                    </b-col>

                    <b-col md="6">
                      <b-form-input
                        v-model="query['vkMembersCount.to']"
                        :disabled="query.hasVk !== 'YES'"
                        type="number"
                        placeholder="До"
                        min="0"
                        step="1"
                      />
                      <b-form-text v-if="query['vkMembersCount.to'] === ''">
                        Не важно
                      </b-form-text>
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <b-form-group label="Instagram">
                  <b-form-select
                    v-model="query.hasInstagram"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group label="Twitter">
                  <b-form-select
                    v-model="query.hasTwitter"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <b-form-group label="YouTube">
                  <b-form-select
                    v-model="query.hasYoutube"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group label="Facebook">
                  <b-form-select
                    v-model="query.hasFacebook"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-card
          header="Наличие реквизитов"
          class="mb-4"
        >
          <b-form-group>
            <b-row>
              <b-col md="4">
                <b-form-group label="ИНН">
                  <b-form-select
                    v-model="query.hasInn"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group label="КПП">
                  <b-form-select
                    v-model="query.hasKpp"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group label="ОГРН">
                  <b-form-select
                    v-model="query.hasOgrn"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-form-group>
        </b-card>
      </b-col>

      <b-col md="6">
        <b-card
          id="search-buttons"
          header="Сайт онлайн"
          class="mb-4"
        >
          <b-form-group>
            <b-row>
              <b-col md="4">
                <b-form-group>
                  <b-form-select
                    v-model="query.hasOnline"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mb-2">
      <b-col md="3" class="mb-3">
        <b-button
          v-if="loading.search"
          disabled
          pill
          block
          variant="primary"
          @click="methodSearchCompanies"
        >
          <b-icon-arrow-clockwise animation="spin" />
          Найти
        </b-button>
        <b-button
          v-else
          pill
          block
          variant="primary"
          @click="methodSearchCompanies"
        >
          <b-icon-search />
          Найти
        </b-button>
      </b-col>

      <b-col md="3" class="mb-3">
        <b-button
          v-if="loading.downloadCsv"
          disabled
          pill
          block
          variant="outline-primary"
          @click="methodDownloadCsv"
        >
          <b-icon-arrow-clockwise animation="spin" />
          Скачать csv базу
        </b-button>
        <b-button
          v-else
          pill
          block
          variant="outline-primary"
          @click="methodDownloadCsv"
        >
          <b-icon-file-text />
          Скачать csv базу
        </b-button>
      </b-col>

      <b-col md="3" class="mb-3">
        <b-button
          v-if="loading.downloadEmails"
          disabled
          pill
          block
          variant="outline-primary"
          @click="methodDownloadEmails"
        >
          <b-icon-arrow-clockwise animation="spin" />
          Скачать emails
        </b-button>
        <b-button
          v-else
          pill
          block
          variant="outline-primary"
          @click="methodDownloadEmails"
        >
          <b-icon-envelope />
          Скачать email
        </b-button>
      </b-col>

      <b-col md="3" class="mb-3">
        <b-button
          v-if="loading.downloadPhones"
          disabled
          pill
          block
          variant="outline-primary"
          @click="methodDownloadPhones"
        >
          <b-icon-arrow-clockwise animation="spin" />
          Скачать телефоны
        </b-button>
        <b-button
          v-else
          pill
          block
          variant="outline-primary"
          @click="methodDownloadPhones"
        >
          <b-icon-telephone />
          Скачать телефоны
        </b-button>
      </b-col>

      <b-alert
        v-if="dataPremium"
        fade
        :show="downloadAlertCountDown"
        dismissible
        variant="success"
        class="w-100"
        @dismissed="downloadAlertCountDown=0"
      >
        <h6 class="alert-heading">
          Скачивание началось
        </h6>

        <p v-if="csvClick">
          База будет доступна в разделе
          <b-link to="/account/exports">
            выгрузки
          </b-link>
          в личном кабинете
        </p>
        <p v-else>
          Пожалуйста не покидайте страницу, собираем список для вас, затем начнется скачивание. Обычно занимает 30-60 секунд
        </p>
      </b-alert>
      <b-alert
        v-else
        fade
        :show="downloadAlertCountDown"
        dismissible
        variant="success"
        class="w-100"
        @dismissed="downloadAlertCountDown=0"
      >
        <h6 class="alert-heading">
          Скачивание началось
        </h6>

        <p>
          Будет скачано не более 1000 результатов. Данные без ограничений доступны на
          <b-link to="/plans#data">
            расширенном тарифе
          </b-link>
        </p>
      </b-alert>

      <b-alert
        fade
        :show="errConcExports"
        dismissible
        variant="danger"
        class="w-100"
      >
        <h6 class="alert-heading">
          Ошибка
        </h6>

        <p>
          Пожалуйста, дождитесь пока одна из ваших
          <b-link to="/account/exports">
            выгрузок
          </b-link>
          завершится, и затем попробуйте снова
        </p>
      </b-alert>
    </b-row>

    <h3
      id="results"
      class="pt-3 pb-3"
    >
      Найдено
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
        @infinite="infiniteScroll"
      />
    </client-only>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore - no types for this module
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import { Context } from '@nuxt/types'
import select from '~/helpers/const/select'
import getCompanies from '~/helpers/company/getCompanies'
import findRule from '~/helpers/const/findRule'
import hints from '~/helpers/hints'
import debounce from '~/helpers/debounce'
import apiAddr from '~/helpers/const/apiAddr'
import makePrettyNumber from '~/helpers/makePrettyNumber'

enum downloadType {
  email = 'email',
  phone = 'phone',
  csv = 'csv',
}

enum downloadRes {
  ok = 0,
  errUnknown = 1,
  errConcExports = 2,
}

const download = async (querystring: string, type: downloadType, premium: boolean, token: string): Promise<downloadRes> => {
  if (type === downloadType.csv) {
    const path = premium ? 'exportCompaniesAsync' : 'exportCompanies'

    const opts:RequestInit = {}
    if (token) {
      opts.headers = new Headers({
        Authorization: `Bearer ${token}`
      })
    }

    const raw = await fetch([
      apiAddr,
      `/v1/exporter/${path}?`,
      querystring
    ].join(''), opts)

    if (!raw.ok) {
      const res = await raw.json()
      if (res?.error === 'too many concurrent exports. Wait for old export succeeded, and try again') {
        return downloadRes.errConcExports
      }

      return downloadRes.errUnknown
    }

    if (!premium) {
      const res = await raw.json()
      window.open(res.url, '_self')
    }
    return downloadRes.ok
  }

  let apiPath
  switch (type) {
    case downloadType.email:
      apiPath = 'getEmailList'
      break
    case downloadType.phone:
      apiPath = 'getPhoneList'
      break
    default:
      throw new Error('unknown downloadType')
  }

  const raw = await fetch([
    apiAddr,
    `/v1/company/${apiPath}?`,
    querystring
  ].join(''))

  const res = await raw.json()

  window.open(res.downloadUrl, '_self')
}

const addTag = (ctx, type, inputRefName) => {
  return (val) => {
    ctx.$refs[inputRefName].inputValue = ''
    for (const tag of ctx[type].tags) {
      if (tag.id === val.id) {
        return
      }
    }
    ctx[type].tags.push(val)
  }
}

const removeTag = (ctx, type) => {
  return (val) => {
    for (let i = 0; i < ctx[type].tags.length; i += 1) {
      const tag = ctx[type].tags[i]
      if (tag.id === val.id) {
        ctx[type].tags.splice(i, 1)
        return
      }
    }
  }
}

const makeTitle = (companiesCount: string) => {
  return `Более ${companiesCount} фирм из разных городов России и категорий. Бесплатное скачивание базы email и телефонов / Каталог компаний LEAQ`
}

export default Vue.extend({
  components: {
    VueBootstrapTypeahead
  },
  async asyncData (ctx: Context): Promise<object> {
    const promises = [
      getCompanies({
        querystring: new URLSearchParams({
          'opts.limit': '20'
        }).toString()
      }),
      fetch([
        apiAddr,
        '/v1/company/getTotalCount'
      ].join(''))
    ]

    const token = ctx.store.state?.user?.self?.token
    if (token) {
      promises.push(fetch([
        apiAddr,
        '/v1/billing/getMyDataPlan'
      ].join(''), {
        headers: new Headers({
          Authorization: `Bearer ${token}`
        })
      }))
    }

    const [
      resComps,
      rawTotalCount,
      rawMyDataPlan
    ] = await Promise.all(promises)

    const resTotalCount = await rawTotalCount.json()

    const countWithCommas = makePrettyNumber(resTotalCount.totalCount, ',')

    const data = {
      company: {
        items: resComps.companies
      },
      titleCompaniesCount: countWithCommas,
      title: makeTitle(countWithCommas),
      dataPremium: false
    }

    if (rawMyDataPlan) {
      const resMyDataPlan = await rawMyDataPlan.json()
      data.dataPremium = resMyDataPlan.premium
    }

    return data
  },
  data (): any {
    return {
      breadcrumb: [{
        id: 1,
        text: '🏠',
        to: {
          path: '/'
        }
      }],
      selectOptions: [{
        text: 'Не важно',
        value: select.any
      }, {
        text: 'Да',
        value: select.yes
      }, {
        text: 'Нет',
        value: select.no
      }],
      findRuleOptions: [{
        text: 'Одна из',
        value: findRule.oneOf
      }, {
        text: 'Все вместе',
        value: findRule.all
      }],
      query: {
        hasEmail: select.any,
        hasPhone: select.any,
        hasOnline: select.any,
        hasInn: select.any,
        hasKpp: select.any,
        hasOgrn: select.any,
        hasAppStore: select.any,
        hasGooglePlay: select.any,
        hasVk: select.any,
        'vkMembersCount.from': '',
        'vkMembersCount.to': '',
        hasInstagram: select.any,
        hasTwitter: select.any,
        hasYoutube: select.any,
        hasFacebook: select.any,
        technologyFindRule: findRule.oneOf
      },
      city: {
        list: [],
        tags: [],
        search: '',
        addTag: addTag(this, 'city', 'cityinput'),
        removeTag: removeTag(this, 'city')
      },
      category: {
        list: [],
        tags: [],
        search: '',
        addTag: addTag(this, 'category', 'categoryinput'),
        removeTag: removeTag(this, 'category')
      },
      technology: {
        list: [],
        tags: [],
        search: '',
        addTag: addTag(this, 'technology', 'technologyinput'),
        removeTag: removeTag(this, 'technology')
      },
      loading: {
        search: false,
        downloadEmails: false,
        downloadPhones: false,
        downloadCsv: false
      },
      downloadAlertCountDown: 0,
      downloadAlertDismissSecs: 30,
      scrollDone: false,
      csvClick: false,
      errConcExports: false
    }
  },
  computed: {
    skip (): string | undefined {
      return this.company?.items?.length
    }
  },
  watch: {
    'city.search': debounce(function (title: string) {
      this.getCitiesHints(title)
    }, 500),
    'category.search': debounce(function (title: string) {
      this.getCategoriesHints(title)
    }, 500),
    'technology.search': debounce(function (title: string) {
      this.getTechnologiesHints(title)
    }, 500),
    'query.hasVk' (val) {
      if (val !== select.yes) {
        this.query['vkMembersCount.from'] = ''
        this.query['vkMembersCount.to'] = ''
      }
    }
  },
  methods: {
    ...hints,
    async methodSearchCompanies () {
      this.scrollDone = false
      this.loading.search = true
      const res = await getCompanies({
        querystring: this.buildSearchQuery()
      })
      this.loading.search = false

      if (!this.company) {
        this.company = {
          items: []
        }
      }

      this.company.items = res.companies
    },
    buildSearchQuery (withSkip?: boolean): string {
      const q: any = {
        ...this.query,
        'opts.limit': 20
      }

      if (withSkip) {
        q['opts.skip'] = this.skip
      }

      if (q['vkMembersCount.from']) {
        q['vkMembersCount.from'] = parseInt(q['vkMembersCount.from'], 10)
      } else {
        delete q['vkMembersCount.from']
      }

      if (q['vkMembersCount.to']) {
        q['vkMembersCount.to'] = parseInt(q['vkMembersCount.to'], 10)
      } else {
        delete q['vkMembersCount.to']
      }

      const params = new URLSearchParams(q)

      this.city.tags.forEach(({ id }) => {
        params.append('cityIds', id)
      })
      this.category.tags.forEach(({ id }) => {
        params.append('categoryIds', id)
      })
      this.technology.tags.forEach(({ id }) => {
        params.append('technologyIds', id)
      })

      return params.toString()
    },
    async infiniteScroll ($state) {
      const res = await getCompanies({
        querystring: this.buildSearchQuery(true)
      })

      if (res?.companies?.length) {
        this.company.items.push(...res.companies)
      } else {
        this.scrollDone = true
      }
      $state.loaded()
    },
    async methodDownloadEmails () {
      this.csvClick = false
      this.downloadAlertCountDown = this.downloadAlertDismissSecs

      const token = this.$store.state?.user?.self?.token
      this.loading.downloadEmails = true
      await download(this.buildSearchQuery(false), downloadType.email, this.dataPremium, token)
      this.loading.downloadEmails = false
    },
    async methodDownloadPhones () {
      this.csvClick = false
      this.downloadAlertCountDown = this.downloadAlertDismissSecs

      const token = this.$store.state?.user?.self?.token
      this.loading.downloadPhones = true
      await download(this.buildSearchQuery(false), downloadType.phone, this.dataPremium, token)
      this.loading.downloadPhones = false
    },
    async methodDownloadCsv () {
      this.csvClick = true
      this.errConcExports = false

      const token = this.$store.state?.user?.self?.token
      this.loading.downloadCsv = true
      const resDl = await download(this.buildSearchQuery(false), downloadType.csv, this.dataPremium, token)
      this.loading.downloadCsv = false
      if (resDl === downloadRes.errConcExports) {
        this.errConcExports = true
        return
      }

      this.downloadAlertCountDown = this.downloadAlertDismissSecs
    },
    makeTechnologyTagName (name: any): string {
      return name.version ? `${name.name} ${name.version}` : name.name
    }
  },
  head () {
    return {
      title: this.title,
      meta: [{
        hid: 'yandex-verification',
        name: 'yandex-verification',
        content: '76edae62e49e83d0'
      }, {
        hid: 'description',
        name: 'description',
        content: 'Каталог компаний из разных городов от Москвы до Владивостока, из категорий от Создания и продвижения сайтов до Черной и цветной металлургии. Доступно бесплатное скачивание базы email и телефонов компаний с учетом фильтров поиска'
      }]
    }
  }
})
</script>
