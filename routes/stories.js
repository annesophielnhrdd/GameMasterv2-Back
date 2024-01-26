import { Router } from 'express';
import { Story } from '../models';
import { checkBody } from '../modules';

const router = Router();

/* Save a new story. (save the story in stories collection & save datas in inProgressStories of gameMaster user db) */
router.post('/', (req, res) => {});

/* Get stories by user token. */
router.get('/stories', (req, res) => {});

/* Get story by id. */
router.get('/story', (req, res) => {});

export default router;
