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

    <b-link
      v-if="ads"
      to="/"
      class="text-decoration-none"
    >
      <b-card
        class="mt-3 mb-3"
        border-variant="success"
        body-border-variant="success"
        no-body
      >
        <b-card-header
          header-bg-variant="success"
          header-text-variant="white"
        >
          <b-icon-lightning-fill />
          Скачать базу компаний России за
          <span class="font-weight-bold">
            990 руб
          </span>
        </b-card-header>

        <b-card-body class="text-dark">
          <p>
            Контакты, город, категория, соцсети, ИНН, ОГРН, и многое другое.
          </p>

          <span class="font-weight-bold">
            2 183 932
          </span>
          компаний,

          <span class="font-weight-bold">
            1 505 619
          </span>
          email,

          <span class="font-weight-bold">
            1 852 626
          </span>
          телефонов.
        </b-card-body>

        <b-card-footer footer-bg-variant="white">
          <b-row>
            <b-col md="6">
              <b-button variant="success">
                Попробовать бесплатно
              </b-button>
            </b-col>
          </b-row>
        </b-card-footer>
      </b-card>
    </b-link>
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
