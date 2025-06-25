import { Router } from 'express';
import { renderLogin, renderRegister } from '../controllers/view.controller.js';

const router = Router();

router.get('/login', renderLogin);
router.get('/register', renderRegister);

export default router;