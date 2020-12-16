<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h1>
      Скачать базу компаний {{ city.header }} ({{ category.header }})
    </h1>

    <p>
      Список организаций {{ category.description }} {{ city.description }}. Это подборка, изменить условия поиска можно в
      <b-link to="/#search">
        конструкторе баз
      </b-link>
    </p>

    <p>
      Содержимое csv файла: город, категория компании, email, телефон, логотип, ссылки на соцсети, ИНН, КПП, ОГРН, контакты менеджеров и ЛПР (те кто указан администраторами группы компании ВКонтакте), технологии на сайте компании (например PHP, 1C-Bitrix, Vue.js), и многое другое. Скачайте бесплатно и посмотрите!
    </p>

    <b-row>
      <b-col md="4" class="mb-3">
        <b-button
          v-if="loading.downloadCsv"
          disabled
          pill
          block
          variant="outline-primary"
          @click="methodDownloadCsv"
        >
          <b-icon-arrow-clockwise animation="spin" />
          Скачать csv базу
        </b-button>
        <b-button
          v-else
          pill
          block
          variant="primary"
          @click="methodDownloadCsv"
        >
          <b-icon-file-text />
          Скачать csv базу
        </b-button>
      </b-col>

      <b-col md="4" class="mb-3">
        <b-button
          v-if="loading.downloadEmails"
          disabled
          pill
          block
          variant="outline-primary"
          @click="methodDownloadEmails"
        >
          <b-icon-arrow-clockwise animation="spin" />
          Скачать emails
        </b-button>
        <b-button
          v-else
          pill
          block
          variant="outline-primary"
          @click="methodDownloadEmails"
        >
          <b-icon-envelope />
          Скачать email
        </b-button>
      </b-col>

      <b-col md="4" class="mb-3">
        <b-button
          v-if="loading.downloadPhones"
          disabled
          pill
          block
          variant="outline-primary"
          @click="methodDownloadPhones"
        >
          <b-icon-arrow-clockwise animation="spin" />
          Скачать телефоны
        </b-button>
        <b-button
          v-else
          pill
          block
          variant="outline-primary"
          @click="methodDownloadPhones"
        >
          <b-icon-telephone />
          Скачать телефоны
        </b-button>
      </b-col>
    </b-row>

    <b-alert
      v-if="dataPremium"
      fade
      :show="downloadAlertCountDown"
      dismissible
      variant="success"
      class="w-100"
      @dismissed="downloadAlertCountDown=0"
    >
      <h6 class="alert-heading">
        Скачивание началось
      </h6>

      <p v-if="csvClick">
        База будет доступна в разделе
        <b-link to="/account/exports">
          выгрузки
        </b-link>
        в личном кабинете
      </p>
      <p v-else>
        Пожалуйста не покидайте страницу, собираем список для вас, затем начнется скачивание. Обычно занимает 30-60 секунд
      </p>
    </b-alert>
    <b-alert
      v-else
      fade
      :show="downloadAlertCountDown"
      dismissible
      variant="success"
      class="w-100"
      @dismissed="downloadAlertCountDown=0"
    >
      <h6 class="alert-heading">
        Скачивание началось
      </h6>

      <p>
        Будет скачано не более 1000 результатов. Данные без ограничений доступны на
        <b-link to="/plans#data">
          расширенном тарифе
        </b-link>
      </p>
    </b-alert>

    <b-alert
      fade
      :show="errConcExports"
      dismissible
      variant="danger"
      class="w-100"
    >
      <h6 class="alert-heading">
        Ошибка
      </h6>

      <p>
        Пожалуйста, дождитесь пока одна из ваших
        <b-link to="/account/exports">
          выгрузок
        </b-link>
        завершится, и затем попробуйте снова
      </p>
    </b-alert>

    <Plans :companies-total-count="companiesTotalCount" />

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { cityFrom } from 'lvovich'
import apiAddr from '~/helpers/const/apiAddr'
import download, { downloadRes, downloadType } from '~/helpers/company/download'

export default Vue.extend({
  async asyncData ({ error, params, store }): Promise<any> {
    try {
      if (!params.citySlug && !params.categorySlug) {
        return error({
          statusCode: 404
        })
      }

      const promises: Array<Promise<Response | null>> = [
        null,
        null,
        fetch([
          apiAddr,
          '/v1/company/getTotalCount'
        ].join(''))
      ]

      const token = store.state?.user?.self?.token
      if (token) {
        promises.push(fetch([
          apiAddr,
          '/v1/billing/getMyDataPlan'
        ].join(''), {
          headers: new Headers({
            Authorization: `Bearer ${token}`
          })
        }))
      }

      if (params.citySlug && params.citySlug !== 'all') {
        promises[0] = fetch([
          apiAddr,
          '/v1/city/getBySlug?',
          new URLSearchParams({
            slug: params.citySlug
          }).toString()
        ].join(''))
      }
      if (params.categorySlug && params.categorySlug !== 'all') {
        promises[1] = fetch([
          apiAddr,
          '/v1/category/getBySlug?',
          new URLSearchParams({
            slug: params.categorySlug
          }).toString()
        ].join(''))
      }

      const [
        rawCity,
        rawCategory,
        rawCompaniesTotalCount,
        rawMyDataPlan
      ] = await Promise.all(promises)
      const citySuccess = params.citySlug === 'all' || rawCity.ok
      const categorySuccess = params.categorySlug === 'all' || rawCategory.ok
      if (!citySuccess || !categorySuccess) {
        return error({
          statusCode: 404
        })
      }

      const unmarshal: Array<any> = [
        null,
        null,
        rawCompaniesTotalCount.json(),
        null
      ]
      if (rawCity) {
        unmarshal[0] = rawCity.json()
      }
      if (rawCategory) {
        unmarshal[1] = rawCategory.json()
      }
      if (rawMyDataPlan) {
        unmarshal[3] = rawMyDataPlan.json()
      }

      const [
        city,
        category,
        companiesTotalCount,
        myDataPlan
      ] = await Promise.all(unmarshal)

      const data = {
        breadcrumb: [{
          id: 1,
          text: '🏠',
          to: {
            path: '/'
          }
        }, {
          id: 2,
          text: 'Все города',
          to: {
            path: '/all/all'
          }
        }, {
          id: 3,
          text: 'Все категории',
          to: {
            path: '/all/all'
          }
        }, {
          id: 4,
          text: 'Скачать базу',
          to: {
            path: `/${city?.slug || 'all'}/${category?.slug || 'all'}/download`
          }
        }],
        city: {
          id: '',
          header: 'России',
          description: 'во всех городах России'
        },
        category: {
          id: '',
          header: 'все категории',
          description: 'во всех категориях'
        },
        company: {
          items: []
        },
        title: '',
        description: '',
        companiesTotalCount: companiesTotalCount.totalCount || 0,
        dataPremium: myDataPlan?.premium || false
      }

      if (city) {
        data.city.id = city.id
        data.city.header = cityFrom(city.title)
        data.city.description = `в городе ${city.title}`

        data.breadcrumb[1].text = city.title
      }
      if (category) {
        data.category.id = category.id
        data.category.header = category.title
        data.category.description = `в категории «${category.title}»`

        data.breadcrumb[2].text = category.title
      }

      const cityToElems = ['']
      cityToElems.push(city?.slug || 'all')
      cityToElems.push('all')
      data.breadcrumb[1].to.path = cityToElems.join('/')

      const categoryToElems = ['']
      categoryToElems.push(city?.slug || 'all')
      categoryToElems.push(category?.slug || 'all')
      data.breadcrumb[2].to.path = categoryToElems.join('/')

      data.title = `Скачать базу компаний ${data.city.header} (${data.category.header}) / Каталог компаний LEAQ`
      data.description = `Скачать csv базу, email и телефоны организаций ${data.city.header} из категории ${data.category.header} с возможностью уточнения поиска`

      return data
    } catch {
      return error({
        statusCode: 500
      })
    }
  },
  data () {
    return {
      csvClick: false,
      errConcExports: false,
      downloadAlertCountDown: 0,
      downloadAlertDismissSecs: 30,
      loading: {
        downloadEmails: false,
        downloadPhones: false,
        downloadCsv: false
      }
    }
  },
  methods: {
    buildDownloadQuery (): string {
      const query = new URLSearchParams()
      if (this.city.id) {
        query.append('cityIds', this.city.id)
      }
      if (this.category.id) {
        query.append('categoryIds', this.category.id)
      }
      return query.toString()
    },
    async methodDownloadEmails () {
      this.csvClick = false
      this.downloadAlertCountDown = this.downloadAlertDismissSecs

      const token = this.$store.state?.user?.self?.token
      this.loading.downloadEmails = true
      await download(this.buildDownloadQuery(), downloadType.email, this.dataPremium, token)
      this.loading.downloadEmails = false
    },
    async methodDownloadPhones () {
      this.csvClick = false
      this.downloadAlertCountDown = this.downloadAlertDismissSecs

      const token = this.$store.state?.user?.self?.token
      this.loading.downloadPhones = true
      await download(this.buildDownloadQuery(), downloadType.phone, this.dataPremium, token)
      this.loading.downloadPhones = false
    },
    async methodDownloadCsv () {
      this.csvClick = true
      this.errConcExports = false

      const token = this.$store.state?.user?.self?.token
      this.loading.downloadCsv = true
      const resDl = await download(this.buildDownloadQuery(), downloadType.csv, this.dataPremium, token)
      this.loading.downloadCsv = false
      if (resDl === downloadRes.errConcExports) {
        this.errConcExports = true
        return
      }

      this.downloadAlertCountDown = this.downloadAlertDismissSecs
    }
  },
  head () {
    return {
      title: this.title,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.description
      }]
    }
  }
})
</script>
