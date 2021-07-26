<template>
  <span>
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
      (function (w: any, d, n, s, t) {
        w[n] = w[n] || []
        w[n].push(function () {
          w.Ya.Context.AdvManager.render({
            blockId: 'R-A-1239340-1',
            renderTo: 'yandex_rtb_R-A-1239340-1',
            async: true
          })
        })
        t = d.getElementsByTagName('script')[0]
        s = d.createElement('script')
        s.type = 'text/javascript'
        s.src = '//an.yandex.ru/system/context.js'
        s.async = true
        t.parentNode.insertBefore(s, t)
      })(window, window.document, 'yandexContextAsyncCallbacks')
    }
  }
})
</script>
