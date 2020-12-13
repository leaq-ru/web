export default (num: number, separator: string): string => {
  if (!num) {
    return '—'
  }

  const str = String(num).split('').reverse()
  str.forEach((elem, i) => {
    if (i % 3 === 0 && i !== 0) {
      str[i] = elem + separator
    }
  })
  return str.reverse().join('')
}
