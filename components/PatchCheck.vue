<template>
  <b-icon-patch-check-fill
    v-b-tooltip="'Информация подтверждена владельцем и регулярно обновляется'"
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
        return 'text-primary'
      }
    }
  }
})
</script>
