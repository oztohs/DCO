import { Request, Response } from 'express';
import ShopItem from '../models/ShopItem';
import User from '../models/User';
import Inventory from '../models/Inventory';

/** 🎯 상점 아이템 목록 가져오기 */
export const getShopItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await ShopItem.find({ isListed: true }).sort({ price: 1 });
    res.status(200).json({ message: 'OK', items });
  } catch (err) {
    console.error('❌ getShopItems error:', err);
    res.status(500).json({ message: 'ERROR', msg: '서버 오류' });
  }
};

/** 🛒 아이템 구매 처리 */
export const buyShopItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.jwtData?.id;
    const { itemId } = req.body;

    if (!userId || !itemId) {
      res.status(400).json({ message: 'ERROR', msg: '요청 정보가 올바르지 않습니다.' });
      return;
    }

    const user = await User.findById(userId);
    const item = await ShopItem.findById(itemId);

    if (!user || !item) {
      res.status(404).json({ message: 'ERROR', msg: '유저 또는 아이템을 찾을 수 없습니다.' });
      return;
    }

    // 💰 잔액 확인
    if (user.htoCoin < item.price) {
      res.status(400).json({ message: 'ERROR', msg: '보유 코인이 부족합니다.' });
      return;
    }

    // 💸 코인 차감
    user.htoCoin -= item.price;
    await user.save();

    // 🎲 랜덤 버프 처리
    let finalItem = item;
    if (item.type === 'random_buff') {
      const rand = Math.random();
      const randomResult = rand < 0.7 ? '힌트권 1회권' : '시간 정지권';
      const randomItem = await ShopItem.findOne({ name: randomResult });
      if (randomItem) finalItem = randomItem;
    }

    // 🎁 인벤토리 확인 후 처리
    const existing = await Inventory.findOne({
      user: user._id,
      item: finalItem._id,
    });

    if (existing) {
      existing.quantity = (existing.quantity ?? 0) + 1;
      await existing.save();
    } else {
      await Inventory.create({
        user: user._id,
        item: finalItem._id,
        itemName: finalItem.name,
        isUsed: false,
        acquiredAt: new Date(),
        quantity: 1,
      });
    }

    res.status(200).json({
      message: 'OK',
      msg: `${finalItem.name}을(를) 획득했습니다!`,
      updatedTokens: user.htoCoin,
    });
  } catch (err) {
    console.error('❌ buyShopItem error:', err);
    res.status(500).json({ message: 'ERROR', msg: '서버 오류가 발생했습니다.' });
  }
};
