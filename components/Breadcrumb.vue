<template>
  <b-breadcrumb
    itemscope
    itemtype="https://schema.org/BreadcrumbList"
  >
    <b-breadcrumb-item
      v-for="(item, index) in items"
      :key="item.id"
      itemprop="itemListElement"
      itemscope
      itemtype="https://schema.org/ListItem"
      :to="item.to.path"
      :active="index === items.length - 1"
    >
      <span itemprop="name">
        {{ item.text }}
      </span>

      <meta
        itemprop="item"
        itemscope
        itemtype="https://schema.org/WebPage"
        :itemid="`https://leaq.ru${index === 0 ? '' : item.to.path}`"
      >

      <meta
        itemprop="position"
        :content="item.id"
      >
    </b-breadcrumb-item>
  </b-breadcrumb>
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
