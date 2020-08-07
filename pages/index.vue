<template>
  <b-container fluid="lg">
    <Header />
    <b-breadcrumb :items="breadcrumb" />
    <b-jumbotron header="Каталог компаний России" lead="Более 4,000,000 фирм доступно для поиска">
      <p>
        Город, сфера деятельности, телефон, email, и многое другое в карточках компаний. Все данные доступны по
        <a href="https://api.leaq.ru/api/docs" target="_blank">
          API
        </a>
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
                <b-form-group label="iOS">
                  <b-form-select
                    v-model="query.hasAppStore"
                    :options="selectOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group label="Android">
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
          pill
          block
          variant="primary"
          :disabled="loading.search"
          @click="methodSearchCompanies"
        >
          <b-icon
            v-if="loading.search"
            icon="arrow-clockwise"
            animation="spin"
          />
          <template v-else>
            <b-icon icon="search" />
            Найти
          </template>
        </b-button>
      </b-col>

      <b-col md="4" class="mb-4">
        <b-button
          pill
          block
          variant="outline-primary"
          :disabled="false"
          @click="methodSearchCompanies"
        >
          <b-icon
            v-if="false"
            icon="arrow-clockwise"
            animation="spin"
          />
          <template v-else>
            <b-icon icon="envelope" />
            Скачать email-ы
          </template>
        </b-button>
      </b-col>

      <b-col md="4" class="mb-4">
        <b-button
          pill
          block
          variant="outline-primary"
          :disabled="false"
          @click="methodSearchCompanies"
        >
          <b-icon
            v-if="false"
            icon="arrow-clockwise"
            animation="spin"
          />
          <template v-else>
            <b-icon icon="telephone" />
            Скачать телефоны
          </template>
        </b-button>
      </b-col>
    </b-row>

    <h3 class="pt-3 pb-3">
      Найдено
      <span class="text-muted">
        {{ company.totalCount || 0 }}
      </span>
      компаний
    </h3>

    <b-row
      v-for="c in company.items"
      :key="c.id"
    >
      <Card
        :url="c.url"
        :title="c.title"
        :slug="c.slug"
        :avatar="c.avatar"
        :email="c.email"
        :phone="c.phone"
        :online="c.online"
        :inn="c.inn"
        :kpp="c.kpp"
        :ogrn="c.ogrn"
        :app-store-url="safeAppStoreUrl(c)"
        :google-play-url="safeGooglePlayUrl(c)"
        :category-id="safeCategoryId(c)"
        :category-title="safeCategoryTitle(c)"
        :category-slug="safeCategorySlug(c)"
        :location-city-id="safeLocationCityId(c)"
        :location-city-title="safeLocationCityTitle(c)"
        :location-city-slug="safeLocationCitySlug(c)"
        :location-address="safeLocationAddress(c)"
        :social-vk-id="safeSocialVkId(c)"
        :social-vk-members-count="safeSocialVkMembersCount(c)"
        :social-instagram-url="safeSocialInstagramUrl(c)"
        :social-twitter-url="safeSocialTwitterUrl(c)"
        :social-youtube-url="safeSocialYoutubeUrl(c)"
        :social-facebook-url="safeSocialFacebookUrl(c)"
        :updated-at="c.updatedAt"
      />
    </b-row>

    <b-row v-if="loading.next" class="text-center">
      <b-col />
      <b-col>
        <b-icon icon="arrow-clockwise" animation="spin" font-scale="2" />
      </b-col>
      <b-col />
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore - no types for this module
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import { debounce } from 'underscore'

const getCompanies = async (querystring: string): Promise<any> => {
  try {
    const rawCompanies = await fetch([
      process.env.API_HOST,
      '/v1/company/get?',
      querystring
    ].join(''))

    const result = await rawCompanies.json()
    return result
  } catch {
    return {
      companies: [],
      totalCount: 0
    }
  }
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

enum select {
  any = 'ANY',
  yes = 'YES',
  no = 'NO',
}

export default Vue.extend({
  components: {
    VueBootstrapTypeahead
  },
  async asyncData (): Promise<object> {
    const res = await getCompanies(new URLSearchParams({
      hasEmail: select.yes,
      'opts.limit': '20'
    }).toString())

    return {
      company: {
        items: res.companies,
        totalCount: res.totalCount
      }
    }
  },
  data (): any {
    return {
      breadcrumb: [{
        text: '🏠',
        to: {
          name: 'index'
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
        hasEmail: select.yes,
        hasPhone: select.any,
        hasOnline: select.yes,
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
        next: false
      }
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
      // @ts-ignore
      this.getCitiesHints(title)
    }, 500),
    'category.search': debounce(function (title: string) {
      // @ts-ignore
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
      this.loading.search = true
      const res = await getCompanies(this.buildQuery())
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
    buildQuery (): string {
      const q: any = {
        ...this.query,
        'opts.limit': 20
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
    safeAppStoreUrl (company) {
      return company.app?.appStore?.url
    },
    safeGooglePlayUrl (company) {
      return company.app?.googlePlay?.url
    },
    safeCategoryId (company) {
      return company.category?.id
    },
    safeCategoryTitle (company) {
      return company.category?.title
    },
    safeCategorySlug (company) {
      return company.category?.slug
    },
    safeLocationCityId (company) {
      return company.location?.city?.id
    },
    safeLocationCityTitle (company) {
      return company.location?.city?.title
    },
    safeLocationCitySlug (company) {
      return company.location?.city?.slug
    },
    safeLocationAddress (company) {
      return company.location?.address
    },
    safeSocialVkId (company) {
      return company.social?.vk?.groupId
    },
    safeSocialVkMembersCount (company) {
      return company.social?.vk?.membersCount
    },
    safeSocialInstagramUrl (company) {
      return company.social?.instagram?.url
    },
    safeSocialTwitterUrl (company) {
      return company.social?.twitter?.url
    },
    safeSocialYoutubeUrl (company) {
      return company.social?.youtube?.url
    },
    safeSocialFacebookUrl (company) {
      return company.social?.facebook?.url
    }
  }
})
</script>
