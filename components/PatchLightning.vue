<template>
  <b-icon-lightning-fill
    ref="tooltip-lightning"
    v-b-tooltip="'Приоритетное размещение'"
    :class="textClass"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    textClass: {
      type: String,
      default () {
        return 'text-success'
      }
    }
  }
})
</script>
