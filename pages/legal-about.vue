<template>
  <b-container fluid="xl">
    <Header />
    <Breadcrumb :items="breadcrumb" />

    <h2>
      Реквизиты
    </h2>

    <p>
      ИП Аверьянов Денис Андреевич
      <br>
      603010, Россия, Нижегородская обл, Нижний Новгород, Климовская, 10, 23
      <br>
      ИНН 525718935165
      <br>
      ОГРНИП 321527500077390
      <br>
      Расчётный счёт 40802810501500199738
      <br>
      Корр. счёт 30101810845250000999
      <br>
      БИК 044525999 Точка ПАО Банка «ФК Открытие» г. Москва
      <br>
      E-mail denisomfg@gmail.com
    </p>
    <Footer />
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import makeTitle from '~/helpers/makeTitle'

export default Vue.extend({
  data (): any {
    return {
      breadcrumb: [{
        id: 1,
        text: '🏠',
        to: {
          path: '/'
        }
      }, {
        id: 2,
        text: 'Реквизиты',
        to: {
          path: '/legal-about'
        }
      }]
    }
  },
  head () {
    return {
      title: makeTitle('Реквизиты'),
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'Реквизиты сервиса LEAQ'
      }]
    }
  }
})
</script>
