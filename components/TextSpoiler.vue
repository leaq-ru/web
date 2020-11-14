<template>
  <span>
    <template v-if="!showFull && text.length > 217">
      <p>
        {{ text.slice(0, 217) }}
      </p>

      <b-link @click="showFull = true">
        Показать полностью...
      </b-link>
    </template>
    <p v-else>
      {{ text }}
    </p>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      showFull: false
    }
  }
})
</script>
