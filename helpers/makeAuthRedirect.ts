export enum authKind {
  vk,
  yandex,
}

export default (to: string, kind: authKind): string => {
  switch (kind) {
    case authKind.vk: {
      const vkAppId = process.env.VK_APPID
      const host = process.env.HOST

      return `https://oauth.vk.com/authorize?client_id=${vkAppId}&display=page&scope=email&redirect_uri=${host}/vk-auth&response_type=code&v=5.124&state=${to}`
    }

    case authKind.yandex: {
      const yaAppId = process.env.YANDEX_APPID
      return `https://oauth.yandex.ru/authorize?client_id=${yaAppId}&response_type=code&state=${to}`
    }
  }
}
