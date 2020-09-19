<template>
  <b-card
    no-body
    :header="company.title || company.slug"
  >
    <b-card-body
      itemscope
      itemtype="http://schema.org/Organization"
    >
      <meta
        itemprop="name"
        :content="company.title || company.slug"
      >

      <b-row>
        <b-col xs="6" class="mb-3">
          <b-avatar
            badge
            :to="`/company/${company.slug}`"
            :src="company.avatar"
            :alt="`Логотип ${company.url}`"
            :badge-variant="company.online ? 'success' : 'danger'"
            size="5em"
          />
          <meta
            :content="company.avatar"
            itemprop="logo"
          >

          <b-row class="mb-3" />

          <b-link
            v-if="safeLocationCityTitle(company)"
            :to="`/${safeLocationCitySlug(company)}/all`"
          >
            <b-icon-building variant="primary" />
            <span itemprop="address">
              {{ safeLocationCityTitle(company) }}
            </span>
          </b-link>
          <template v-else>
            <b-icon-building />
            {{ none }}
          </template>

          <b-row />

          <b-link
            v-if="safeCategoryTitle(company)"
            :to="`/all/${safeCategorySlug(company)}`"
          >
            <b-icon-grid variant="primary" />
            {{ safeCategoryTitle(company) }}
          </b-link>
          <template v-else>
            <b-icon-grid />
            {{ none }}
          </template>

          <b-row class="mb-3" />

          <b-link
            v-if="company.url"
            itemprop="url"
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
          <template v-if="company.email">
            <b-link
              :href="`mailto:${company.email}?Subject=Вопрос с сайта https://leaq.ru`"
              target="_blank"
            >
              <b-icon-envelope variant="primary" />
              {{ company.email }}
            </b-link>
            <meta
              :content="company.email"
              itemprop="email"
            >
          </template>
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
            <span itemprop="telephone">
              {{ toShowedPhone(company.phone) }}
            </span>
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
      <b-row>
        <b-col md="6" class="mb-3 mb-md-0">
          <b-button
            size="sm"
            :to="`/company/${company.slug}`"
            variant="primary"
            pill
          >
            <b-icon-info-circle />
            Подробнее
          </b-button>
        </b-col>

        <b-col md="6">
          <b-button
            size="sm"
            :to="relatedLink(company)"
            variant="outline-primary"
            pill
          >
            <b-icon-tags />
            Найти похожие
          </b-button>
        </b-col>
      </b-row>
    </b-card-footer>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import companyGetters from '~/helpers/company/companyGetters'

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
  methods: companyGetters
})
</script>
