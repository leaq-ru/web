import unifyDate from '~/helpers/unifyDate'

export default {
  toShowedPhone (phone: number): string {
    if (!phone) {
      return '—'
    }

    const str = String(phone)
    if (str.length !== 11) {
      return '+' + str
    }

    let r = '+'
    str.split('').forEach((elem, i) => {
      switch (i) {
        case 1:
          r += ' (' + elem
          break
        case 3:
          r += elem + ') '
          break
        case 6:
          r += elem + '-'
          break
        case 8:
          r += elem + '-'
          break
        default:
          r += elem
      }
    })
    return r
  },
  toShowedDate (date: string): string {
    return unifyDate(date).toLocaleDateString()
  },
  safeAppStoreUrl (company) {
    return company.app?.appStore?.url
  },
  safeGooglePlayUrl (company) {
    return company.app?.googlePlay?.url
  },
  safeCategoryId (company) {
    return company.category?.id
  },
  safeCategoryTitle (company) {
    return company.category?.title
  },
  safeCategorySlug (company) {
    return company.category?.slug
  },
  safeLocationCityTitle (company) {
    return company.location?.city?.title
  },
  safeShortCityTitle (company) {
    return company.city?.title
  },
  safeLocationCitySlug (company) {
    return company.location?.city?.slug
  },
  safeShortCitySlug (company) {
    return company.city?.slug
  },
  safeLocationAddress (company) {
    return company.location?.address
  },
  safeLocationAddressTitle (company) {
    return company.location?.addressTitle
  },
  safeSocialVkId (company) {
    return company.social?.vk?.groupId
  },
  safeSocialVkName (company) {
    return company.social?.vk?.name
  },
  safeSocialVkDescription (company) {
    return company.social?.vk?.description
  },
  safeSocialVkPhoto200 (company) {
    return company.social?.vk?.photo200
  },
  safeSocialVkScreenName (company) {
    return company.social?.vk?.screenName
  },
  safeSocialVkMembersCount (company) {
    return company.social?.vk?.membersCount
  },
  safeSocialInstagramUrl (company) {
    return company.social?.instagram?.url
  },
  safeSocialTwitterUrl (company) {
    return company.social?.twitter?.url
  },
  safeSocialYoutubeUrl (company) {
    return company.social?.youtube?.url
  },
  safeSocialFacebookUrl (company) {
    return company.social?.facebook?.url
  },
  safeTechnologyCategoriesLength (elem) {
    if (elem?.technologies?.length) {
      return elem.technologies.length
    }
    return 0
  },
  relatedLink (company) {
    const result = ['all', 'all']
    if (this.safeShortCitySlug(company)) {
      result[0] = this.safeShortCitySlug(company)
    }
    if (this.safeCategorySlug(company)) {
      result[1] = this.safeCategorySlug(company)
    }
    return '/' + result.join('/')
  }
}
