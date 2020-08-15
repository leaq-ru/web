export default async (querystring: string): Promise<any> => {
  try {
    const rawCompanies = await fetch([
      process.env.API_HOST,
      '/v1/company/get?',
      querystring
    ].join(''))

    const result = await rawCompanies.json()
    return result
  } catch {
    return {
      companies: [],
      totalCount: 0
    }
  }
}
