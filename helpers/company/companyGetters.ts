import unifyDate from '~/helpers/unifyDate'

const safeString = (val) => {
  if (!val) {
    return ''
  }

  return val
}

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
    return safeString(company.app?.appStore?.url)
  },
  safeGooglePlayUrl (company) {
    return safeString(company.app?.googlePlay?.url)
  },
  safeCategoryId (company) {
    return safeString(company.category?.id)
  },
  safeCategoryTitle (company) {
    return safeString(company.category?.title)
  },
  safeCategorySlug (company) {
    return safeString(company.category?.slug)
  },
  safeLocationCityTitle (company) {
    return safeString(company.location?.city?.title)
  },
  safeShortCityTitle (company) {
    return safeString(company.city?.title)
  },
  safeLocationCityId (company) {
    return safeString(company.location?.city?.id)
  },
  safeLocationCitySlug (company) {
    return safeString(company.location?.city?.slug)
  },
  safeShortCitySlug (company) {
    return safeString(company.city?.slug)
  },
  safeLocationAddress (company) {
    return safeString(company.location?.address)
  },
  safeLocationAddressTitle (company) {
    return safeString(company.location?.addressTitle)
  },
  safeSocialVkId (company) {
    return safeString(company.social?.vk?.groupId)
  },
  safeSocialVkName (company) {
    return safeString(company.social?.vk?.name)
  },
  safeSocialVkDescription (company) {
    return safeString(company.social?.vk?.description)
  },
  safeSocialVkPhoto200 (company) {
    return safeString(company.social?.vk?.photo200)
  },
  safeSocialVkScreenName (company) {
    return safeString(company.social?.vk?.screenName)
  },
  safeSocialVkMembersCount (company) {
    return safeString(company.social?.vk?.membersCount)
  },
  safeSocialInstagramUrl (company) {
    return safeString(company.social?.instagram?.url)
  },
  safeSocialTwitterUrl (company) {
    return safeString(company.social?.twitter?.url)
  },
  safeSocialYoutubeUrl (company) {
    return safeString(company.social?.youtube?.url)
  },
  safeSocialFacebookUrl (company) {
    return safeString(company.social?.facebook?.url)
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
