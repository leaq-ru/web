export default {
  safeLocationName (o) {
    return o?.location?.name
  },
  safeLocationSlug (o) {
    return o?.location?.slug
  },
  safeAreaTypeFull (o) {
    return o?.area?.typeFull
  },
  safeAreaSlug (o) {
    return o?.area?.slug
  },
  safeAreaName (o) {
    return o?.area?.name
  },
  safeOkvedSlug (o) {
    return o?.okved?.slug
  },
  safeOkvedName (o) {
    return o?.okved?.name
  },
  safeManagerName (o) {
    return o?.manager?.name
  },
  safeManagerSlug (o) {
    return o?.manager?.slug
  }
}
