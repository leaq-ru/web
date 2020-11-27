<template>
  <span>
    <b-link
      v-if="safeSocialInstagramUrl(company)"
      :href="safeSocialInstagramUrl(company)"
      target="_blank"
      rel="nofollow"
    >
      <fa
        :class="color"
        :icon="['fab', 'instagram']"
      />
    </b-link>
    <fa
      v-else
      class="text-muted"
      :icon="['fab', 'instagram']"
    />

    <b-link
      v-if="safeSocialYoutubeUrl(company)"
      :href="safeSocialYoutubeUrl(company)"
      target="_blank"
      rel="nofollow"
    >
      <fa
        :class="color"
        :icon="['fab', 'youtube']"
      />
    </b-link>
    <fa
      v-else
      class="text-muted"
      :icon="['fab', 'youtube']"
    />

    <b-link
      v-if="safeSocialFacebookUrl(company)"
      :href="safeSocialFacebookUrl(company)"
      target="_blank"
      rel="nofollow"
    >
      <fa
        :class="color"
        :icon="['fab', 'facebook']"
      />
    </b-link>
    <fa
      v-else
      class="text-muted"
      :icon="['fab', 'facebook']"
    />

    <b-link
      v-if="safeSocialTwitterUrl(company)"
      :href="safeSocialTwitterUrl(company)"
      target="_blank"
      rel="nofollow"
    >
      <fa
        :class="color"
        :icon="['fab', 'twitter']"
      />
    </b-link>
    <fa
      v-else
      class="text-muted"
      :icon="['fab', 'twitter']"
    />

    <b-link
      v-if="safeAppStoreUrl(company)"
      :href="safeAppStoreUrl(company)"
      target="_blank"
      rel="nofollow"
    >
      <fa
        :class="color"
        :icon="['fab', 'app-store']"
      />
    </b-link>
    <fa
      v-else
      class="text-muted"
      :icon="['fab', 'app-store']"
    />

    <b-link
      v-if="safeGooglePlayUrl(company)"
      :href="safeGooglePlayUrl(company)"
      target="_blank"
      rel="nofollow"
    >
      <fa
        :class="color"
        :icon="['fab', 'google-play']"
      />
    </b-link>
    <fa
      v-else
      class="text-muted"
      :icon="['fab', 'google-play']"
    />

    <b-row class="mb-3" />

    <b-link
      v-if="safeSocialVkId(company)"
      :class="company.premium ? 'text-dark' : ''"
      :href="`https://vk.com/club${safeSocialVkId(company)}`"
      target="_blank"
      rel="nofollow"
    >
      <fa
        :class="color"
        :icon="['fab', 'vk']"
      />
      {{ safeSocialVkScreenName(company) }}

      <b-row />

      <b-icon-people :class="color" />
      {{ safeSocialVkMembersCount(company) || none }}
    </b-link>
    <template v-else>
      <fa
        class="text-muted"
        :icon="['fab', 'vk']"
      />
      {{ none }}

      <b-row />

      <b-icon-people class="text-muted" />
      {{ none }}
    </template>
  </span>
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
      color: this.company.premium ? 'text-success' : 'text-primary'
    }
  },
  methods: companyGetters
})
</script>
