<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Редактирование
    </h2>

    <p class="text-muted">
      Чем подробнее вы укажете информацию, тем легче будет потенциальному клиенту сделать выбор в пользу вашей компании
    </p>

    <h3>
      Основное
    </h3>

    <b-row>
      <b-col md="6">
        <b-form-group label="Логотип">
          <b-form-file
            v-model="file"
            :state="fileState"
            placeholder="Перетащите или выберите новый логотип"
            browse-text="Обзор"
          />

          <b-form-text>
            Файл .png размером до 200кб. Рекомендуем разрешение 200х200
          </b-form-text>
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Название">
          <b-form-input
            v-model="query.title"
            :state="titleState"
            placeholder="Название компании"
          />

          <b-form-text>
            {{ (query.title || '').length }}/50 символов
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group label="Категория">
          <b-form-tag
            v-if="categoryTag.id"
            :title="categoryTag.title"
            pill
            variant="primary"
            class="mb-2"
            @remove="category.removeTag"
          >
            {{ categoryTag.title }}
          </b-form-tag>
          <vue-bootstrap-typeahead
            ref="input-category"
            v-model="category.search"
            :data="category.list"
            :serializer="s => s.title"
            placeholder="Начните печатать и выберите одну категорию"
            @hit="category.addTag($event)"
          />
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Описание">
          <b-form-textarea
            id="input-description"
            v-model="query.description"
            :state="descriptionState"
            placeholder="Описание товаров, услуг, деятельности компании"
          />

          <b-form-text>
            {{ (query.description || '').length }}/1500 символов
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <h3>
      Контакты
    </h3>

    <b-row>
      <b-col md="6">
        <b-form-group label="Email">
          <b-form-input
            v-model="query.email"
            :state="emailState"
            placeholder="Email компании"
          />

          <b-form-text>
            {{ (query.email || '').length }}/50 символов в формате email адреса
          </b-form-text>
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Телефон">
          <b-form-input
            v-model="query.phone"
            :state="phoneState"
            placeholder="Телефон компании"
            type="number"
          />

          <b-form-text>
            11 символов в формате 71234567890
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <h3>
      Адрес
    </h3>

    <b-row>
      <b-col md="6">
        <b-form-group label="Город">
          <b-form-tag
            v-if="cityTag.id"
            :title="cityTag.title"
            pill
            variant="primary"
            class="mb-2"
            @remove="city.removeTag"
          >
            {{ cityTag.title }}
          </b-form-tag>
          <vue-bootstrap-typeahead
            ref="input-city"
            v-model="city.search"
            :data="city.list"
            :serializer="s => s.title"
            placeholder="Начните печатать и выберите один город"
            @hit="city.addTag($event)"
          />
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Улица">
          <b-form-input
            v-model="query.addressStreet"
            :state="addressStreetState"
            placeholder="Улица"
          />

          <b-form-text>
            {{ (query.addressStreet || '').length }}/50 символов
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group label="Дом">
          <b-form-input
            v-model="query.addressHouse"
            :state="addressHouseState"
            placeholder="Дом / офис / строение"
          />

          <b-form-text>
            {{ (query.addressHouse || '').length }}/50 символов
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <h3>
      Соцсети
    </h3>

    <b-row>
      <b-col md="6">
        <b-form-group label="ВКонтакте">
          <b-form-input
            v-model="query.vkUrl"
            :state="vkUrlState"
            placeholder="Группа компании ВКонтакте"
          />

          <b-form-text>
            {{ (query.vkUrl || '').length }}/250 символов в формате https://vk.com/yourcompany. Из группы автоматически отображаем менеджеров и новости
          </b-form-text>
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Instagram">
          <b-form-input
            v-model="query.instagramUrl"
            :state="instagramUrlState"
            placeholder="Страница компании в Instagram"
          />

          <b-form-text>
            {{ (query.instagramUrl || '').length }}/250 символов в формате https://www.instagram.com/yourcompany
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group label="YouTube">
          <b-form-input
            v-model="query.youtubeUrl"
            :state="youtubeUrlState"
            placeholder="Канал компании на YouTube"
          />

          <b-form-text>
            {{ (query.youtubeUrl || '').length }}/250 символов в формате https://www.youtube.com/yourcompany
          </b-form-text>
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Facebook">
          <b-form-input
            v-model="query.facebookUrl"
            :state="facebookUrlState"
            placeholder="Страница компании в Facebook"
          />

          <b-form-text>
            {{ (query.facebookUrl || '').length }}/250 символов в формате https://www.facebook.com/yourcompany
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group label="Twitter">
          <b-form-input
            v-model="query.twitterUrl"
            :state="twitterUrlState"
            placeholder="Аккаунт компании в Twitter"
          />

          <b-form-text>
            {{ (query.twitterUrl || '').length }}/250 символов в формате https://twitter.com/yourcompany
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <h3>
      Приложения
    </h3>

    <b-row>
      <b-col md="6">
        <b-form-group label="App Store">
          <b-form-input
            v-model="query.appStoreUrl"
            :state="appStoreUrlState"
            placeholder="Приложение компании в App Store"
          />

          <b-form-text>
            {{ (query.appStoreUrl || '').length }}/250 символов в формате https://apps.apple.com/yourcompany
          </b-form-text>
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Google Play">
          <b-form-input
            v-model="query.googlePlayUrl"
            :state="googlePlayUrlState"
            placeholder="Приложение компании в Google Play"
          />

          <b-form-text>
            {{ (query.googlePlayUrl || '').length }}/250 символов в формате https://play.google.com/yourcompany
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>

    <h3>
      Реквизиты
    </h3>

    <b-row>
      <b-col md="6">
        <b-form-group label="ИНН">
          <b-form-input
            v-model="query.inn"
            :state="innState"
            placeholder="ИНН компании"
            type="number"
          />
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="КПП">
          <b-form-input
            v-model="query.kpp"
            :state="kppState"
            placeholder="КПП компании"
            type="number"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group label="ОГРН">
          <b-form-input
            v-model="query.ogrn"
            :state="ogrnState"
            placeholder="ОГРН компании"
            type="number"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <b-input-group>
      <b-button
        pill
        variant="primary"
        :disabled="sendEditLoading || !stateValid"
        @click="sendEdit"
      >
        Сохранить
      </b-button>

      <b-icon-arrow-clockwise
        v-if="sendEditLoading"
        class="ml-2 mt-2 text-primary"
        font-scale="1.5"
        animation="spin"
      />
    </b-input-group>

    <p
      v-if="!stateValid"
      class="mt-3 text-danger"
    >
      Одно из полей некорректно, пожалуйста проверьте данные
    </p>

    <p
      v-if="errVk"
      class="mt-3 text-danger"
    >
      Вы ввели ссылку на закрытую группу ВКонтакте. Пожалуйста, откройте группу или не вставляйте ссылку на нее
    </p>

    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
// @ts-ignore - no types for this module
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import apiAddr from '~/helpers/const/apiAddr'
import makeTitle from '~/helpers/makeTitle'
import makeLoginUrl from '~/helpers/makeLoginUrl'
import companyGetters from '~/helpers/company/companyGetters'
import hints from '~/helpers/hints'
import debounce from '~/helpers/debounce'

const addTag = (ctx, type, inputRefName) => {
  return (val) => {
    ctx.$refs[inputRefName].inputValue = ''
    ctx[type] = val
  }
}

const removeTag = (ctx, type) => {
  return () => {
    ctx[type] = {
      id: ''
    }
  }
}

export default Vue.extend({
  components: {
    VueBootstrapTypeahead
  },
  async asyncData (ctx: Context): Promise<object> {
    if (!ctx.store.state?.user?.self?.token) {
      ctx.redirect(makeLoginUrl(ctx.route))
      return
    }

    if (!ctx.params.companySlug) {
      ctx.error({
        statusCode: 404
      })
      return
    }

    const raw = await fetch([
      apiAddr,
      '/v2/company/getBySlug?',
      new URLSearchParams({
        slug: ctx.params.companySlug
      }).toString()
    ].join(''))

    if (!raw.ok) {
      ctx.error({
        statusCode: 404
      })
      return
    }

    const res = await raw.json()
    const comp = res.fullCompany

    return {
      query: {
        addressHouse: companyGetters.safeLocationAddressTitle(comp) || null,
        addressStreet: companyGetters.safeLocationAddress(comp) || null,
        appStoreUrl: companyGetters.safeAppStoreUrl(comp) || null,
        avatarBase64: null,
        categoryId: companyGetters.safeCategoryId(comp) || null,
        cityId: companyGetters.safeLocationCityId(comp) || null,
        companyId: comp.id,
        description: comp.description || null,
        email: comp.email || null,
        facebookUrl: companyGetters.safeSocialFacebookUrl(comp) || null,
        googlePlayUrl: companyGetters.safeGooglePlayUrl(comp) || null,
        inn: comp.inn || null,
        instagramUrl: companyGetters.safeSocialInstagramUrl(comp) || null,
        kpp: comp.kpp || null,
        ogrn: comp.ogrn || null,
        phone: comp.phone || null,
        title: comp.title || null,
        twitterUrl: companyGetters.safeSocialTwitterUrl(comp) || null,
        vkUrl: companyGetters.safeSocialVkScreenName(comp) ? `https://vk.com/${companyGetters.safeSocialVkScreenName(comp)}` : null,
        youtubeUrl: companyGetters.safeSocialYoutubeUrl(comp) || null
      },
      categoryTag: {
        id: companyGetters.safeCategoryId(comp) || null,
        title: companyGetters.safeCategoryTitle(comp),
        slug: companyGetters.safeCategorySlug(comp)
      },
      cityTag: {
        id: companyGetters.safeLocationCityId(comp) || null,
        title: companyGetters.safeLocationCityTitle(comp),
        slug: companyGetters.safeLocationCitySlug(comp)
      }
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
        text: 'Аккаунт',
        to: {
          path: '/account'
        }
      }, {
        id: 3,
        text: 'Мои компании',
        to: {
          path: '/account/companies'
        }
      }, {
        id: 4,
        text: this.$route.params.companySlug,
        to: {},
        active: false
      }, {
        id: 5,
        text: 'Редактировать',
        to: {
          path: `/account/companies/edit/${this.$route.params.companySlug}`
        }
      }],
      file: null,
      category: {
        list: [],
        search: '',
        addTag: addTag(this, 'categoryTag', 'input-category'),
        removeTag: removeTag(this, 'categoryTag')
      },
      city: {
        list: [],
        search: '',
        addTag: addTag(this, 'cityTag', 'input-city'),
        removeTag: removeTag(this, 'cityTag')
      },
      sendEditLoading: false,
      errVk: false
    }
  },
  computed: {
    stateValid () {
      const valid = (val) => {
        if (val === null) {
          return true
        }

        return Boolean(val)
      }

      return valid(this.addressHouseState) &&
          valid(this.addressStreetState) &&
          valid(this.appStoreUrlState) &&
          valid(this.descriptionState) &&
          valid(this.emailState) &&
          valid(this.facebookUrlState) &&
          valid(this.googlePlayUrlState) &&
          valid(this.innState) &&
          valid(this.instagramUrlState) &&
          valid(this.kppState) &&
          valid(this.ogrnState) &&
          valid(this.phoneState) &&
          valid(this.titleState) &&
          valid(this.twitterUrlState) &&
          valid(this.vkUrlState) &&
          valid(this.youtubeUrlState) &&
          valid(this.ogrnState) &&
          valid(this.fileState)
    },
    addressHouseState () {
      return this.validateQueryStrLen(this.query.addressHouse, 50)
    },
    addressStreetState () {
      return this.validateQueryStrLen(this.query.addressStreet, 50)
    },
    appStoreUrlState () {
      return this.validateQuerySocialUrl(this.query.appStoreUrl, 'https://apps.apple.com/')
    },
    descriptionState () {
      return this.validateQueryStrLen(this.query.description, 1500)
    },
    emailState () {
      const len = this.safeLen(this.query.email)

      if (len === 0) {
        return null
      }

      const validLen = len <= 50

      if (!validLen) {
        return false
      }

      if (len !== 0) {
        return new RegExp('[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,6}').test(this.query.email)
      }

      return true
    },
    facebookUrlState () {
      return this.validateQuerySocialUrl(this.query.facebookUrl, 'https://www.facebook.com/')
    },
    googlePlayUrlState () {
      return this.validateQuerySocialUrl(this.query.googlePlayUrl, 'https://play.google.com/')
    },
    innState () {
      return this.validateQueryInt(this.query.inn)
    },
    instagramUrlState () {
      return this.validateQuerySocialUrl(this.query.instagramUrl, 'https://www.instagram.com/')
    },
    kppState () {
      return this.validateQueryInt(this.query.kpp)
    },
    ogrnState () {
      return this.validateQueryInt(this.query.ogrn)
    },
    phoneState () {
      const phone = (this.query.phone || '').toString()

      if (phone.length === 0) {
        return null
      }

      return phone.length === 11 && phone.startsWith('7')
    },
    titleState () {
      return this.validateQueryStrLen(this.query.title, 50)
    },
    twitterUrlState () {
      return this.validateQuerySocialUrl(this.query.twitterUrl, 'https://twitter.com/')
    },
    vkUrlState () {
      return this.validateQuerySocialUrl(this.query.vkUrl, 'https://vk.com/')
    },
    youtubeUrlState () {
      return this.validateQuerySocialUrl(this.query.youtubeUrl, 'https://www.youtube.com/')
    },
    fileState () {
      if (this.file === null) {
        return null
      }

      return this.file?.size <= 200000 && this.file?.name?.split('.').pop() === 'png'
    }
  },
  watch: {
    'category.search': debounce(function (title: string) {
      this.getCategoriesHints(title)
    }, 500),
    'city.search': debounce(function (title: string) {
      this.getCitiesHints(title)
    }, 500)
  },
  methods: {
    ...hints,
    replaceEmptyStrWithZero (obj, ...keys) {
      keys.forEach((key) => {
        if (obj[key] === '') {
          obj[key] = 0
        }
      })
    },
    omitNull (obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === null) {
          delete obj[key]
        }
      })
    },
    async sendEdit () {
      const bodyRaw = JSON.parse(JSON.stringify(this.query))
      this.omitNull(bodyRaw)
      this.replaceEmptyStrWithZero(bodyRaw, 'phone', 'inn', 'kpp', 'ogrn')

      if (this.cityTag.id !== null) {
        bodyRaw.cityId = this.cityTag.id
      }
      if (this.categoryTag.id !== null) {
        bodyRaw.categoryId = this.categoryTag.id
      }
      if (this.file) {
        bodyRaw.avatarBase64 = await this.toBase64(this.file)
      }

      this.sendEditLoading = true
      const raw = await fetch([
        apiAddr,
        '/v1/company/edit'
      ].join(''), {
        method: 'PATCH',
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        }),
        body: JSON.stringify(bodyRaw)
      })
      this.sendEditLoading = false

      if (!raw.ok) {
        const res = await raw.json()

        if (res?.error === 'vk group access denied') {
          this.errVk = true
          return
        }

        this.$nuxt.error({
          statusCode: 500
        })
        return
      }

      this.$nuxt.context.redirect('/account/companies', {
        successMsg: 'Информация о компании отредактирована'
      })
    },
    safeLen (val: string | undefined): number {
      return val?.length || 0
    },
    validateQueryStrLen (val: string, maxLen: number): boolean | null {
      if (this.safeLen(val) === 0) {
        return null
      }

      return this.safeLen(val) <= maxLen
    },
    validateQueryInt (val: string): boolean | null {
      if (this.safeLen(val) === 0) {
        return null
      }

      return Number.isInteger(Number(val))
    },
    validateQuerySocialUrl (val: string, url: string): boolean | null {
      if (this.safeLen(val) === 0) {
        return null
      }

      const validLen = this.safeLen(val) <= 250
      if (!validLen) {
        return false
      }

      if (this.safeLen(val) !== 0) {
        return val.startsWith(url)
      }

      return true
    },
    toBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result.slice(22))
        reader.onerror = error => reject(error)
      })
    }
  },
  head: {
    title: makeTitle('Редактировать информацию о компании')
  }
})
</script>
