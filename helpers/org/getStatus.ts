export default (status: string): {
  text: string,
  color: string,
} => {
  const data = {
    text: '—',
    color: 'secondary'
  }
  switch (status) {
    case 'ACTIVE':
      data.text = 'Действующая'
      data.color = 'success'
      break
    case 'LIQUIDATING':
      data.text = 'Ликвидируется'
      data.color = 'warning'
      break
    case 'REORGANIZING':
      data.text = 'В процессе присоединения к другому юрлицу, с последующей ликвидацией'
      data.color = 'warning'
      break
    case 'LIQUIDATED':
      data.text = 'Ликвидирована'
      data.color = 'danger'
      break
    case 'BANKRUPT':
      data.text = 'Банкротство'
      data.color = 'danger'
      break
  }
  return data
}
