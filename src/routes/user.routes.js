const express = require('express');
const router = express.Router();

const { getAllUsers, getUserById, updateProfile, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateUserSchema } = require('../validators/auth.validator');

router.use(protect); // All user routes require authentication

router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/me', validate(updateUserSchema), updateProfile);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
