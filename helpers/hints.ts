export default {
  async getCitiesHints (title: string) {
    const raw = await fetch([
      process.env.API_HOST,
      '/v1/city/getHints?',
      new URLSearchParams({
        title,
        limit: '7'
      }).toString()
    ].join('')).catch()
    const res = await raw.json()
    this.city.list = res.cities || []
  },
  async getCategoriesHints (title: string) {
    const raw = await fetch([
      process.env.API_HOST,
      '/v1/category/getHints?',
      new URLSearchParams({
        title,
        limit: '7'
      }).toString()
    ].join('')).catch()
    const res = await raw.json()
    this.category.list = res.categories || []
  },
  async getTechnologiesHints (name: string) {
    const params = new URLSearchParams({
      name,
      limit: '7'
    })
    this.technology.tags.forEach(({ id }) => {
      params.append('excludeIds', id)
    })

    const raw = await fetch([
      process.env.API_HOST,
      '/v1/technology/getHints?',
      params.toString()
    ].join('')).catch()
    const res = await raw.json()
    this.technology.list = res.technologies || []
  }
}
