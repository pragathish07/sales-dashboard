import { Router } from 'express';
import customerController from './customers.controller';

const router = Router();

// Public: list and get
router.get('/', customerController.list.bind(customerController));
router.get('/:id', customerController.getById.bind(customerController));

// Create
router.post('/', customerController.create.bind(customerController));

// Update/Delete
router.put('/:id', customerController.update.bind(customerController));
router.delete('/:id', customerController.delete.bind(customerController));

export default router;
