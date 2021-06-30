<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h1>
      Скачать базу компаний {{ city.header }} {{ category.description }}
    </h1>

    <p>
      Список организаций {{ category.description }} {{ city.description }}. Это подборка, изменить условия поиска
      можно в
      <b-link to="/#search">
        конструкторе баз
      </b-link>
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
          Скачать CSV базу
        </b-button>
        <b-button
          v-else
          pill
          block
          variant="primary"
          @click="methodDownloadCsv"
        >
          <b-icon-file-text />
          Скачать CSV базу
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
        Будет скачано не более 100 результатов. Данные без ограничений доступны на
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

    <hr>

    <h2>
      Откуда данные, они актуальны?
    </h2>
    <p>
      Да, данные актуальны, взяты из первоисточника (сайт компании), дата
      последнего обновления указана для карточки каждой фирмы
    </p>
    <p>
      Наш робот обходит все домены в зонах .ru, .рф, .su и индексирует сайты. Ищет на сайте телефон и email, присваиает
      город, категорию и прочие свойства карточки компании. Таким образом, в базу добавляются новые сайты,
      также периодически обновляется информация о старых
    </p>

    <h2>
      Кому будет полезна база?
    </h2>
    <ol class="mb-3">
      <li>
        B2B компаниям — выгрузка в CRM для холодных звонков или почтовых рассылок
      </li>
      <li>
        B2C компаниям — в целях анализа и сегментации рынка по городам и категориям
      </li>
      <li>
        Маркетинговым агентствам — для выгрузки телефонов и email в рекламные кабинеты ВКонтакте или Facebook для точного
        или look-alike таргетирования рекламных объявлений
      </li>
    </ol>

    <h2>
      Что в файле?
    </h2>
    <p>
      Сейчас пройдемся по всем полям таблицы
    </p>

    <div class="mt-3 mb-3">
      <b-link href="https://static.leaq.ru/csv-preview.png" target="_blank">
        <b-img-lazy fluid src="https://static.leaq.ru/csv-preview.png" />
      </b-link>
    </div>

    <ol>
      <li>
        <span class="font-weight-bold">
          Ссылка на сайт
        </span>
        <p>
          Сайт компании это точка входа для нашего робота. Получаем HTML код, далее алгоритм в нем ищет данные — email,
          телефон, ссылки на соцсети и т.д. В нашей базе есть все домены .ru, .рф, .su и данные регулярно обновляются
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Название категории
        </span>
        <p>
          У карточки компании может быть одна из 579 категорий. Полный их список представлен
          <b-link to="/categories">
            здесь.
          </b-link> Категория присваивается алгоритмом машинного обучения на основе содержимого сайта
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Slug
        </span>
        <p>
          Так называют короткое читаемое имя в адресе сайта. Оно уникально, и с помощью этого идентификатора можно
          зайти в карточку компании. Например slug
          <span class="font-italic">
            dress4car-ru
          </span>
          означает что можно попасть в карточку компании по адресу
          <b-link to="/company/dress4car-ru">
            https://leaq.ru/company/dress4car-ru
          </b-link>
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Название компании
        </span>
        <p>
          Название присваиваем из тэга title на сайте, или из группы ВКонтакте
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Email
        </span>
        <p>
          На страницах сайта ищем текст по формату электронной почты. Email удается определить в ~53% случаев
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Телефон
        </span>
        <p>
          На страницах сайта смотрим текст по формату телефона. Ищем со скобками и без, но приводим в единый формат
          7XXXXXXXXXX. Телефон удается определить для ~62% компаний
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Описание
        </span>
        <p>
          Берем из тэга description на сайте, или из группы ВКонтакте
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Сайт онлайн
        </span>
        <p>
          Ответил ли сайт компании корректно при последнем обходе. Если нет, ставится одноименное значение,
          но данные не удаляем
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          ИНН
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          КПП
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          ОГРН
        </span>
        <p>
          Определяем по содержимому сайта. Немногие компании указывают эти данные, поэтому совсем нечасто удается
          определить
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          IP сервера
        </span>
        <p>
          Внешний IP адрес, на который нас направляет домен компании. Сохранено для большинства карточек компаний
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Регистратор домена
        </span>
        <p>
          В какой компании было зарегистрировано доменное имя сайта фирмы. Указано для 100% карточек компаний
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Дата регистрации домена
        </span>
        <p>
          Дата когда было впервые зарегистрировано доменное имя
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Логотип
        </span>
        <p>
          Первая картинка с сайта сохраняется как логотип. Или ававар группы ВКонтакте
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Город
        </span>
        <p>
          Один из городов из
          <b-link to="/cities">
            списка.
          </b-link>
          Определяется по совпадению, например «г. Москва» и другим частым сочетаниям. Если не найден на сайте, берем из группы ВКонтакте. Указан для ~30% компаний
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Адрес улица
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Адрес дом/офис
        </span>
        <p>
          Определяем по соответствующему полю из адреса в группе компании ВКонтакте
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Приложение в AppStore
        </span>
        <p>
          Ищем на сайте ссылки на https://apps.apple.com
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Приложение в Google Play
        </span>
        <p>
          Ищем на сайте ссылки на https://play.google.com
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          VK группа - ID
        </span>
        <p>
          ID группы компании ВКонтакте
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          VK группа - Название
        </span>
        <p>
          Текст, указанный в поле «Название» группы ВКонтакте
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          VK группа - Короткий адрес
        </span>
        <p>
          Адрес группы. Например «dress4car» для https://vk.com/dress4car
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          VK группа - Приватность
        </span>
        <ul>
          <li>
            OPEN — открытая группа
          </li>
          <li>
            CLOSE — группа достпна только после одобрения заявки администратором
          </li>
          <li>
            PRIVATE — группа доступна только по приглашениям
          </li>
        </ul>
      </li>

      <li>
        <span class="font-weight-bold">
          VK группа - Описание
        </span>
        <p>
          Текст, указанный в поле «Описание» группы ВКонтакте
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          VK группа - Кол-во подписчиков
        </span>
        <p>
          Количество подписчиков в группе
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          VK группа - Аватар
        </span>
        <p>
          Ссылка на фото, указанное логотипом группы
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Instagram страница
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Twitter профиль
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          YouTube канал
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Facebook группа
        </span>
        <p>
          Ищем группы по ссылкам на сайте
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Обновлено
        </span>
        <p>
          Дата последнего обновления информации по компании
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Технологии на сайте
        </span>
        <p>
          Фреймворки и языки программирования которые робот нашел на сайте.
          Указывается в формате «категория - технология», список разделен точкой с запятой «;»
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Скорость загрузки сайта в ms
        </span>
        <p>
          Скорость как быстро ответил сайт нашему роботу. Указывается в миллисекундах. Полезно для фильтров, например
          если ваша компания занимается разработкой/модернизацией сайтов на PHP, можно найти компании
          с медленным сайтом на PHP и предложить им услуги по ускорению
        </p>
      </li>

      <li>
        <span class="font-weight-bold">
          Владелец подтвержден
        </span>
        <ul class="mb-3">
          <li>
            да — владелец компании подтвердил права на LEAQ
          </li>
          <li>
            нет — робот собрал информацию самостоятельно
          </li>
        </ul>
      </li>

      <li>
        <span class="font-weight-bold">
          Приоритетное размещение
        </span>
        <ul>
          <li>
            да — владелец компании оплатил приоритетное размещение на LEAQ
          </li>
          <li>
            нет — карточка компании размещается бесплатно
          </li>
        </ul>
      </li>

      <li>
        <span class="font-weight-bold">
          Менеджер #1 - VK ID
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Менеджер #1 - Имя
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Менеджер #1 - Фамилия
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Менеджер #1 - VK закрыт?
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Менеджер #1 - Пол
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Менеджер #1 - Аватар
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Менеджер #1 - Телефон
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Менеджер #1 - Email
        </span>
      </li>
      <li>
        <span class="font-weight-bold">
          Менеджер #1 - Описание
        </span>
        <p>
          Берем информацию о первых 5 менеджерах из блока «Контакты» в группе компании ВКонтакте
        </p>
      </li>
    </ol>

    <h2>
      Хочу больше данных, что дальше?
    </h2>

    <p>
      Предлагаем воспользоваться
      <b-link to="/#search">
        конструктором баз.
      </b-link>
      Там вы сможете выбрать один/несколько городов, категорий и других атрибутов. Можно легко отфильтровать лишнее
      и найти то что нужно вам. Или просто скачать более 2 млн компаний одним файлом и анализировать у себя
      на компьютере
    </p>

    <p>
      Все функции конструктора доступны бесплатно, но в выгрузке будет не более 100 элементов. Детали платного тарифа
      представлены ниже
    </p>

    <Plans :companies-total-count="companiesTotalCount" />

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { cityFrom } from 'lvovich'
import apiAddr from '~/helpers/const/apiAddr'
import download, { downloadRes, downloadType } from '~/helpers/company/download'
import makeTitle from '~/helpers/makeTitle'
import metrics from '~/helpers/metrics'

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
          header: category ? 'России' : 'Россия',
          description: 'во всех городах России'
        },
        category: {
          id: '',
          header: '',
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

      if (data.category.header) {
        data.title = makeTitle(`${data.category.header} ${data.city.header} — база компаний`)
      } else {
        data.title = makeTitle(`${data.city.description} — база компаний`)
      }
      data.description = `Скачать CSV базу, email и телефоны организаций ${data.city.header} из категории ${data.category.header} с возможностью уточнения поиска`

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

      await metrics.emailDownload()
    },
    async methodDownloadPhones () {
      this.csvClick = false
      this.downloadAlertCountDown = this.downloadAlertDismissSecs

      const token = this.$store.state?.user?.self?.token
      this.loading.downloadPhones = true
      await download(this.buildDownloadQuery(), downloadType.phone, this.dataPremium, token)
      this.loading.downloadPhones = false

      await metrics.phoneDownload()
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

      await metrics.csvDownload()
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
