<template>
  <b-container fluid="xl">
    <Header />
    <b-breadcrumb :items="breadcrumb" />
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
              class="mr-1 mb-1"
              @remove="city.removeTag(tag)"
            >
              {{ tag.title }}
            </b-form-tag>
            <vue-bootstrap-typeahead
              ref="cityinput"
              v-model="city.search"
              :data="city.list"
              :serializer="s => s.title"
              placeholder="Можно несколько"
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
              class="mr-1 mb-1"
              @remove="category.removeTag(tag)"
            >
              {{ tag.title }}
            </b-form-tag>
            <vue-bootstrap-typeahead
              ref="categoryinput"
              v-model="category.search"
              :data="category.list"
              :serializer="s => s.title"
              placeholder="Можно несколько"
              @hit="category.addTag($event)"
            />
            <b-form-text v-if="category.tags.length === 0">
              Все категории
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
          Файл уже очищен от дубликатов, поэтому строк в нем может быть меньше, чем в результатах поиска
        </p>
      </b-alert>
    </b-row>

    <h3 class="pt-3 pb-3">
      Найдено
      <span class="text-muted">
        {{ company.totalCount || 0 }}
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

    <client-only v-if="company.totalCount > 20 && !scrollDone">
      <infinite-loading
        spinner="spiral"
        distance="2000"
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
import { debounce } from 'underscore'
import select from '~/helpers/select'
import getCompanies from '~/helpers/getCompanies'

const downloadEmails = async (querystring: string): Promise<string[]> => {
  const raw = await fetch([
    process.env.API_HOST,
    '/v1/company/getEmailList?',
    querystring
  ].join(''))

  const res = await raw.json()

  return res.emails
}

const downloadPhones = async (querystring: string): Promise<string[]> => {
  const raw = await fetch([
    process.env.API_HOST,
    '/v1/company/getPhoneList?',
    querystring
  ].join(''))

  const res = await raw.json()

  return res.phones
}

const addCityCategoryTag = (ctx, type, inputRefName) => {
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

const removeCityCategoryTag = (ctx, type) => {
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

const forceTxtDownload = (filename: string, rows: string[] | number[]): void => {
  if (!rows?.length) {
    return
  }

  let text = ''
  rows.forEach((row) => {
    text += `${row.toString().trim()}\n`
  })

  const url = window.URL.createObjectURL(new Blob([text], {
    type: 'text/plain;charset=utf-8'
  }))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename + '.txt')
  document.body.appendChild(link)
  link.click()
  link.parentNode.removeChild(link)
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

export default Vue.extend({
  components: {
    VueBootstrapTypeahead
  },
  async asyncData (): Promise<object> {
    const res = await getCompanies(new URLSearchParams({
      'opts.limit': '20'
    }).toString())

    return {
      company: {
        items: res.companies,
        totalCount: res.totalCount
      },
      titleCompaniesCount: toTitleCompaniesCount(res.totalCount)
    }
  },
  data (): any {
    return {
      breadcrumb: [{
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
        hasFacebook: select.any
      },
      city: {
        list: [],
        tags: [],
        search: '',
        addTag: addCityCategoryTag(this, 'city', 'cityinput'),
        removeTag: removeCityCategoryTag(this, 'city')
      },
      category: {
        list: [],
        tags: [],
        search: '',
        addTag: addCityCategoryTag(this, 'category', 'categoryinput'),
        removeTag: removeCityCategoryTag(this, 'category')
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
    fromId (): string | undefined {
      if (this.company?.items?.length) {
        return this.company.items[this.company.items.length - 1].id
      }
      return undefined
    }
  },
  watch: {
    'city.search': debounce(function (title: string) {
      this.getCitiesHints(title)
    }, 500),
    'category.search': debounce(function (title: string) {
      this.getCategoriesHints(title)
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
      const rawCities = await fetch([
        process.env.API_HOST,
        '/v1/city/getHints?',
        new URLSearchParams({
          title,
          limit: '10'
        }).toString()
      ].join(''))
      const suggs = await rawCities.json()
      this.city.list = suggs.cities || []
    },
    async getCategoriesHints (title: string) {
      const rawCategories = await fetch([
        process.env.API_HOST,
        '/v1/category/getHints?',
        new URLSearchParams({
          title,
          limit: '10'
        }).toString()
      ].join(''))
      const suggs = await rawCategories.json()
      this.category.list = suggs.categories || []
    },
    async methodSearchCompanies () {
      this.scrollDone = false
      this.loading.search = true
      const res = await getCompanies(this.buildSearchQuery())
      this.loading.search = false

      if (!this.company) {
        this.company = {
          items: [],
          totalCount: 0
        }
      }

      this.company.items = res.companies
      this.company.totalCount = res.totalCount
    },
    buildSearchQuery (withFromId?: boolean): string {
      const q: any = {
        ...this.query,
        'opts.limit': 20
      }

      if (withFromId) {
        q['opts.fromId'] = this.fromId
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

      if (this.city.tags.length !== 0) {
        this.city.tags.forEach(({ id }) => {
          params.append('cityIds', id)
        })
      }
      if (this.category.tags.length !== 0) {
        this.category.tags.forEach(({ id }) => {
          params.append('categoryIds', id)
        })
      }

      return params.toString()
    },
    async infiniteScroll ($state) {
      const res = await getCompanies(this.buildSearchQuery(true))

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
      const emails = await downloadEmails(this.buildSearchQuery(false))
      this.loading.downloadEmails = false

      forceTxtDownload('emails', emails)
    },
    async methodDownloadPhones () {
      this.downloadAlertCountDown = this.downloadAlertDismissSecs

      this.loading.downloadPhones = true
      const phones = await downloadPhones(this.buildSearchQuery(false))
      this.loading.downloadPhones = false

      forceTxtDownload('phones', phones)
    }
  }
})
</script>
