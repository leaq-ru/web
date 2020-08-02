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
    <b-card bg-variant="default">
      <b-form-group label="Город">
        <vue-bootstrap-typeahead
          v-model="city.search"
          :data="city.list"
          :serializer="s => s.title"
          placeholder="Все"
          @hit="city.selected = $event"
        />
      </b-form-group>

      <b-form-group label="Категория">
        <vue-bootstrap-typeahead
          v-model="category.search"
          :data="category.list"
          :serializer="s => s.title"
          placeholder="Все"
          @hit="category.selected = $event"
        />
      </b-form-group>

      <b-form-group>
        <b-form-checkbox v-model="hasPhone">
          Телефон указан
        </b-form-checkbox>
        <b-form-checkbox v-model="hasEmail">
          Email указан
        </b-form-checkbox>
      </b-form-group>

      <b-button
        pill
        block
        variant="primary"
        :disabled="searchLoading"
        @click="methodGetCompanies"
      >
        <b-icon
          v-if="searchLoading"
          icon="arrow-clockwise"
          animation="spin"
        />
        <template v-else>
          Найти
        </template>
      </b-button>
    </b-card>

    <h3 class="pt-3 pb-3">
      Найдено
      <span class="text-muted">
        {{ company.totalCount || 0 }}
      </span>
      компаний
    </h3>

    <b-row>
      <template v-for="(c, index) in company.items">
        <div
          v-if="index % 3 === 0"
          :key="c.id"
          class="w-100"
        />

        <b-card
          :key="c.id"
          :title="c.title || c.slug"
          :img-src="c.avatar || 'https://vk.com/images/camera_200.png?ava=1'"
          img-top
          class="mb-3 col-md-3"
        >
          <b-card-text>
            <p>
              <b-icon
                icon="telephone"
                aria-hidden="true"
              />
              {{ toShowedPhone(c.phone) }}
            </p>

            <p>
              <b-icon
                icon="envelope"
                aria-hidden="true"
              />
              {{ c.email }}
            </p>
            url={{ c.url }}
            online={{ c.online }}
            desc={{ c.description }}
            location={{ c.location }}
          </b-card-text>
        </b-card>
      </template>
    </b-row>

    <b-row v-if="nextLoading" class="text-center">
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

type item = {
  list: Array<any>
  search: string
  selected?: {
    id: string
    title: string
    slug: string
  }
}

type data = {
  breadcrumb: Array<{
    text: string
    to: {
      name: string
    }
  }>
  city: item
  category: item
  hasPhone: boolean
  hasEmail: boolean
  company?: {
    items: Array<any>
    totalCount: number
  }
  searchLoading: boolean
  nextLoading: boolean
}

const getCompanies = async ({
  hasPhone,
  hasEmail,
  fromId,
  city,
  category
}: {
  hasPhone: boolean,
  hasEmail: boolean,
  fromId?: string,
  city?: item,
  category?: item
}) => {
  try {
    const query: any = {
      hasPhone: String(hasPhone),
      hasEmail: String(hasEmail),
      'opts.limit': '20'
    }

    if (city?.selected?.id) {
      query.cityId = city.selected.id
    }

    if (category?.selected?.id) {
      query.categoryId = category.selected.id
    }

    if (typeof fromId !== 'undefined') {
      query.fromId = fromId
    }

    const rawCompanies = await fetch([
      process.env.API_HOST,
      '/v1/company/get?',
      new URLSearchParams(query).toString()
    ].join(''))

    const result = await rawCompanies.json()
    return result
  } catch {
    return {
      shortCompanies: [],
      totalCount: 0
    }
  }
}

export default Vue.extend({
  components: {
    VueBootstrapTypeahead
  },
  async asyncData (): Promise<object> {
    const res = await getCompanies({
      hasPhone: true,
      hasEmail: true
    })

    return {
      company: {
        items: res.shortCompanies,
        totalCount: res.totalCount
      }
    }
  },
  data (): data {
    return {
      breadcrumb: [{
        text: '🏠',
        to: {
          name: 'index'
        }
      }],
      city: {
        list: [],
        search: '',
        selected: undefined
      },
      category: {
        list: [],
        search: '',
        selected: undefined
      },
      hasPhone: true,
      hasEmail: true,
      searchLoading: false,
      nextLoading: false
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
    }, 500)
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
    async methodGetCompanies () {
      if (this.city.search === '') {
        this.city.selected = undefined
      }
      if (this.category.search === '') {
        this.category.selected = undefined
      }

      this.searchLoading = true
      const res = await getCompanies({
        hasPhone: this.hasPhone,
        hasEmail: this.hasEmail,
        city: this.city,
        category: this.category,
        fromId: this.fromId
      })
      this.searchLoading = false

      if (typeof this.company === 'undefined') {
        this.company = {
          items: [],
          totalCount: 0
        }
      }

      this.company.items = res.shortCompanies
      this.company.totalCount = res.totalCount
    },
    toShowedPhone (phone: number): string {
      const str = String(phone)
      if (str.length !== 11) {
        return '+' + str
      }

      let r = '+'
      str.split('').forEach((elem, i) => {
        switch (i) {
          case 1:
            r += ' (' + elem
            break
          case 3:
            r += elem + ') '
            break
          case 6:
            r += elem + '-'
            break
          case 8:
            r += elem + '-'
            break
          default:
            r += elem
        }
      })
      return r
    }
  }
})
</script>
