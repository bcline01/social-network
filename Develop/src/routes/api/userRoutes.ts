import { Router } from 'express';
const router = Router();
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} from '../../controllers/userController.js';

// /api/students
router.route('/').get(getUsers).post(createUser);

// /api/students/:studentId
router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);

// /api/students/:studentId/assignments
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

// /api/students/:studentId/assignments/:assignmentId
// router.route('/:studentId/assignments/:assignmentId').delete(removeAssignment);

export { router as studentRouter} ;
