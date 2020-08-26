export default (d: string): Date => {
  if (!d) {
    return new Date()
  }

  const values = d.split(/[^0-9]/)
  const year = parseInt(values[0], 10)
  const month = parseInt(values[1], 10) - 1 // Month is zero based, so subtract 1
  const day = parseInt(values[2], 10)
  const hours = parseInt(values[3], 10)
  const minutes = parseInt(values[4], 10)
  const seconds = parseInt(values[5], 10)

  return new Date(year, month, day, hours, minutes, seconds)
}
