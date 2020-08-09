<template>
  <client-only>
    <b-button
      v-if="up"
      size="lg"
      pill
      variant="primary"
      class="fixed-bottom mb-3 ml-3"
      @click="scrollUp"
    >
      <b-icon-arrow-up-circle
        variant="light"
      />
    </b-button>
    <b-button
      v-else
      size="lg"
      pill
      variant="primary"
      class="fixed-bottom mb-3 ml-3"
      @click="scrollDown"
    >
      <b-icon-arrow-down-circle
        variant="light"
      />
    </b-button>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      up: true,
      lastScrollY: 0
    }
  },
  methods: {
    scrollUp () {
      this.lastScrollY = window.scrollY || document.getElementsByTagName('html')[0].scrollTop
      window.scrollTo(0, 0)
      this.up = false
    },
    scrollDown () {
      window.scrollTo(0, this.lastScrollY)
      this.up = true
    }
  }
})
</script>
