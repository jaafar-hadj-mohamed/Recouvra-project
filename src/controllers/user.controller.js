const User = require('../models/User');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.utils');

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(),
    ]);

    return paginatedResponse(res, users, page, limit, total);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, { user });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/me
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    return successResponse(res, { user }, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a user (admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, {}, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateProfile, deleteUser };
