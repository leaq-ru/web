import apiAddr from '~/helpers/const/apiAddr'

export enum downloadType {
  email = 'email',
  phone = 'phone',
  csv = 'csv',
}

export enum downloadRes {
  ok = 0,
  errUnknown = 1,
  errConcExports = 2,
}

export default async (querystring: string, type: downloadType, premium: boolean, token: string): Promise<downloadRes> => {
  const opts:RequestInit = {}
  if (token) {
    opts.headers = new Headers({
      Authorization: `Bearer ${token}`
    })
  }

  if (type === downloadType.csv) {
    const path = premium ? 'exportCompaniesAsync' : 'exportCompanies'

    const raw = await fetch([
      apiAddr,
      `/v1/exporter/${path}?`,
      querystring
    ].join(''), opts)

    if (!raw.ok) {
      const res = await raw.json()
      if (res?.error === 'too many concurrent exports. Wait for old export succeeded, and try again') {
        return downloadRes.errConcExports
      }

      return downloadRes.errUnknown
    }

    if (!premium) {
      const res = await raw.json()
      window.location.assign(res.url)
    }
    return downloadRes.ok
  }

  let apiPath
  switch (type) {
    case downloadType.email:
      apiPath = 'getEmailList'
      break
    case downloadType.phone:
      apiPath = 'getPhoneList'
      break
    default:
      throw new Error('unknown downloadType')
  }

  const raw = await fetch([
    apiAddr,
    `/v1/company/${apiPath}?`,
    querystring
  ].join(''), opts)

  const res = await raw.json()

  window.location.assign(res.downloadUrl)
}
