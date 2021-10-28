<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Тарифы
    </h2>

    <h3 id="data">
      Доступ к данным
    </h3>

    <Plans :companies-total-count="companiesTotalCount" />

    <h3 id="company" class="mt-5">
      Размещение компаний
    </h3>

    <b-card-group deck>
      <b-card
        class="mt-3"
        no-body
      >
        <b-card-header>
          Стандартное размещение
        </b-card-header>

        <b-list-group flush>
          <b-list-group-item>
            <span class="font-weight-bold">
              Бесплатно
            </span>
          </b-list-group-item>
        </b-list-group>

        <b-card-body>
          <ul>
            <li>
              Вы можете добавить свою или чужую компанию в каталог
            </li>

            <li>
              После подтверждения прав на сайт, карточка компании получает знак

              <PatchCheck />

              и вы сможете редактировать информацию о компании
            </li>
          </ul>
        </b-card-body>

        <b-card-footer footer-bg-variant="white">
          <b-button
            to="/account/companies/apply"
            variant="primary"
          >
            Добавить компанию
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

          Приоритетное размещение
        </b-card-header>

        <b-list-group flush>
          <b-list-group-item>
            <span class="font-weight-bold">
              {{ priceCompanyPremium }}
            </span>

            <span class="text-muted">
              руб / мес
            </span>
          </b-list-group-item>
        </b-list-group>

        <b-card-body>
          Все из «Стандартного», плюс:

          <ul>
            <li>
              Ваша компания выше бесплатных во всех поисках и на главной
            </li>

            <li>
              Карточка компании подсвечена зеленым и привлекает внимание посетителей
            </li>

            <li>
              Специальный знак

              <PatchLightning />

              выделяет компанию среди остальных
            </li>
          </ul>
        </b-card-body>

        <b-card-footer footer-bg-variant="white">
          <b-row>
            <b-col md="6">
              <b-button
                to="/account/companies"
                variant="success"
              >
                Применить к компании
              </b-button>
            </b-col>

            <b-col md="6" class="pt-md-0 pt-2">
              <b-button
                to="/#results"
                variant="outline-success"
              >
                Как это выглядит?
              </b-button>
            </b-col>
          </b-row>
        </b-card-footer>
      </b-card>
    </b-card-group>

    <div class="d-flex justify-content-center mt-5">
      <img class="max-50-px" src="/payment-logos/cards.png" alt="Оплата картой">
      <img class="max-50-px" src="/payment-logos/qiwi.png" alt="Оплата Qiwi">
      <img class="max-50-px" src="/payment-logos/yandex.png" alt="Оплата Yandex.Money">
      <img class="max-50-px" src="/payment-logos/webmoney.png" alt="Оплата WebMoney">
    </div>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import apiAddr from '~/helpers/const/apiAddr'
import makeTitle from '~/helpers/makeTitle'
import price from '~/helpers/price'

export default Vue.extend({
  async asyncData (): Promise<object> {
    const raw = await fetch([
      apiAddr,
      '/v1/company/getTotalCount'
    ].join(''))

    const res = await raw.json()

    return {
      companiesTotalCount: res.totalCount
    }
  },
  data () {
    return {
      breadcrumb: [{
        id: 1,
        text: '🏠',
        to: {
          path: '/'
        }
      }, {
        id: 2,
        text: 'Тарифы',
        to: {
          path: '/plans'
        }
      }],
      priceCompanyPremium: price.companyPremium
    }
  },
  head () {
    return {
      title: makeTitle('Тарифы'),
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'Список доступных тарифов'
      }]
    }
  }
})
</script>

<style scoped>
.max-50-px {
  max-width: 50px;
  max-height: 50px;
}
</style>
