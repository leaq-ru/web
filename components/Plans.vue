<template>
  <b-card-group deck>
    <b-card
      class="mt-3"
      no-body
    >
      <b-card-header>
        Стандартный доступ
      </b-card-header>

      <b-list-group flush>
        <b-list-group-item>
          <span class="font-weight-bold">
            Бесплатно
          </span>
        </b-list-group-item>
      </b-list-group>

      <b-card-body>
        <b-list-group flush>
          <b-list-group-item>
            <span class="font-weight-bold">
              2500
            </span>
            элементов в
            <b-link to="/#search-buttons">
              списке email
            </b-link>
          </b-list-group-item>

          <b-list-group-item>
            <span class="font-weight-bold">
              2500
            </span>
            элементов в
            <b-link to="/#search-buttons">
              списке телефонов
            </b-link>
          </b-list-group-item>

          <b-list-group-item>
            <span class="font-weight-bold">
              2500
            </span>
            компаний в
            <b-link to="/#search">
              конструкторе CSV
            </b-link>
            баз
          </b-list-group-item>

          <b-list-group-item>
            <span class="font-weight-bold">
              1
            </span>
            запрос в секунду к
            <b-link
              target="_blank"
              href="https://api.leaq.ru/docs/"
            >
              API
            </b-link>
          </b-list-group-item>
        </b-list-group>
      </b-card-body>

      <b-card-footer footer-bg-variant="white">
        <b-button
          variant="outline-secondary"
          disabled
        >
          Уже активировано
        </b-button>
      </b-card-footer>
    </b-card>

    <b-card
      class="mt-3"
      border-variant="success"
      body-border-variant="success"
      no-body
    >
      <b-card-header
        header-bg-variant="success"
        header-text-variant="white"
      >
        <b-icon-lightning-fill />
        Расширенный доступ
      </b-card-header>

      <b-list-group flush>
        <b-list-group-item>
          <span class="font-weight-bold">
            {{ priceDataPremium }}
          </span>

          <span class="text-muted">
            руб / мес
          </span>
        </b-list-group-item>
      </b-list-group>

      <b-card-body>
        <b-list-group flush>
          <b-list-group-item>
            <span class="font-weight-bold">
              1 642 270
            </span>
            элементов (все) в
            <b-link to="/#search-buttons">
              списке email
            </b-link>
          </b-list-group-item>

          <b-list-group-item>
            <span class="font-weight-bold">
              1 852 626
            </span>
            элементов (все) в
            <b-link to="/#search-buttons">
              списке телефонов
            </b-link>
          </b-list-group-item>

          <b-list-group-item>
            <span class="font-weight-bold">
              {{ makePrettyNumber(companiesTotalCount, " ") }}
            </span>
            компаний (все) в
            <b-link to="/#search">
              конструкторе CSV
            </b-link>
            баз
          </b-list-group-item>

          <b-list-group-item>
            <span class="font-weight-bold">
              30
            </span>
            запросов в секунду к
            <b-link
              target="_blank"
              href="https://api.leaq.ru/docs/"
            >
              API
            </b-link>
          </b-list-group-item>

          <b-list-group-item>
            <span class="font-weight-bold">
              3
            </span>
            дня хранятся
            <b-link to="/account/exports">
              выгрузки CSV
            </b-link>
            в личном кабинете
          </b-list-group-item>
        </b-list-group>
      </b-card-body>

      <b-card-footer footer-bg-variant="white">
        <b-row>
          <b-col md="6">
            <b-button
              to="/account/exports"
              variant="success"
            >
              Активировать
            </b-button>
          </b-col>
        </b-row>
      </b-card-footer>
    </b-card>
  </b-card-group>
</template>

<script lang="ts">
import Vue from 'vue'
import makePrettyNumber from '~/helpers/makePrettyNumber'
import price from '~/helpers/price'

export default Vue.extend({
  props: {
    companiesTotalCount: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      priceDataPremium: price.dataPremium
    }
  },
  methods: {
    makePrettyNumber
  }
})
</script>
