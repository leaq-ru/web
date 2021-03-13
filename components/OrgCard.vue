<template>
  <b-card
    :header="org.name"
    no-body
  >
    <b-card-body>
      <b-row>
        <b-col md="7">
          <b-link
            v-if="safeAreaName(org)"
            :to="`/orgs/${safeAreaSlug(org)}/all`"
          >
            <b-icon-building class="primary" />
            {{ safeAreaName(org) }}
          </b-link>
          <span v-else class="text-muted">
            <b-icon-building />
            {{ none }}
          </span>

          <b-row class="mt-1" />

          <b-link
            v-if="safeOkvedName(org)"
            :to="`/orgs/all/${safeOkvedSlug(org)}`"
          >
            <b-icon-grid class="primary" />
            {{ safeOkvedName(org) }}
          </b-link>
          <span v-else class="text-muted">
            <b-icon-grid />
            {{ none }}
          </span>

          <b-row class="mt-1" />

          <b-link
            v-if="safeManagerName(org)"
            :to="`/orgs/manager/${safeManagerSlug(org)}`"
          >
            <b-icon-person-circle class="primary" />
            {{ safeManagerName(org) }}
          </b-link>
          <span v-else class="text-muted">
            <b-icon-person-circle />
            {{ none }}
          </span>

          <b-row class="mt-1" />

          <b-icon-circle-fill :variant="status.color" />
          {{ status.text }}
        </b-col>

        <b-col md="5">
          <span class="text-muted">
            ИНН
          </span>
          <b-row />
          {{ org.inn || none }}

          <b-row class="mt-1" />

          <span class="text-muted">
            КПП
          </span>
          <b-row />
          {{ org.kpp || none }}

          <b-row class="mt-1" />

          <span class="text-muted">
            ОГРН
          </span>
          <b-row />
          {{ org.ogrn || none }}
        </b-col>
      </b-row>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item>
        <b-link
          v-if="safeLocationName(org)"
          :to="`/orgs/location/${safeLocationSlug(org)}`"
        >
          <b-icon-geo-alt class="primary" />
          {{ safeLocationName(org) }}
        </b-link>
        <span v-else class="text-muted">
          <b-icon-geo-alt />
          {{ none }}
        </span>
      </b-list-group-item>
    </b-list-group>

    <b-card-footer footer-bg-variant="white">
      <b-row>
        <b-col md="7" class="mb-3 mb-md-0">
          <b-button
            :to="`/orgs/company/${org.slug}`"
            variant="primary"
            pill
          >
            <b-icon-info-circle />
            Подробнее
          </b-button>
        </b-col>

        <b-col md="5">
          <b-button
            :to="relatedLink(org)"
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
import getStatus from '~/helpers/org/getStatus'
import orgGetters from '~/helpers/org/getters'

export default Vue.extend({
  props: {
    org: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      none: '—',
      status: getStatus(this.org.statusKind)
    }
  },
  methods: {
    ...orgGetters
  }
})
</script>
