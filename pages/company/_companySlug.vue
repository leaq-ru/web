<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <span
      itemscope
      itemtype="http://schema.org/Organization"
    >
      <b-row class="mt-3 mb-2">
        <b-col>
          <h1 itemprop="name">
            <PatchCheck v-if="verified" />

            {{ company.title || company.slug }}
          </h1>
        </b-col>
      </b-row>

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

            <span
              itemscope
              itemtype="http://schema.org/ImageObject"
            >
              <meta
                :content="`Логотип ${company.url}`"
                itemprop="name"
              >

              <link
                :href="company.avatar"
                itemprop="contentUrl"
              >

              <template v-if="company.description">
                <meta
                  :content="company.description"
                  itemprop="description"
                >
              </template>
            </span>
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
        <b-card title="📍 Контакты">
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
                  @click="setTipFoundOnLeaq"
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
                  @click="setTipFoundOnLeaq"
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

          <template v-if="showTipFoundOnLeaq">
            <TipFoundOnLeaq />
          </template>
        </b-card>

        <b-card title="⌨️ Описание">
          <span
            v-if="company.description"
            itemprop="description"
          >
            <TextSpoiler :text="company.description" />
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
        <b-card title="🛠️ Технологии на сайте">
          <template v-if="technologyCategories && technologyCategories.length">
            <span
              v-for="(c, index) in technologyCategories"
              :key="c.id"
            >
              <b-row v-if="index % 2 === 0">
                <b-col
                  sm="6"
                  class="mb-1"
                >
                  <span class="text-muted">
                    <b-icon-gear />
                    {{ technologyCategories[index].name }}
                  </span>

                  <b-row />

                  <div class="ml-21">
                    <span
                      v-for="(t, i) in technologyCategories[index].technologies"
                      :key="t.id"
                    >
                      <b-link
                        pill
                        variant="link"
                        :to="`/technology/${t.slug}`"
                      >
                        {{ t.version ? `${t.name} ${t.version}` : t.name }}</b-link><template v-if="safeTechnologyCategoriesLength(technologyCategories[index])-1!==i">,</template>
                    </span>
                  </div>
                </b-col>

                <b-col
                  v-if="technologyCategories[index+1]"
                  sm="6"
                  class="mb-1"
                >
                  <span class="text-muted">
                    <b-icon-gear />
                    {{ technologyCategories[index+1].name }}
                  </span>

                  <b-row />

                  <div class="ml-21">
                    <span
                      v-for="(t, i) in technologyCategories[index+1].technologies"
                      :key="t.id"
                    >
                      <b-link
                        pill
                        variant="link"
                        :to="`/technology/${t.slug}`"
                      >
                        {{ t.version ? `${t.name} ${t.version}` : t.name }}</b-link><template v-if="safeTechnologyCategoriesLength(technologyCategories[index+1])-1!==i">,</template>
                    </span>
                  </div>
                </b-col>
              </b-row>
            </span>
          </template>
          <template v-else>
            {{ none }}
          </template>
        </b-card>

        <b-card title="🔗 Домен">
          <b-row>
            <IconHeader
              icon="cloud"
              header="Регистратор"
              :body="(company.domain && company.domain.registrar) || none"
            />

            <IconHeader
              icon="clock"
              header="Дата регистрации"
              :body="company.domain && company.domain.registrationDate ? toShowedDate(company.domain.registrationDate) : none"
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

          <b-row>
            <IconHeader
              icon="cloud-download"
              header="Скорость загрузки"
              :body="pageSpeed ? `${pageSpeed} сек` : none"
            />
          </b-row>
        </b-card>
      </b-card-group>

      <b-card-group
        class="mb-3"
        deck
      >
        <b-card title="😎 ВКонтакте">
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
                  {{ safeSocialVkName(company) }}
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
              <TextSpoiler :text="company.social.vk.description || none" />
            </div>
          </template>
          <template v-else>
            {{ none }}
          </template>
        </b-card>

        <b-card title="👨‍💻 Менеджеры">
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
        <b-card title="👍 Соцсети">
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

        <b-card title="📱 Приложения">
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
        <b-card title="🇷🇺 Реквизиты">
          <b-row>
            <IconHeader
              icon="info-circle"
              header="ИНН"
              :body="(company.inn || '').toString()"
            />

            <IconHeader
              icon="info-circle"
              header="КПП"
              :body="(company.kpp || '').toString()"
            />
          </b-row>

          <b-row>
            <IconHeader
              icon="info-circle"
              header="ОГРН"
              :body="(company.ogrn || '').toString()"
            />
          </b-row>
        </b-card>

        <b-card
          v-if="!verified"
          title="🤔 Это ваша компания?"
        >
          <p class="text-muted">
            Подтверите права чтобы управлять информацией о компании и получить знак

            <PatchCheck />
          </p>

          <b-button
            pill
            variant="outline-primary"
            rel="nofollow"
            :to="`/account/companies/apply?url=${company.url.slice(7)}`"
          >
            <b-icon-check2-circle />

            Подтвердить
          </b-button>
        </b-card>
        <b-card
          v-else
          title="🤔 Не нашли что искали?"
        >
          <a
            href="https://vk.me/leaq_ru"
            rel="nofollow"
            target="_blank"
          >
            Напишите нам
          </a>
        </b-card>
      </b-card-group>
    </span>

    <template v-if="posts.length">
      <b-row class="mt-5 mb-2">
        <b-col>
          <h2>
            Новости компании
          </h2>
        </b-col>
      </b-row>

      <PostCardDeck
        :avatar="safeSocialVkPhoto200(company)"
        :title="safeSocialVkName(company)"
        :items="posts"
      />
      <b-button
        v-if="posts.length >= 6 && !postsScrollDone && postsLoaded"
        pill
        variant="primary"
        @click="getPosts"
      >
        <b-icon-arrow-clockwise
          v-if="postsLoading"
          animation="spin"
        />
        <b-icon-arrow-down-circle v-else />

        Показать еще
      </b-button>
    </template>

    <b-row
      v-if="related && related.length"
      class="mt-5 mb-2"
    >
      <b-col>
        <h2>
          Похожие компании
        </h2>
      </b-col>
    </b-row>

    <CardDeck :items="related" />

    <client-only v-if="related && related.length >= 6 && !relatedScrollDone">
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
  skip
}: {
  addr?: string
  company: any
  limit: number
  skip: number
}): Promise<any> => {
  const queryRelated = new URLSearchParams()
  queryRelated.append('opts.limit', limit.toString())
  if (company.location?.city?.id) {
    queryRelated.append('cityIds', company.location.city.id)
  }
  if (company.category?.id) {
    queryRelated.append('categoryIds', company.category.id)
  }
  if (skip) {
    queryRelated.append('opts.skip', skip.toString())
  }

  const rawRelated = await fetch([
    addr,
    '/v2/company/get?',
    queryRelated.toString()
  ].join(''))

  const resRelated = await rawRelated.json()

  return resRelated.companies || []
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

const makeDescription = (company: any): string => {
  if (!company) {
    return ''
  }

  const result = 'Контакты компании: '
  const contacts = []
  if (company.phone) {
    contacts.push(`телефон ${companyGetters.toShowedPhone(company.phone)}`)
  }
  if (company.email) {
    contacts.push(`email ${company.email}`)
  }

  const sn = companyGetters.safeSocialVkScreenName(company)
  if (sn) {
    contacts.push(`ВКонтакте https://vk.com/${sn}`)
  }

  let desc = ''
  if (companyGetters.safeSocialVkDescription(company)) {
    desc = companyGetters.safeSocialVkDescription(company)
  }
  if (!desc && company.description) {
    desc = company.description
  }
  if (!desc) {
    desc = 'самая подробная информация о компании, сотрудниках, адрес и контакты'
  }

  return result.concat(contacts.join(', '), '. ', `${desc}`)
}

const makePageSpeed = (num: number): string => {
  if (!num) {
    return ''
  }

  const strNum = num.toString()

  if (strNum.length > 4) {
    return `${strNum[0]}.${strNum.slice(1)}`
  }
  return `0.${strNum.slice(1)}`
}

export default Vue.extend({
  async asyncData ({ error, params }): Promise<any> {
    try {
      if (!params.companySlug) {
        return error({
          statusCode: 404
        })
      }

      const raw = await fetch([
        apiAddr,
        '/v2/company/getBySlug?',
        new URLSearchParams({
          slug: params.companySlug
        }).toString()
      ].join(''))

      if (!raw.ok) {
        return error({
          statusCode: 404
        })
      }

      const {
        fullCompany,
        pageSpeed,
        technologyCategories = [],
        related = [],
        posts = [],
        verified = false
      } = await raw.json()

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
          text: fullCompany.title || fullCompany.slug,
          to: {
            path: `/company/${fullCompany.slug}`
          }
        }],
        title: makeTitle(fullCompany),
        description: makeDescription(fullCompany),
        company: fullCompany,
        related,
        pageSpeed: makePageSpeed(pageSpeed),
        technologyCategories,
        posts,
        verified
      }

      if (fullCompany.location?.city) {
        data.breadcrumb[1].text = fullCompany.location.city.title
        const toElems = data.breadcrumb[1].to.path.split('/')
        toElems[1] = fullCompany.location.city.slug
        data.breadcrumb[1].to.path = toElems.join('/')
      }
      if (fullCompany.category) {
        data.breadcrumb[2].text = fullCompany.category.title
        const toElems = data.breadcrumb[1].to.path.split('/')
        toElems[1] = fullCompany.location?.city?.slug || 'all'
        toElems[2] = fullCompany.category.slug
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
      showTipFoundOnLeaq: false,
      postsLoading: false,
      postsLoaded: true,
      postsScrollDone: false
    }
  },
  computed: {
    relatedSkip (): number | undefined {
      return this.related?.length
    },
    postsSkip (): number | undefined {
      return this.posts?.length
    }
  },
  methods: {
    ...companyGetters,
    setTipFoundOnLeaq () {
      this.showTipFoundOnLeaq = true
    },
    async collectionInfiniteScroll ($state) {
      const res = await getRelated({
        company: this.company,
        limit: 20,
        skip: this.relatedSkip
      })

      if (res?.length) {
        this.related.push(...res)
      } else {
        this.relatedScrollDone = true
      }
      $state.loaded()
    },
    async getPosts (): Promise<void> {
      const limit = 20

      const query = new URLSearchParams()
      query.append('companyId', this.company.id)
      query.append('opts.limit', limit.toString())
      if (this.postsSkip) {
        query.append('opts.skip', this.postsSkip)
      }

      this.postsLoading = true
      const raw = await fetch([
        process.env.API_HOST,
        '/v1/post/get?',
        query.toString()
      ].join(''))
      const res = await raw.json()
      this.postsLoading = false

      this.postsLoaded = false
      this.posts.push(...res.posts)
      setTimeout(() => {
        this.postsLoaded = true
      }, 0)
      if (res?.posts?.length < limit) {
        this.postsScrollDone = true
      }
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

.mw-mh-200 {
  max-width: 200px;
  max-height: 200px;
}
</style>
