<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <b-jumbotron
      id="search"
      header="Каталог компаний России"
      :lead="`Более ${titleCompaniesCount} фирм доступно для поиска`"
    >
      <p>
        Город, сфера деятельности, телефон, email, и многое другое в карточках компаний. Все данные доступны по
        <b-link href="https://api.leaq.ru/docs" target="_blank">
          API
        </b-link>
        для интеграции с вашим бизнесом
      </p>
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
              :title="tag"
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
              :title="tag"
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

        <b-card
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

    <b-row>
      <b-col md="4" class="mb-4">
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

      <b-col md="4" class="mb-4">
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
          Скачать emails
        </b-button>
      </b-col>

      <b-col md="4" class="mb-4">
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
          Наберитесь терпения, скачивание может идти ~1 минуту. Кстати, файл уже очищен от дубликатов
        </p>
      </b-alert>
    </b-row>

    <h3 class="pt-3 pb-3">
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
import select from '~/helpers/const/select'
import getCompanies from '~/helpers/company/getCompanies'
import findRule from '~/helpers/const/findRule'

const debounce = (func, wait, immediate = false) => {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) { func.apply(context, args) }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) { func.apply(context, args) }
  }
}

enum downloadType {
  email = 'email',
  phone = 'phone',
}

const download = async (querystring: string, type: downloadType): Promise<void> => {
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
    process.env.API_HOST,
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

const toTitleCompaniesCount = (num: number): string => {
  if (!num) {
    return '—'
  }

  const str = String(num).split('').reverse()
  str.forEach((elem, i) => {
    if (i % 3 === 0 && i !== 0) {
      str[i] = elem + ','
    }
  })
  return str.reverse().join('')
}

const makeTitle = (companiesCount: string) => {
  return `Более ${companiesCount} фирм из разных городов России и категорий. Бесплатное скачивание базы email и телефонов / Каталог компаний LEAQ`
}

export default Vue.extend({
  components: {
    VueBootstrapTypeahead
  },
  async asyncData (): Promise<object> {
    const [resComps, rawTotalCount] = await Promise.all([
      getCompanies({
        querystring: new URLSearchParams({
          'opts.limit': '20'
        }).toString()
      }),
      fetch([
        process.env.API_HOST,
        '/v1/company/getTotalCount'
      ].join(''))
    ])

    const resTotalCount = await rawTotalCount.json()

    const countWithCommas = toTitleCompaniesCount(resTotalCount.totalCount)

    return {
      company: {
        items: resComps.companies
      },
      titleCompaniesCount: countWithCommas,
      title: makeTitle(countWithCommas)
    }
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
        downloadPhones: false
      },
      downloadAlertCountDown: 0,
      downloadAlertDismissSecs: 10,
      scrollDone: false
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
    async getCitiesHints (title: string) {
      const raw = await fetch([
        process.env.API_HOST,
        '/v1/city/getHints?',
        new URLSearchParams({
          title,
          limit: '7'
        }).toString()
      ].join(''))
      const res = await raw.json()
      this.city.list = res.cities || []
    },
    async getCategoriesHints (title: string) {
      const raw = await fetch([
        process.env.API_HOST,
        '/v1/category/getHints?',
        new URLSearchParams({
          title,
          limit: '7'
        }).toString()
      ].join(''))
      const res = await raw.json()
      this.category.list = res.categories || []
    },
    async getTechnologiesHints (name: string) {
      const params = new URLSearchParams({
        name,
        limit: '7'
      })
      this.technology.tags.forEach(({ id }) => {
        params.append('excludeIds', id)
      })

      const raw = await fetch([
        process.env.API_HOST,
        '/v1/technology/getHints?',
        params.toString()
      ].join(''))
      const res = await raw.json()
      this.technology.list = res.technologies || []
    },
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
      this.downloadAlertCountDown = this.downloadAlertDismissSecs

      this.loading.downloadEmails = true
      await download(this.buildSearchQuery(false), downloadType.email)
      this.loading.downloadEmails = false
    },
    async methodDownloadPhones () {
      this.downloadAlertCountDown = this.downloadAlertDismissSecs

      this.loading.downloadPhones = true
      await download(this.buildSearchQuery(false), downloadType.phone)
      this.loading.downloadPhones = false
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
