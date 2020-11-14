import { Vue } from 'vue/types/vue'

export default (route: Vue['$route']): string => {
  let path = '/'
  if (route.fullPath) {
    path = route.fullPath
  }
  const vkAppId = process.env.VK_APPID
  const host = process.env.HOST

  return `https://oauth.vk.com/authorize?client_id=${vkAppId}&display=page&scope=email&redirect_uri=${host}/vk-auth&response_type=code&v=5.124&state=${path}`
}
