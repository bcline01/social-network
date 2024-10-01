import { Router } from 'express';
import { courseRouter } from './courseRoutes.js';
import { studentRouter } from './userRoutes.js';

const router = Router();

router.use('/courses', courseRouter);
router.use('/students', studentRouter);

export default router;
