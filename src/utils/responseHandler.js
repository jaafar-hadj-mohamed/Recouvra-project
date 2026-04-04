export const successResponse = (res, data, message = 'Operation successful') => {
  return res.json({ success: true, message, data })
}

export const errorResponse = (res, message = 'Something went wrong', data = null, status = 400) => {
  return res.status(status).json({ success: false, message, data })
}
