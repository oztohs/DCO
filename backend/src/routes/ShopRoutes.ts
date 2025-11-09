import express from 'express';
import { verifyToken } from '../middlewares/Token';
import {
  getShopItems,
  buyShopItem,
} from '../controllers/ShopController';

const ShopRoutes = express.Router();

/** 🎯 상점 아이템 목록 가져오기 (비로그인도 가능) */
ShopRoutes.get('/items', getShopItems);

/** 💰 아이템 구매 (로그인 필요) */
ShopRoutes.post('/buy', verifyToken, buyShopItem);

export default ShopRoutes;
