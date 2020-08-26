<template>
  <client-only>
    <!-- VK Messages Widget -->
    <script type="text/javascript" src="https://vk.com/js/api/openapi.js?168" />
    <div id="vk_community_messages" />
    <script type="text/javascript">
      VK.Widgets.CommunityMessages("vk_community_messages", 197531682, {disableExpandChatSound: "1",disableNewMessagesSound: "1",tooltipButtonText: "Есть вопрос?"});
    </script>
    <!-- /VK Messages Widget -->

    <!-- VK Pixel -->
    <script type="text/javascript">
      !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://vk.com/js/api/openapi.js?168",t.onload=function(){VK.Retargeting.Init("VK-RTRG-518954-fF7rQ"),VK.Retargeting.Hit()},document.head.appendChild(t)}();
    </script><noscript><img src="https://vk.com/rtrg?p=VK-RTRG-518954-fF7rQ" style="position:fixed; left:-999px;" alt=""/></noscript>
    <!-- /VK Pixel -->

    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(66609163, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true
      });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/66609163" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-175908787-1" />
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-175908787-1');
    </script>
    <!-- /Global site tag (gtag.js) - Google Analytics -->
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
