<template>
  <b-card
    no-body
    :header="company.title || company.slug"
  >
    <b-card-body>
      <b-row>
        <b-col xs="6" class="mb-3">
          <b-avatar
            badge
            :src="company.avatar"
            :alt="`Логотип ${company.title || company.slug}`"
            :badge-variant="company.online ? 'success' : 'danger'"
            size="5em"
          />

          <b-row class="mb-3" />

          <b-link v-if="safeCategoryTitle(company)">
            <b-icon-grid variant="primary" />
            {{ safeCategoryTitle(company) }}
          </b-link>
          <template v-else>
            <b-icon-grid />
            {{ none }}
          </template>

          <b-row />

          <b-link v-if="safeLocationCityTitle(company)">
            <b-icon-building variant="primary" />
            {{ safeLocationCityTitle(company) }}
          </b-link>
          <template v-else>
            <b-icon-building />
            {{ none }}
          </template>

          <b-row class="mb-3" />

          <b-link
            v-if="company.url"
            :href="company.url"
            target="_blank"
            rel="nofollow"
          >
            <b-icon-globe variant="primary" />
            {{ company.url }}
          </b-link>
          <template v-else>
            <b-icon-globe />
            {{ none }}
          </template>

          <b-row class="mb-3" />

          <b-icon-clock />
          {{ toShowedDate(company.updatedAt) }}
        </b-col>

        <b-col xs="6" class="mb-3">
          <b-link
            v-if="company.email"
            :href="`mailto:${company.email}?Subject=Вопрос с сайта https://leaq.ru`"
            target="_blank"
          >
            <b-icon-envelope variant="primary" />
            {{ company.email }}
          </b-link>
          <template v-else>
            <b-icon-envelope />
            {{ none }}
          </template>

          <b-row />

          <b-link
            v-if="company.phone"
            :href="`tel:${company.phone}`"
          >
            <b-icon-telephone variant="primary" />
            {{ toShowedPhone(company.phone) }}
          </b-link>
          <template v-else>
            <b-icon-telephone />
            {{ none }}
          </template>

          <b-row class="mb-3" />

          <b-link
            v-if="safeSocialVkId(company)"
            :href="`https://vk.com/club${safeSocialVkId(company)}`"
            target="_blank"
            rel="nofollow"
          >
            <fa
              color="#007bff"
              :icon="['fab', 'vk']"
            />
            {{ safeSocialVkScreenName(company) }}

            <b-row />

            <b-icon-people variant="primary" />
            {{ safeSocialVkMembersCount(company) || none }}
          </b-link>
          <template v-else>
            <fa
              color="#212529"
              :icon="['fab', 'vk']"
            />
            {{ none }}

            <b-row />

            <b-icon-people />
            {{ none }}
          </template>

          <b-row class="mb-3" />

          <b-link
            v-if="safeSocialInstagramUrl(company)"
            :href="safeSocialInstagramUrl(company)"
            target="_blank"
            rel="nofollow"
          >
            <fa
              color="#007bff"
              :icon="['fab', 'instagram']"
            />
          </b-link>
          <fa
            v-else
            color="#212529"
            :icon="['fab', 'instagram']"
          />

          <b-link
            v-if="safeSocialYoutubeUrl(company)"
            :href="safeSocialYoutubeUrl(company)"
            target="_blank"
            rel="nofollow"
          >
            <fa
              color="#007bff"
              :icon="['fab', 'youtube']"
            />
          </b-link>
          <fa
            v-else
            color="#212529"
            :icon="['fab', 'youtube']"
          />

          <b-link
            v-if="safeSocialFacebookUrl(company)"
            :href="safeSocialFacebookUrl(company)"
            target="_blank"
            rel="nofollow"
          >
            <fa
              color="#007bff"
              :icon="['fab', 'facebook']"
            />
          </b-link>
          <fa
            v-else
            color="#212529"
            :icon="['fab', 'facebook']"
          />

          <b-link
            v-if="safeSocialTwitterUrl(company)"
            :href="safeSocialTwitterUrl(company)"
            target="_blank"
            rel="nofollow"
          >
            <fa
              color="#007bff"
              :icon="['fab', 'twitter']"
            />
          </b-link>
          <fa
            v-else
            color="#212529"
            :icon="['fab', 'twitter']"
          />

          <b-row class="mb-3" />

          <b-link
            v-if="safeAppStoreUrl(company)"
            :href="safeAppStoreUrl(company)"
            target="_blank"
            rel="nofollow"
          >
            <fa
              color="#007bff"
              :icon="['fab', 'app-store']"
            />
          </b-link>
          <fa
            v-else
            color="#212529"
            :icon="['fab', 'app-store']"
          />

          <b-link
            v-if="safeGooglePlayUrl(company)"
            :href="safeGooglePlayUrl(company)"
            target="_blank"
            rel="nofollow"
          >
            <fa
              color="#007bff"
              :icon="['fab', 'google-play']"
            />
          </b-link>
          <fa
            v-else
            color="#212529"
            :icon="['fab', 'google-play']"
          />

          <b-row class="mb-3" />

          ИНН: {{ company.inn || none }}
          <b-row />
          КПП: {{ company.kpp || none }}
          <b-row />
          ОГРН: {{ company.ogrn || none }}
        </b-col>
      </b-row>
    </b-card-body>

    <b-card-footer footer-bg-variant="white">
      <b-button
        href="#"
        variant="primary"
        pill
      >
        <b-icon-box-arrow-up-right />
        Подробнее
      </b-button>
    </b-card-footer>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    company: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      none: '—'
    }
  },
  methods: {
    toShowedPhone (phone: number): string {
      if (!phone) {
        return '—'
      }

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
    },
    toShowedDate (date: string): string {
      const d = new Date(date)
      return d.toLocaleDateString()
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
    safeSocialVkScreenName (company) {
      return company.social?.vk?.screenName
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
