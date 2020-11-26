<template>
  <b-col
    class="mb-1"
    md="6"
  >
    <span class="text-muted">
      <b-icon :icon="icon" aria-hidden="true" />
      {{ header }}
    </span>

    <b-row />

    <div
      v-if="body"
      class="ml-21"
    >
      {{ body }}
    </div>
    <div
      v-else
      class="ml-21"
    >
      {{ none }}
    </div>
  </b-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    icon: {
      type: String,
      default () {
        return ''
      }
    },
    header: {
      type: String,
      default () {
        return ''
      }
    },
    body: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      none: '—'
    }
  }
})
</script>

<style scoped>
.ml-21 {
  margin-left: 21px;
}
</style>
