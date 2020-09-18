<template>
  <b-container
    fluid="xl"
    itemscope
  >
    <Header />
    <b-breadcrumb
      itemscope
      itemtype="https://schema.org/BreadcrumbList"
    >
      <b-breadcrumb-item
        v-for="(item, index) in breadcrumb"
        :key="item.id"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
        :to="item.to.path"
        :active="index === breadcrumb.length - 1"
      >
        <span itemprop="name">
          {{ item.text }}
        </span>

        <meta
          itemprop="item"
          itemscope
          itemtype="https://schema.org/WebPage"
          :itemid="`https://leaq.ru${index === 0 ? '' : item.to.path}`"
        >

        <meta
          itemprop="position"
          :content="item.id"
        >
      </b-breadcrumb-item>
    </b-breadcrumb>

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
              style="max-height: 200px; max-width: 200px"
            />
            <meta
              :content="company.avatar"
              itemprop="logo"
            >
          </template>
        </b-col>

        <b-col cols="6">
          <b-icon-globe />
          Сайт:
          <b-link
            itemprop="url"
            :href="company.url"
            target="_blank"
            rel="nofollow"
          >
            {{ company.url }}
          </b-link>

          <b-row class="mb-3" />

          <b-icon-building />
          Город:
          <b-link
            v-if="safeLocationCityTitle(company)"
            :to="`/${safeLocationCitySlug(company)}/all`"
          >
            {{ safeLocationCityTitle(company) }}
          </b-link>
          <template v-else>
            {{ none }}
          </template>

          <b-row />

          <b-icon-grid />
          Категория:
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

          <b-row class="mb-3" />

          <b-button
            pill
            :to="breadcrumb[2].to.path"
            variant="primary"
            size="sm"
          >
            Найти похожие компании
          </b-button>
        </b-col>
      </b-row>

      <b-card-group
        class="mb-3"
        deck
      >
        <b-card title="Контакты">
          <b-icon-envelope />
          Email:
          <template v-if="company.email">
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
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row />

          <b-icon-telephone />
          Телефон:
          <b-link
            v-if="company.phone"
            :href="`tel:${company.phone}`"
          >
            <span itemprop="telephone">
              {{ toShowedPhone(company.phone) }}
            </span>
          </b-link>
          <template v-else>
            {{ none }}
          </template>

          <b-row />

          <b-icon-map />
          Адрес:
          <span itemprop="address">
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
          </span>

          <b-row />

          <b-icon-clock />
          Обновлено: {{ toShowedDate(company.updatedAt) }}
        </b-card>

        <b-card title="Приложения">
          <fa
            color="#212529"
            :icon="['fab', 'app-store']"
          />
          App Store:
          <template v-if="safeAppStoreUrl(company)">
            <b-link
              :href="safeAppStoreUrl(company)"
              target="_blank"
              rel="nofollow"
            >
              {{ safeAppStoreUrl(company) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row />

          <fa
            color="#212529"
            :icon="['fab', 'google-play']"
          />
          Google Play:
          <template v-if="safeGooglePlayUrl(company)">
            <b-link
              :href="safeGooglePlayUrl(company)"
              target="_blank"
              rel="nofollow"
            >
              {{ safeGooglePlayUrl(company) }}
            </b-link>
          </template>
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
            <b-row>
              <b-col cols="2">
                <b-avatar
                  :href="`https://vk.com/club${safeSocialVkId(company)}`"
                  target="_blank"
                  rel="nofollow"
                  :src="company.social.vk.photo200"
                />
              </b-col>

              <b-col cols="10">
                <fa
                  color="#212529"
                  :icon="['fab', 'vk']"
                />
                Группа:
                <template v-if="safeSocialVkId(company)">
                  <b-link
                    :href="`https://vk.com/club${safeSocialVkId(company)}`"
                    target="_blank"
                    rel="nofollow"
                  >
                    https://vk.com/{{ safeSocialVkScreenName(company) }}
                  </b-link>

                  <b-row />

                  <b-icon-people />
                  Подписчиков:
                  {{ safeSocialVkMembersCount(company) || none }}
                </template>
                <template v-else>
                  {{ none }}

                  <b-row />

                  <b-icon-people />
                  Подписчиков:
                  {{ none }}
                </template>

                <b-row class="mb-3" />

                <b-icon-card-heading />
                Название:
                {{ company.social.vk.name }}

                <b-row class="mb-3" />

                <b-button
                  v-b-toggle.collapse-1
                  pill
                  variant="outline-primary"
                  size="sm"
                >
                  Раскрыть описание
                </b-button>
                <b-collapse id="collapse-1" class="mt-2">
                  {{ company.social.vk.description }}
                </b-collapse>
              </b-col>
            </b-row>
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
              class="d-flex align-items-center"
              itemscope
              itemtype="http://schema.org/Person"
              itemprop="employee"
            >
              <b-avatar
                itemprop="image"
                :href="p.vkId ? `https://vk.com/id${p.vkId}` : ''"
                :src="p.photo200"
                class="mr-3"
                target="_blank"
                rel="nofollow"
              />
              <span class="mr-auto">
                <b-icon-person-circle />
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

                <b-row />

                <fa
                  color="#212529"
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

                <b-icon-envelope />
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

                <b-icon-telephone />
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

                <b-icon-info-circle />
                <span
                  v-if="p.description"
                  itemprop="description"
                >
                  {{ p.description }}
                </span>
                <template v-else>
                  {{ none }}
                </template>
              </span>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-card-group>

      <b-card-group
        class="mb-3"
        deck
      >
        <b-card title="Соцсети">
          <fa
            color="#212529"
            :icon="['fab', 'instagram']"
          />
          Instagram:
          <template v-if="safeSocialInstagramUrl(company)">
            <b-link
              :href="safeSocialInstagramUrl(company)"
              target="_blank"
              rel="nofollow"
            >
              {{ safeSocialInstagramUrl(company) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row />

          <fa
            color="#212529"
            :icon="['fab', 'youtube']"
          />
          YouTube:
          <template v-if="safeSocialYoutubeUrl(company)">
            <b-link
              :href="safeSocialYoutubeUrl(company)"
              target="_blank"
              rel="nofollow"
            >
              {{ safeSocialYoutubeUrl(company) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row />

          <fa
            color="#212529"
            :icon="['fab', 'facebook']"
          />
          Facebook:
          <template v-if="safeSocialFacebookUrl(company)">
            <b-link
              :href="safeSocialFacebookUrl(company)"
              target="_blank"
              rel="nofollow"
            >
              {{ safeSocialFacebookUrl(company) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>

          <b-row />

          <fa
            color="#212529"
            :icon="['fab', 'twitter']"
          />
          Twitter:
          <template v-if="safeSocialTwitterUrl(company)">
            <b-link
              :href="safeSocialTwitterUrl(company)"
              target="_blank"
              rel="nofollow"
            >
              {{ safeSocialTwitterUrl(company) }}
            </b-link>
          </template>
          <template v-else>
            {{ none }}
          </template>
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

      <b-card-group deck>
        <b-card title="Реквизиты">
          ИНН: {{ company.inn || none }}
          <b-row />
          КПП: {{ company.kpp || none }}
          <b-row />
          ОГРН: {{ company.ogrn || none }}
        </b-card>

        <b-card title="Домен">
          <b-icon-cloud />
          Регистратор: {{ (company.domain && company.domain.registrar) || none }}

          <b-row />

          <b-icon-clock />
          Дата регистрации: {{ toShowedDate(company.domain && company.domain.registrationDate) || none }}

          <b-row />

          <b-icon-hdd />
          Адрес сервера: {{ (company.domain && company.domain.address) || none }}

          <b-row />

          <template v-if="company.online">
            <b-icon-circle-fill variant="success" />
            Сайт онлайн
          </template>
          <template v-else>
            <b-icon-circle-fill variant="danger" />
            Сайт офлайн
          </template>
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

    <template v-for="(_, i) in related">
      <template v-if="i % 2 === 0">
        <b-card-group
          :key="related[i].id"
          class="mb-4"
          deck
        >
          <Card :company="related[i]" />

          <Card
            v-if="related[i+1]"
            :company="related[i+1]"
          />
        </b-card-group>
      </template>
    </template>
    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import companyGetters from '~/helpers/company/companyGetters'
import apiAddr from '~/helpers/const/apiAddr'

const getRelated = async ({
  addr = apiAddr,
  company
}: {
  addr?: string
  company: any
}): Promise<any> => {
  const relatedCount = 6

  const queryRelated: any = {
    limit: (relatedCount + 1).toString()
  }
  if (company.location?.city?.id) {
    queryRelated.cityId = company.location.city.id
  }
  if (company.category?.id) {
    queryRelated.categoryId = company.category.id
  }

  const rawRelated = await fetch([
    addr,
    '/v1/company/getRelated?',
    new URLSearchParams(queryRelated).toString()
  ].join(''))

  const resRelated = await rawRelated.json()

  let relatedWithoutSelf = resRelated.companies.filter(({ id }) => id !== company.id)

  if (relatedWithoutSelf.length > relatedCount) {
    relatedWithoutSelf = relatedWithoutSelf.slice(0, relatedCount)
  }

  return relatedWithoutSelf
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

      const relatedWithoutSelf = await getRelated({
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
          text: resCompany.title,
          to: {
            path: `/company/${resCompany.slug}`
          }
        }],
        company: resCompany,
        related: relatedWithoutSelf,
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
      none: '—'
    }
  },
  methods: {
    ...companyGetters
  },
  head () {
    return {
      title: this.title
    }
  }
})
</script>
