<template>
  <div>
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
        :active="item.active === false || index === items.length - 1"
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

    <div v-if="ads" class="mb-3 text-center">
      <a href="https://www.instagram.com/1avedenis/" rel="nofollow" target="_blank">
        <img class="img-fluid" src="https://static.telq.org/inst-horizon.svg">
      </a>
    </div>
  </div>
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
    },
    ads: {
      type: Boolean,
      default () {
        return false
      }
    }
  }
})
</script>
