import { Request, Response } from 'express';
import Inventory from '../models/Inventory';

/** 🎒 내 인벤토리 조회 */
export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.jwtData.id;
    const items = await Inventory.find({ user: userId })
      .populate('item')
      .sort({ acquiredAt: -1 });

    res.status(200).json({ message: 'OK', inventory: items });
  } catch (err) {
    console.error('❌ getInventory error:', err);
    res.status(500).json({ message: 'ERROR', msg: '서버 오류' });
  }
};

/** 🧩 인벤토리 아이템 사용 */
export const useInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.jwtData.id;
    const { invId } = req.params;

    const inventoryItem = await Inventory.findOne({ _id: invId, user: userId });

    if (!inventoryItem) {
      res.status(404).json({ message: 'ERROR', msg: '아이템을 찾을 수 없습니다.' });
      return;
    }

    if (inventoryItem.isUsed) {
      res.status(400).json({ message: 'ERROR', msg: '이미 사용한 아이템입니다.' });
      return;
    }

    inventoryItem.isUsed = true;
    await inventoryItem.save();

    res.status(200).json({ message: 'OK', msg: `${inventoryItem.itemName}을(를) 사용했습니다.` });
  } catch (err) {
    console.error('❌ useInventoryItem error:', err);
    res.status(500).json({ message: 'ERROR', msg: '서버 오류' });
  }
};
