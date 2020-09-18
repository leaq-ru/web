<template>
  <div>
    <Nuxt />

    <script type="text/javascript" src="https://vk.com/js/api/openapi.js?168" />

    <script type="text/javascript">
      VK.Widgets.CommunityMessages('vk_community_messages', 197531682, {
      disableExpandChatSound: '1',
      disableNewMessagesSound: '1',
      tooltipButtonText: 'Есть вопрос?',
      })
    </script>
    <div id="vk_community_messages" />

    <script type="text/javascript">
      !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://vk.com/js/api/openapi.js?168",t.onload=function(){VK.Retargeting.Init("VK-RTRG-518954-fF7rQ"),VK.Retargeting.Hit()},document.head.appendChild(t)}();
    </script><noscript><img src="https://vk.com/rtrg?p=VK-RTRG-518954-fF7rQ" style="position:fixed; left:-999px;" alt=""/></noscript>
  </div>
</template>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
