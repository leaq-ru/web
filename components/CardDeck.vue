<template>
  <span>
    <template v-for="(_, i) in items">
      <template v-if="i % 2 === 0">
        <b-card-group
          :key="items[i].id"
          class="mb-4"
          deck
        >
          <Card :company="items[i]" />

          <Card
            v-if="items[i+1]"
            :company="items[i+1]"
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
    items: {
      type: Array,
      default () {
        return []
      }
    }
  }
})
</script>
