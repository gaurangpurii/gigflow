import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leadController';
import authMiddleware from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/rbacMiddleware';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.get('/export', exportLeads);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead);

export default router;