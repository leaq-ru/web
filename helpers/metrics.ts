import yandexMetrika from '~/helpers/const/yandexMetrika'
import goal from '~/helpers/const/goal'

const reachGoal = 'reachGoal'

export default {
  async csvDownload () {
    const w = window as any
    if (w.ym) {
      await w.ym(yandexMetrika.counter, reachGoal, goal.csvDownload)
    }
  },
  async emailDownload () {
    const w = window as any
    if (w.ym) {
      await w.ym(yandexMetrika.counter, reachGoal, goal.emailDownload)
    }
  },
  async phoneDownload () {
    const w = window as any
    if (w.ym) {
      await w.ym(yandexMetrika.counter, reachGoal, goal.phoneDownload)
    }
  }
}
