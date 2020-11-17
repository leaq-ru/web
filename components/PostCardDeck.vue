<template>
  <span>
    <template v-for="(_, i) in items">
      <template v-if="i % 2 === 0">
        <b-card-group
          :key="i"
          class="mb-4"
          deck
        >
          <PostCard
            :avatar="avatar"
            :title="title"
            :post="items[i]"
          />

          <PostCard
            v-if="items[i+1]"
            :avatar="avatar"
            :title="title"
            :post="items[i+1]"
          />
          <b-card
            v-else
            no-body
            class="invisible"
          />
        </b-card-group>
      </template>
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

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
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      modal: {
        visible: false,
        imgSrc: ''
      }
    }
  }
})
</script>
