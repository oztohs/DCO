import axiosInstance from './axiosInstance';
import { ShopItem } from '../types/ShopItem';

/** 🛒 상점 아이템 목록 가져오기 */
export const getShopItems = async (): Promise<ShopItem[]> => {
  const res = await axiosInstance.get('/shop/items'); // ✅ GET /api/shop/items
  return res.data?.items ?? [];
};

/** 💰 아이템 구매 (유저 토큰 필요) */
export const buyShopItem = async (
  itemId: string
): Promise<{ msg: string; updatedTokens?: number }> => {
  const res = await axiosInstance.post('/shop/buy', { itemId }); // ✅ POST /api/shop/buy
  return {
    msg: res.data?.msg ?? '구매 완료',
    updatedTokens: res.data?.updatedTokens,
  };
};

/** 🎒 내 인벤토리 조회 */
export const getInventory = async (): Promise<
  { _id: string; name: string; description: string; quantity: number }[]
> => {
  const res = await axiosInstance.get('/inventory/list'); // ✅ GET /api/inventory/list
  return res.data?.inventory ?? [];
};

/** 🧩 인벤토리 아이템 사용 */
export const useInventoryItem = async (
  invId: string
): Promise<{ msg: string }> => {
  const res = await axiosInstance.patch(`/inventory/${invId}/use`); // ✅ PATCH /api/inventory/:invId/use
  return { msg: res.data?.msg ?? '아이템을 사용했습니다.' };
};

/** ---------- 🧑‍💼 관리자 전용 ---------- */

/** 상점 아이템 생성 */
export const createItem = async (payload: {
  name: string;
  price: number;
  description?: string;
  isListed?: boolean;
  imageUrl?: string;
}) => {
  const res = await axiosInstance.post('/shop/admin/create', payload);
  return res.data;
};

/** 상점 아이템 수정 */
export const updateItem = async (
  id: string,
  payload: Partial<{
    name: string;
    price: number;
    description: string;
    isListed: boolean;
    imageUrl: string;
  }>
) => {
  const res = await axiosInstance.put(`/shop/admin/${id}`, payload);
  return res.data;
};
