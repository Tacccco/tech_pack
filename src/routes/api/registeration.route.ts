import express from 'express';

import multerHandler from '../../middlewares/multerHandler';
import * as controller from '../../controllers/registeration.controller';

const router = express.Router();

router
    .route('/register')
    .post(multerHandler.recognitionFormFileHandler, controller.register);

export default router;
