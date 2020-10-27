<template>
  <b-card no-body class="overflow-hidden">
    <b-col>
      <b-card-body>
        <b-card-text>
          <b-avatar
            :src="avatar"
            class="mr-2 mb-2"
          />

          {{ title }}

          <b-row />

          <span class="text-muted">
            {{ unifyDate(post.date).toLocaleDateString() }}
          </span>

          <b-row class="mb-3" />

          {{ post.text }}
        </b-card-text>

        <b-row class="mb-3" />

        <template v-if="post.photos && post.photos.length">
          <a
            :href="active.href"
            target="_blank"
            rel="nofollow"
          >
            <b-card-img-lazy
              :src="active.href"
              :alt="post.text ? post.text : 'фото из публикации компании'"
              class="rounded-sm"
            />
          </a>

          <template v-if="post.photos.length > 1">
            <a
              v-for="photo in post.photos"
              :key="photo.urlM"
              class="cursor-pointer"
              @click="setActiveHref(photo.urlR)"
            >
              <b-img-lazy
                thumbnail
                :src="photo.urlM"
                :alt="post.text ? post.text : 'фото из публикации компании'"
                :class="active.href === photo.urlR ? 'bg-primary rounded-sm mt-3 mr-3' : 'rounded-sm mt-3 mr-3'"
              />
            </a>
          </template>
        </template>
      </b-card-body>
    </b-col>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import unifyDate from '~/helpers/unifyDate'

export default Vue.extend({
  props: {
    avatar: {
      type: String,
      default () {
        return ''
      }
    },
    title: {
      type: String,
      default () {
        return ''
      }
    },
    post: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      active: {
        href: this.post.photos && this.post.photos[0]?.urlR
      },
      none: '—'
    }
  },
  methods: {
    unifyDate,
    setActiveHref (item) {
      this.active.href = item
    }
  }
})
</script>

<style>
.cursor-pointer{
  cursor: pointer;
}
</style>
