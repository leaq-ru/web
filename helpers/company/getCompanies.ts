import apiAddr from '~/helpers/const/apiAddr'

export default async ({
  addr = apiAddr,
  querystring
}: {
  addr?: string
  querystring: string
}): Promise<any> => {
  try {
    const rawCompanies = await fetch([
      addr,
      '/v1/company/get?',
      querystring
    ].join(''))

    const result = await rawCompanies.json()
    return result
  } catch {
    return {
      companies: []
    }
  }
}
