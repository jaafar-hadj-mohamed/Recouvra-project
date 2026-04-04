export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err)
  const status = err?.status || 500
  const message = err?.message || 'Internal Server Error'
  const data = err?.data || null
  res.status(status).json({ success: false, message, data })
}
