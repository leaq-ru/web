<template>
  <b-card
    :border-variant="company.premium ? 'success' : ''"
    no-body
  >
    <b-link
      class="text-decoration-none text-dark"
      :to="`/company/${company.slug}`"
    >
      <b-card-header
        :class="company.premium ? 'text-light' : ''"
        :header-bg-variant="company.premium ? 'success' : ''"
        :header-border-variant="company.premium ? 'success' : ''"
      >
        <PatchLightning
          v-if="company.premium"
          text-class="text-light"
        />

        <PatchCheck
          v-if="company.verified"
          :text-class="company.premium ? 'text-light' : 'text-primary'"
        />

        {{ company.title || company.slug }}
      </b-card-header>
    </b-link>

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
            :class="company.premium ? 'text-dark' : ''"
            :to="`/${safeShortCitySlug(company)}/all`"
          >
            <b-icon-building :class="color" />
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
            :class="company.premium ? 'text-dark' : ''"
            :to="`/all/${safeCategorySlug(company)}`"
          >
            <b-icon-grid :class="color" />
            {{ safeCategoryTitle(company) }}
          </b-link>
          <span v-else class="text-muted">
            <b-icon-grid />
            {{ none }}
          </span>

          <b-row class="mb-3" />

          <b-link
            v-if="company.url"
            :class="company.premium ? 'text-dark' : ''"
            itemprop="url"
            :href="company.url"
            target="_blank"
            rel="nofollow"
          >
            <b-icon-globe :class="color" />
            {{ company.url }}
          </b-link>
          <template v-else>
            <b-icon-globe />
            {{ none }}
          </template>

          <b-row class="mb-3" />

          <template v-if="company.email">
            <b-link
              :class="company.premium ? 'text-dark' : ''"
              :href="`mailto:${company.email}?Subject=Вопрос с сайта https://leaq.ru`"
              target="_blank"
              @click="setTipFoundOnLeaq"
            >
              <b-icon-envelope :class="color" />
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
            :class="company.premium ? 'text-dark' : ''"
            :href="`tel:${company.phone}`"
            @click="setTipFoundOnLeaq"
          >
            <b-icon-telephone :class="color" />
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

    <b-card-footer
      :footer-border-variant="company.premium ? 'success' : ''"
      footer-bg-variant="white"
    >
      <b-row>
        <b-col md="5" class="mb-3 mb-md-0">
          <b-button
            :to="`/company/${company.slug}`"
            :variant="company.premium ? 'success' : 'primary'"
            pill
          >
            <b-icon-info-circle />
            Подробнее
          </b-button>
        </b-col>

        <b-col md="7">
          <b-button
            :to="relatedLink(company)"
            :variant="company.premium ? 'outline-success' : 'outline-primary'"
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
      showTipFoundOnLeaq: false,
      color: this.company.premium ? 'text-success' : 'text-primary'
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
