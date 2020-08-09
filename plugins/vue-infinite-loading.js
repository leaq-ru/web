import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'

export default () => {
  Vue.use(InfiniteLoading, {
    slots: {
      noResults: '',
      noMore: ''
    }
  })
}
