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
      '/v2/company/get?',
      querystring
    ].join(''))

    const result = await rawCompanies.json()
    if (result?.companies) {
      return result
    }

    return {
      companies: []
    }
  } catch {
    return {
      companies: []
    }
  }
}
