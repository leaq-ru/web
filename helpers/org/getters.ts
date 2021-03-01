export default {
  safeMainLocationName (o) {
    return o?.main?.location?.name
  },
  safeMainLocationSlug (o) {
    return o?.main?.location?.slug
  },
  safeMainAreaTypeFull (o) {
    return o?.main?.area?.typeFull
  }
}
