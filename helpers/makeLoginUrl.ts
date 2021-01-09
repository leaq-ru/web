type fullPath = {
  fullPath?: string
}

export default (route: fullPath): string => {
  let path = '/'
  if (route.fullPath) {
    path = route.fullPath
  }

  return `/login?to=${path}`
}
