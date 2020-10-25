<template>
  <b-card no-body class="overflow-hidden">
    <b-col>
      <b-card-body>
        <b-card-text>
          {{ post.text }}
        </b-card-text>

        <b-row class="mb-3" />

        <template v-if="post.photos && post.photos.length">
          <b-card-img-lazy
            :src="post.photos[0].urlR"
            :alt="post.text ? post.text : 'фото из публикации компании'"
            class="rounded-sm"
          />

          <b-img-lazy
            v-for="photo in post.photos.slice(1)"
            :key="photo.urlM"
            :src="photo.urlM"
            :alt="post.text ? post.text : 'фото из публикации компании'"
            class="rounded-sm mt-3 mr-3"
          />
        </template>
      </b-card-body>
    </b-col>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    post: {
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
  computed: {
    col (): number {
      return this.post.text && this.post.photos?.length ? 6 : 12
    }
  }
})
</script>
