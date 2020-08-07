<template>
  <b-card
    :title="title || slug"
  >
    <b-row>
      <b-col md="4" align="center">
        <b-avatar
          badge
          :src="avatar"
          :alt="`Логотип ${title || slug}`"
          :badge-variant="online ? 'success' : 'danger'"
          size="5em"
          class="mb-3"
        />

        <b-button
          href="#"
          variant="primary"
          pill
        >
          Подробнее
        </b-button>
      </b-col>

      <b-col md="8">
        <b-icon-globe
          :variant="url ? 'primary' : ''"
        />
        <b-link
          v-if="url"
          :href="url"
          target="_blank"
          rel="nofollow"
        >
          {{ url }}
        </b-link>
        <template v-else>
          {{ none }}
        </template>

        <b-row />

        <b-icon-envelope
          :variant="email ? 'primary' : ''"
        />
        <a
          v-if="email"
          :href="`mailto:${email}?Subject=Заявка с сайта https://leaq.ru`"
          target="_blank"
        >
          {{ email }}
        </a>
        <template v-else>
          {{ none }}
        </template>

        <b-row />

        <b-icon-telephone
          :variant="phone ? 'primary' : ''"
        />
        <b-link
          v-if="phone"
          :href="phone"
          target="_blank"
        >
          {{ phone }}
        </b-link>
        <template v-else>
          {{ none }}
        </template>
      </b-col>
    </b-row>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    slug: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: 'https://vk.com/images/camera_200.png?ava=1'
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: Number,
      default: 0
    },
    online: {
      type: Boolean,
      default: false
    },
    inn: {
      type: Number,
      default: 0
    },
    kpp: {
      type: Number,
      default: 0
    },
    ogrn: {
      type: Number,
      default: 0
    },
    appStoreUrl: {
      type: String,
      default: ''
    },
    googlePlayUrl: {
      type: String,
      default: ''
    },
    categoryId: {
      type: String,
      default: ''
    },
    categoryTitle: {
      type: String,
      default: ''
    },
    categorySlug: {
      type: String,
      default: ''
    },
    locationCityId: {
      type: String,
      default: ''
    },
    locationCityTitle: {
      type: String,
      default: ''
    },
    locationCitySlug: {
      type: String,
      default: ''
    },
    locationAddress: {
      type: String,
      default: ''
    },
    socialVkId: {
      type: Number,
      default: 0
    },
    socialVkMembersCount: {
      type: Number,
      default: 0
    },
    socialInstagramUrl: {
      type: String,
      default: ''
    },
    socialTwitterUrl: {
      type: String,
      default: ''
    },
    socialYoutubeUrl: {
      type: String,
      default: ''
    },
    socialFacebookUrl: {
      type: String,
      default: ''
    },
    updatedAt: {
      type: String,
      default: ''
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
    }
  }
})
</script>
