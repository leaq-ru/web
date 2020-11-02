export const state = () => ({
  page: ''
})

export const mutations = {
  set (state, val = '') {
    state.page = val
  }
}
