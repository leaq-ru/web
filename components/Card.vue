<template>
  <b-card no-body>
    <b-card-header>
      <PatchCheck v-if="company.verified" />

      {{ company.title || company.slug }}
    </b-card-header>

    <b-card-body
      itemscope
      itemtype="http://schema.org/Organization"
    >
      <meta
        itemprop="name"
        :content="company.title || company.slug"
      >

      <b-row>
        <b-col md="5" class="mb-3">
          <b-avatar
            :to="`/company/${company.slug}`"
            :src="company.avatar"
            :alt="`Логотип ${company.url}`"
            size="120px"
            rounded="lg"
          />

          <meta
            :content="company.avatar"
            itemprop="logo"
          >

          <b-row class="mb-3" />

          <span class="d-none d-md-block">
            <SocialIcons :company="company" />
          </span>
        </b-col>

        <b-col md="7" class="mb-3">
          <b-link
            v-if="safeShortCityTitle(company)"
            :to="`/${safeShortCitySlug(company)}/all`"
          >
            <b-icon-building variant="primary" />
            <span itemprop="address">
              {{ safeShortCityTitle(company) }}
            </span>
          </b-link>
          <span v-else class="text-muted">
            <b-icon-building />
            {{ none }}
          </span>

          <b-row />

          <b-link
            v-if="safeCategoryTitle(company)"
            :to="`/all/${safeCategorySlug(company)}`"
          >
            <b-icon-grid variant="primary" />
            {{ safeCategoryTitle(company) }}
          </b-link>
          <span v-else class="text-muted">
            <b-icon-grid />
            {{ none }}
          </span>

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

          <template v-if="company.email">
            <b-link
              :href="`mailto:${company.email}?Subject=Вопрос с сайта https://leaq.ru`"
              target="_blank"
              @click="setTipFoundOnLeaq"
            >
              <b-icon-envelope variant="primary" />
              {{ company.email }}
            </b-link>
            <meta
              :content="company.email"
              itemprop="email"
            >
          </template>
          <span v-else class="text-muted">
            <b-icon-envelope />
            {{ none }}
          </span>

          <b-row />

          <b-link
            v-if="company.phone"
            :href="`tel:${company.phone}`"
            @click="setTipFoundOnLeaq"
          >
            <b-icon-telephone variant="primary" />
            <span itemprop="telephone">
              {{ toShowedPhone(company.phone) }}
            </span>
          </b-link>
          <span v-else class="text-muted">
            <b-icon-telephone />
            {{ none }}
          </span>

          <template v-if="showTipFoundOnLeaq">
            <TipFoundOnLeaq />
          </template>

          <b-row class="mb-3 d-md-none" />
          <span class="d-md-none">
            <SocialIcons :company="company" />
          </span>

          <b-row class="mb-3" />

          <span class="text-muted">
            <b-icon-clock />
            {{ toShowedDate(company.updatedAt) }}
          </span>
        </b-col>
      </b-row>
    </b-card-body>

    <b-card-footer footer-bg-variant="white">
      <b-row>
        <b-col md="5" class="mb-3 mb-md-0">
          <b-button
            :to="`/company/${company.slug}`"
            variant="primary"
            pill
          >
            <b-icon-info-circle />
            Подробнее
          </b-button>
        </b-col>

        <b-col md="7">
          <b-button
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
      none: '—',
      showTipFoundOnLeaq: false
    }
  },
  methods: {
    ...companyGetters,
    setTipFoundOnLeaq () {
      this.showTipFoundOnLeaq = true
    }
  }
})
</script>
