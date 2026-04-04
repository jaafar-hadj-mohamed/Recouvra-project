import CollectionAction from '../models/CollectionAction.js'
import { successResponse, errorResponse } from '../utils/responseHandler.js'

export const createAction = async (req, res, next) => {
  try {
    const action = await CollectionAction.create(req.body)
    return successResponse(res, action, 'Action recorded')
  } catch (e) {
    return next(e)
  }
}

export const getActions = async (req, res, next) => {
  try {
    const actions = await CollectionAction.find().populate('client').populate('agent')
    return successResponse(res, actions, 'Actions retrieved')
  } catch (e) {
    return next(e)
  }
}

export default { createAction, getActions }
