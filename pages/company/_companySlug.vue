<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <span
      itemscope
      itemtype="http://schema.org/Organization"
    >
      <h1 itemprop="name">
        {{ company.title || company.slug }}
      </h1>

      <b-row class="mb-3">
        <b-col cols="6">
          <template v-if="company.avatar">
            <b-img-lazy
              fluid-grow
              thumbnail
              :alt="`Логотип ${company.url}`"
              :src="company.avatar"
              class="mw-mh-200"
            />
            <meta
              :content="company.avatar"
              itemprop="logo"
            >
          </template>
        </b-col>

        <b-col cols="6">
          <span class="text-muted">
            <b-icon-building />
            Город
          </span>

          <div class="ml-21">
            <b-link
              v-if="safeLocationCityTitle(company)"
              :to="`/${safeLocationCitySlug(company)}/all`"
            >
              {{ safeLocationCityTitle(company) }}
            </b-link>
            <template v-else>
              {{ none }}
            </template>
          </div>

          <b-row class="mb-1" />

          <span class="text-muted">
            <b-icon-grid />
            Категория
          </span>

          <div class="ml-21">
            <b-link
              v-if="safeCategoryTitle(company)"
              :to="`/all/${safeCategorySlug(company)}`"
            >
              {{ safeCategoryTitle(company) }}
            </b-link>
            <template v-else>
              <b-icon-grid />
              {{ none }}
            </template>
          </div>

          <b-row class="mb-1" />

          <span class="text-muted">
            <b-icon-globe />
            Сайт
          </span>

          <b-row />

          <div class="ml-21">
            <b-link
              itemprop="url"
              :href="company.url"
              target="_blank"
              rel="nofollow"
            >
              {{ company.url }}
            </b-link>
          </div>

          <b-row class="mb-3" />

          <b-button
            pill
            :to="breadcrumb[2].to.path"
            variant="primary"
            size="sm"
          >
            <b-icon-tags />
            Найти похожие
          </b-button>
        </b-col>
      </b-row>

      <b-card-group
        class="mb-3"
        deck
      >
        <b-card title="Контакты">
          <b-row>
            <b-col
              md="6"
              class="mb-1"
            >
              <span class="text-muted">
                <b-icon-envelope />
                Email
              </span>

              <b-row />

              <div
                v-if="company.email"
                class="ml-21"
              >
                <b-link
                  :href="`mailto:${company.email}?Subject=Вопрос с сайта https://leaq.ru`"
                  target="_blank"
                >
                  {{ company.email }}
                </b-link>
                <meta
                  :content="company.email"
                  itemprop="email"
                >
              </div>
              <div
                v-else
                class="ml-21"
              >
                {{ none }}
              </div>
            </b-col>

            <b-col
              md="6"
              class="mb-1"
            >
              <span class="text-muted">
                <b-icon-telephone />
                Телефон
              </span>

              <b-row />

              <div
                v-if="company.phone"
                class="ml-21"
              >
                <b-link
                  :href="`tel:${company.phone}`"
                >
                  <span itemprop="telephone">
                    {{ toShowedPhone(company.phone) }}
                  </span>
                </b-link>
              </div>
              <div
                v-else
                class="ml-21"
              >
                {{ none }}
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col
              md="6"
              class="mb-1"
            >
              <span class="text-muted">
                <b-icon-map />
                Адрес
              </span>

              <b-row />

              <div
                class="ml-21"
                itemprop="address"
              >
                <b-link
                  v-if="safeLocationCityTitle(company)"
                  :to="`/${safeLocationCitySlug(company)}/all`"
                >
                  {{ safeLocationCityTitle(company) }},
                </b-link>
                <template v-else>
                  {{ none }},
                </template>

                {{ safeLocationAddress(company) || none }},

                {{ safeLocationAddressTitle(company) || none }}
              </div>
            </b-col>

            <b-col
              md="6"
              class="mb-1"
            >
              <span class="text-muted">
                <b-icon-clock />
                Обновлено
              </span>

              <b-row />

              <div class="ml-21">{{ toShowedDate(company.updatedAt) }}</div>
            </b-col>
          </b-row>
        </b-card>

        <b-card title="Описание">
          <span
            v-if="company.description"
            itemprop="description"
          >
            {{ company.description }}
          </span>

          <template v-else>
            {{ none }}
          </template>
        </b-card>
      </b-card-group>

      <b-card-group
        class="mb-3"
        deck
      >
        <b-card title="ВКонтакте">
          <template v-if="safeSocialVkId(company)">
            <b-row class="mb-3">
              <b-col md="5">
                <b-avatar
                  :src="safeSocialVkPhoto200(company)"
                  :href="`https://vk.com/club${safeSocialVkId(company)}`"
                  target="_blank"
                  rel="nofollow"
                  size="120px"
                  rounded="lg"
                  class="mb-3"
                />
              </b-col>

              <b-col md="7">
                <span class="text-muted">
                  <b-icon-card-heading />
                  Название
                </span>

                <b-row />

                <div class="ml-21">
                  {{ company.social.vk.name }}
                </div>

                <b-row class="mt-1" />

                <span class="text-muted">
                  <fa :icon="['fab', 'vk']" />
                  Группа
                </span>

                <b-row />

                <div class="ml-21">
                  <b-link
                    :href="`https://vk.com/club${safeSocialVkId(company)}`"
                    target="_blank"
                    rel="nofollow"
                  >
                    https://vk.com/{{ safeSocialVkScreenName(company) }}
                  </b-link>
                </div>

                <b-row class="mt-1" />

                <span class="text-muted">
                  <b-icon-people />
                  Подписчиков
                </span>

                <b-row />

                <div class="ml-21">
                  {{ safeSocialVkMembersCount(company) || 0 }}
                </div>
                <b-row />
              </b-col>
            </b-row>

            <span class="text-muted">
              <b-icon-list />
              Описание
            </span>

            <b-row />

            <div class="ml-21">
              {{ company.social.vk.description }}
            </div>
          </template>
          <template v-else>
            {{ none }}
          </template>
        </b-card>

        <b-card title="Менеджеры">
          <template v-if="!company.people || !company.people.length">
            {{ none }}
          </template>
          <b-list-group>
            <b-list-group-item
              v-for="(p, index) in company.people"
              :key="index"
              itemscope
              itemtype="http://schema.org/Person"
              itemprop="employee"
            >
              <div class="mb-3">
                <b-avatar
                  itemprop="image"
                  :href="p.vkId ? `https://vk.com/id${p.vkId}` : ''"
                  :src="p.photo200"
                  class="mr-2"
                  target="_blank"
                  rel="nofollow"
                />

                <span
                  v-if="p.firstName"
                  itemprop="givenName"
                >
                  {{ p.firstName }}
                </span>
                <span v-else>
                  {{ none }}
                </span>

                <span
                  v-if="p.lastName"
                  itemprop="familyName"
                >
                  {{ p.lastName }}
                </span>
                <span v-else>
                  {{ none }}
                </span>
              </div>

              <b-row />

              <fa
                class="text-muted"
                :icon="['fab', 'vk']"
              />
              <b-link
                v-if="p.vkId"
                itemprop="url"
                :href="`https://vk.com/id${p.vkId}`"
                target="_blank"
                rel="nofollow"
              >
                {{ `https://vk.com/id${p.vkId}` }}
              </b-link>
              <template v-else>
                {{ none }}
              </template>

              <b-row />

              <b-icon-envelope class="text-muted" />
              <template v-if="p.email">
                <b-link
                  :href="`mailto:${p.email}?Subject=Вопрос с сайта https://leaq.ru`"
                  target="_blank"
                >
                  {{ p.email }}
                </b-link>
                <meta
                  itemprop="email"
                  :content="p.email"
                >
              </template>
              <template v-else>
                {{ none }}
              </template>

              <b-row />

              <b-icon-telephone class="text-muted" />
              <b-link
                v-if="p.phone"
                :href="`tel:${p.phone}`"
                target="_blank"
              >
                <span itemprop="telephone">
                  {{ toShowedPhone(p.phone) }}
                </span>
              </b-link>
              <template v-else>
                {{ none }}
              </template>

              <b-row />

              <b-icon-info-circle class="text-muted" />
              <span
                v-if="p.description"
                itemprop="description"
              >
                {{ p.description }}
              </span>
              <template v-else>
                {{ none }}
              </template>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-card-group>

      <b-card-group
        class="mb-3"
        deck
      >
        <b-card title="Соцсети">
          <b-row>
            <b-col
              class="mb-1"
              md="6"
            >
              <span class="text-muted">
                <fa :icon="['fab', 'instagram']" />
                Instagram
              </span>

              <b-row />

              <div
                v-if="safeSocialInstagramUrl(company)"
                class="ml-21"
              >
                <b-link
                  :href="safeSocialInstagramUrl(company)"
                  target="_blank"
                  rel="nofollow"
                >
                  {{ safeSocialInstagramUrl(company) }}
                </b-link>
              </div>
              <div
                v-else
                class="ml-21"
              >
                {{ none }}
              </div>
            </b-col>

            <b-col
              class="mb-1"
              md="6"
            >
              <span class="text-muted">
                <fa :icon="['fab', 'youtube']" />
                YouTube
              </span>

              <b-row />

              <div
                v-if="safeSocialYoutubeUrl(company)"
                class="ml-21"
              >
                <b-link
                  :href="safeSocialYoutubeUrl(company)"
                  target="_blank"
                  rel="nofollow"
                >
                  {{ safeSocialYoutubeUrl(company) }}
                </b-link>
              </div>
              <div
                v-else
                class="ml-21"
              >
                {{ none }}
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col
              class="mb-1"
              md="6"
            >
              <span class="text-muted">
                <fa :icon="['fab', 'facebook']" />
                Facebook
              </span>

              <b-row />

              <div
                v-if="safeSocialFacebookUrl(company)"
                class="ml-21"
              >
                <b-link
                  :href="safeSocialFacebookUrl(company)"
                  target="_blank"
                  rel="nofollow"
                >
                  {{ safeSocialFacebookUrl(company) }}
                </b-link>
              </div>
              <div
                v-else
                class="ml-21"
              >
                {{ none }}
              </div>
            </b-col>

            <b-col
              class="mb-1"
              md="6"
            >
              <span class="text-muted">
                <fa :icon="['fab', 'twitter']" />
                Twitter
              </span>

              <b-row />

              <div
                v-if="safeSocialTwitterUrl(company)"
                class="ml-21"
              >
                <b-link
                  :href="safeSocialTwitterUrl(company)"
                  target="_blank"
                  rel="nofollow"
                >
                  {{ safeSocialTwitterUrl(company) }}
                </b-link>
              </div>
              <div
                v-else
                class="ml-21"
              >
                {{ none }}
              </div>
            </b-col>
          </b-row>

        </b-card>

        <b-card title="Приложения">
          <b-row>
            <b-col
              class="mb-1"
              md="6"
            >
              <span class="text-muted">
                <fa :icon="['fab', 'app-store']" />
                App Store
              </span>

              <b-row />

              <div
                v-if="safeAppStoreUrl(company)"
                class="ml-21"
              >
                <b-link
                  :href="safeAppStoreUrl(company)"
                  target="_blank"
                  rel="nofollow"
                >
                  {{ safeAppStoreUrl(company) }}
                </b-link>
              </div>
              <div
                v-else
                class="ml-21"
              >
                {{ none }}
              </div>
            </b-col>

            <b-col
              class="mb-1"
              md="6"
            >
              <span class="text-muted">
                <fa :icon="['fab', 'google-play']" />
                Google Play:
              </span>

              <b-row />

              <div
                v-if="safeGooglePlayUrl(company)"
                class="ml-21"
              >
                <b-link
                  :href="safeGooglePlayUrl(company)"
                  target="_blank"
                  rel="nofollow"
                >
                  {{ safeGooglePlayUrl(company) }}
                </b-link>
              </div>
              <div
                v-else
                class="ml-21"
              >
                {{ none }}
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-card-group>

      <b-card-group deck>
        <b-card title="Реквизиты">
          <b-row>
            <IconHeader
              icon="info-circle"
              header="ИНН"
              :body="company.inn"
            />

            <IconHeader
              icon="info-circle"
              header="КПП"
              :body="company.kpp"
            />
          </b-row>

          <b-row>
            <IconHeader
              icon="info-circle"
              header="ОГРН"
              :body="company.ogrn"
            />
          </b-row>
        </b-card>

        <b-card title="Домен">
          <b-row>
            <IconHeader
              icon="cloud"
              header="Регистратор"
              :body="(company.domain && company.domain.registrar) || none"
            />

            <IconHeader
              icon="clock"
              header="Дата регистрации"
              :body="toShowedDate(company.domain && company.domain.registrationDate) || none"
            />
          </b-row>

          <b-row>
            <IconHeader
              icon="hdd"
              header="Адрес сервера"
              :body="(company.domain && company.domain.address) || none"
            />

            <b-col
              class="mb-1"
              md="6"
            >
              <template v-if="company.online">
                <b-icon-circle-fill variant="success" />
                Сайт онлайн
              </template>
              <template v-else>
                <b-icon-circle-fill variant="danger" />
                Сайт офлайн
              </template>
            </b-col>
          </b-row>
        </b-card>
      </b-card-group>
    </span>

    <b-row class="mt-5 mb-3">
      <b-col>
        <h2>
          Похожие компании
        </h2>
      </b-col>
    </b-row>

    <CardDeck :items="related" />

    <client-only v-if="related.length >= 6 && !scrollDone">
      <infinite-loading
        spinner="spiral"
        :distance="1000"
        @infinite="collectionInfiniteScroll"
      />
    </client-only>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import companyGetters from '~/helpers/company/companyGetters'
import apiAddr from '~/helpers/const/apiAddr'

const getRelated = async ({
  addr = apiAddr,
  company,
  limit,
  fromId
}: {
  addr?: string
  company: any
  limit: number
  fromId?: string
}): Promise<any> => {
  const queryRelated = new URLSearchParams()
  queryRelated.append('opts.limit', limit.toString())
  queryRelated.append('excludeIds', company.id)
  if (company.location?.city?.id) {
    queryRelated.append('cityIds', company.location.city.id)
  }
  if (company.category?.id) {
    queryRelated.append('categoryIds', company.category.id)
  }
  if (fromId) {
    queryRelated.append('opts.fromId', fromId)
  }

  const rawRelated = await fetch([
    addr,
    '/v1/company/get?',
    queryRelated.toString()
  ].join(''))

  const resRelated = await rawRelated.json()

  return resRelated.companies
}

const makeTitle = (company: any): string => {
  const elems = [company.title || company.slug]

  if (companyGetters.safeLocationCityTitle(company)) {
    elems.push(companyGetters.safeLocationCityTitle(company))
  }

  if (companyGetters.safeCategoryTitle(company)) {
    elems.push(companyGetters.safeCategoryTitle(company))
  }

  elems.push('Каталог компаний LEAQ')
  return elems.join(' / ')
}

export default Vue.extend({
  async asyncData ({ error, params }): Promise<any> {
    try {
      if (!params.companySlug) {
        return error({
          statusCode: 404
        })
      }

      const rawCompany = await fetch([
        apiAddr,
        '/v1/company/getBySlug?',
        new URLSearchParams({
          slug: params.companySlug
        }).toString()
      ].join(''))

      if (!rawCompany.ok) {
        return error({
          statusCode: 404
        })
      }

      const resCompany = await rawCompany.json()

      const related = await getRelated({
        limit: 6,
        company: resCompany
      })

      const data = {
        breadcrumb: [{
          id: 1,
          text: '🏠',
          to: {
            path: '/'
          }
        }, {
          id: 2,
          text: 'Все города',
          to: {
            path: '/all/all'
          }
        }, {
          id: 3,
          text: 'Все категории',
          to: {
            path: '/all/all'
          }
        }, {
          id: 4,
          text: resCompany.title || resCompany.slug,
          to: {
            path: `/company/${resCompany.slug}`
          }
        }],
        company: resCompany,
        related,
        title: makeTitle(resCompany)
      }

      if (resCompany.location?.city) {
        data.breadcrumb[1].text = resCompany.location.city.title
        const toElems = data.breadcrumb[1].to.path.split('/')
        toElems[1] = resCompany.location.city.slug
        data.breadcrumb[1].to.path = toElems.join('/')
      }
      if (resCompany.category) {
        data.breadcrumb[2].text = resCompany.category.title
        const toElems = data.breadcrumb[1].to.path.split('/')
        toElems[1] = resCompany.location?.city?.slug || 'all'
        toElems[2] = resCompany.category.slug
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
      scrollDone: false
    }
  },
  computed: {
    fromId (): string | undefined {
      if (this.related?.length) {
        return this.related[this.related.length - 1].id
      }
      return undefined
    }
  },
  methods: {
    ...companyGetters,
    async collectionInfiniteScroll ($state) {
      const res = await getRelated({
        company: this.company,
        limit: 20,
        fromId: this.fromId
      })

      if (res?.length) {
        this.related.push(...res)
      } else {
        this.scrollDone = true
      }
      $state.loaded()
    }
  },
  head () {
    return {
      title: this.title
    }
  }
})
</script>

<style>
.ml-21 {
  margin-left: 21px;
}

.mw-mh-200 {
  max-width: 200px;
  max-height: 200px;
}
</style>
