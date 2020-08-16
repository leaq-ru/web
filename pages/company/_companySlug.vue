<template>
  <b-container fluid="xl">
    <Header />
    <b-breadcrumb :items="breadcrumb" />

    <h1>{{ company.title }}</h1>

    <b-row class="mb-3">
      <b-col cols="6">
        <b-img-lazy
          v-if="company.avatar"
          fluid-grow
          thumbnail
          :alt="`Логотип ${company.url}`"
          :src="company.avatar"
          style="max-height: 200px; max-width: 200px"
        />
      </b-col>

      <b-col cols="6">
        <b-icon-globe />
        Сайт:
        <b-link
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
        <b-link
          v-if="company.email"
          :href="`mailto:${company.email}?Subject=Вопрос с сайта https://leaq.ru`"
          target="_blank"
        >
          {{ company.email }}
        </b-link>
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
          {{ toShowedPhone(company.phone) }}
        </b-link>
        <template v-else>
          {{ none }}
        </template>

        <b-row />

        <b-icon-map />
        Адрес:
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
          >
            <b-avatar
              :href="p.vkId ? `https://vk.com/id${p.vkId}` : ''"
              :src="p.photo200"
              class="mr-3"
              target="_blank"
              rel="nofollow"
            />
            <span class="mr-auto">
              <b-icon-person-circle />
              {{ p.firstName || none }} {{ p.lastName || none }}

              <b-row />

              <fa
                color="#212529"
                :icon="['fab', 'vk']"
              />
              <b-link
                v-if="p.vkId"
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
              </template>
              <template v-else>
                {{ none }}
              </template>

              <b-row />

              <b-icon-telephone />
              <template v-if="p.phone">
                <b-link
                  :href="`tel:${p.phone}`"
                  target="_blank"
                >
                  {{ toShowedPhone(p.phone) }}
                </b-link>
              </template>
              <template v-else>
                {{ none }}
              </template>

              <b-row />

              <b-icon-info-circle />
              <template v-if="p.description">
                {{ p.description }}
              </template>
              <template v-else>
                {{ none }}
              </template>
            </span>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-card-group>

    <b-card-group deck>
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
        {{ company.description || none }}
      </b-card>
    </b-card-group>

    <h2 class="mt-3">
      Похожие компании (показать другие)
    </h2>
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

    <h2 class="mt-3">
      Комментарии
    </h2>
    <script type="text/javascript" src="https://vk.com/js/api/openapi.js?168" />
    <script type="text/javascript">
      VK.init({apiId: 7569114, onlyWidgets: true});
    </script>
    <div id="vk_comments" />
    <script type="text/javascript">
      VK.Widgets.Comments('vk_comments', {limit: 20, attach: '*'});
    </script>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import companyGetters from '~/helpers/companyGetters'

export default Vue.extend({
  async asyncData ({ error, params }): Promise<any> {
    try {
      if (!params.companySlug) {
        return error({
          statusCode: 404
        })
      }

      const rawCompany = await fetch([
        process.env.API_HOST,
        '/v1/company/getBySlug?',
        new URLSearchParams({
          slug: params.companySlug
        }).toString()
      ].join(''))

      const resCompany = await rawCompany.json()

      const queryRelated: any = {
        limit: '5'
      }
      if (resCompany.location?.city?.id) {
        queryRelated.cityId = resCompany.location.city.id
      }
      if (resCompany.category?.id) {
        queryRelated.categoryId = resCompany.category.id
      }

      const rawRelated = await fetch([
        process.env.API_HOST,
        '/v1/company/getRelated?',
        new URLSearchParams(queryRelated).toString()
      ].join(''))

      const resRelated = await rawRelated.json()

      let relatedWithoutSelf = resRelated.companies.filter(({ id }) => id !== resCompany.id)

      if (relatedWithoutSelf.length > 4) {
        relatedWithoutSelf = relatedWithoutSelf.slice(0, 4)
      }

      const data = {
        breadcrumb: [{
          text: '🏠',
          to: {
            path: '/'
          }
        }, {
          text: 'Все города',
          to: {
            path: '/all/all'
          }
        }, {
          text: 'Все категории',
          to: {
            path: '/all/all'
          }
        }, {
          text: resCompany.title,
          to: {
            path: resCompany.slug
          }
        }],
        company: resCompany,
        related: relatedWithoutSelf,
        none: '—'
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
  methods: companyGetters
})
</script>
