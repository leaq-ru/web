export const state = () => ({
  self: {
    id: '',
    vkId: 0,
    token: '',
    firstName: '',
    lastName: '',
    photo: '',
    photoRec: ''
  }
})

export const mutations = {
  login (state, val = {}) {
    state.self = val
  },
  logout (state) {
    state.self = {}
  }
}
