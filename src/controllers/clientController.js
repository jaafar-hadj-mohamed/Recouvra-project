import Client from '../models/Client.js'
import { successResponse, errorResponse } from '../utils/responseHandler.js'

export const createClient = async (req, res, next) => {
  try {
    const client = await Client.create(req.body)
    return successResponse(res, client, 'Client created')
  } catch (e) {
    return next(e)
  }
}

export const getClients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const clients = await Client.find().skip(skip).limit(Number(limit))
    const total = await Client.countDocuments()
    return successResponse(res, { total, page: Number(page), limit: Number(limit), data: clients }, 'Clients retrieved')
  } catch (e) {
    return next(e)
  }
}

export const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
    if (!client) return errorResponse(res, 'Client not found', null, 404)
    return successResponse(res, client, 'Client retrieved')
  } catch (e) {
    return next(e)
  }
}

export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!client) return errorResponse(res, 'Client not found', null, 404)
    return successResponse(res, client, 'Client updated')
  } catch (e) {
    return next(e)
  }
}

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id)
    if (!client) return errorResponse(res, 'Client not found', null, 404)
    return successResponse(res, null, 'Client deleted')
  } catch (e) {
    return next(e)
  }
}

export default { createClient, getClients, getClientById, updateClient, deleteClient }
