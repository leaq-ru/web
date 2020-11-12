export default (prodVal, devVal) => {
  return process.env.NODE_ENV === 'production' ? prodVal : devVal
}
