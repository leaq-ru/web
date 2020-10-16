const isBot = (header) => {
  if (!header) {
    return false
  }

  const lowHeader = header.toLowerCase()
  const bots = ['bot', 'google', 'baidu', 'bing', 'msn', 'teoma', 'slurp', 'yandex']

  for (const bot of bots) {
    if (lowHeader.includes(bot)) {
      return true
    }
  }

  return false
}

module.exports = (req, res, next) => {
  res.spa = !isBot(req.headers['user-agent'])
  next()
}
