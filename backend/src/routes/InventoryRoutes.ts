import express from 'express';
import { verifyToken } from '../middlewares/Token';
import { getInventory, useInventoryItem } from '../controllers/InventoryController';

const InventoryRoutes = express.Router();

InventoryRoutes.get('/list', verifyToken, getInventory);
InventoryRoutes.patch('/:invId/use', verifyToken, useInventoryItem);

export default InventoryRoutes;
