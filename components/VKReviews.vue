<template>
  <b-row class="mt-5 mb-2">
    <b-col>
      <h2>
        Отзывы
      </h2>

      <div id="vk_comments" />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted () {
    const w = window as any
    w.VK.Widgets.Comments('vk_comments', {
      limit: 20,
      attach: '*'
    })
  }
})
</script>
