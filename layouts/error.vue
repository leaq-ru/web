<template>
  <b-container fluid="xl">
    <Header />
    <b-breadcrumb :items="breadcrumb" />

    <div class="text-center">
      <h1
        v-if="error.statusCode === 404"
        class="mb-5"
      >
        Страница не найдена
      </h1>
      <h1
        v-else
        class="mb-5"
      >
        Произошла ошибка
      </h1>

      <div>
        <b-icon-emoji-frown
          variant="secondary"
          scale="6"
          class="mb-5"
        />
      </div>

      <div>
        <b-link to="/">
          <b-icon-arrow-left-circle />
          Вернуться на главную
        </b-link>
      </div>

      <Footer />
    </div>

    <client-only>
      <script type="text/javascript" src="https://vk.com/js/api/openapi.js?168" />
      <script type="text/javascript">
        VK.Widgets.CommunityMessages('vk_community_messages', 197531682, {
        disableExpandChatSound: '1',
        disableNewMessagesSound: '1',
        tooltipButtonText: 'Есть вопрос?',
        })
      </script>
      <script type="text/javascript">
        !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://vk.com/js/api/openapi.js?168",t.onload=function(){VK.Retargeting.Init("VK-RTRG-518954-fF7rQ"),VK.Retargeting.Hit()},document.head.appendChild(t)}();
      </script><noscript><img src="https://vk.com/rtrg?p=VK-RTRG-518954-fF7rQ" style="position:fixed; left:-999px;" alt=""/></noscript>
      <div id="vk_community_messages" />
    </client-only>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { NuxtError } from '~/.nuxt'

export default Vue.extend({
  props: {
    error: {
      type: NuxtError,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      breadcrumb: [{
        text: '🏠',
        to: {
          path: '/'
        }
      }, {
        text: 'Ошибка'
      }]
    }
  },
  head () {
    return {
      title: 'Ошибка'
    }
  }
})
</script>
