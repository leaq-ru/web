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

    <div
      id="yandex_rtb_R-A-1239340-1"
      class="mb-3"
    />
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
  },
  mounted () {
    if (this.ads) {
      const w = window as any
      w.yaContextCb.push(() => {
        w.Ya.Context.AdvManager.render({
          renderTo: 'yandex_rtb_R-A-1239340-1',
          blockId: 'R-A-1239340-1'
        })
      })
    }
  }
})
</script>
