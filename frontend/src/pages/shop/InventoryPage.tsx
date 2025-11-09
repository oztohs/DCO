import React, { useEffect, useState } from 'react';
import { getInventory, useInventoryItem } from '../../api/axiosShop';
import { toast } from 'react-toastify';
import '../../assets/scss/shop/InventoryPage.scss';

interface InventoryItem {
  _id: string;
  name: string;
  description: string;
  quantity: number;
}

const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (err) {
        toast.error('인벤토리를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleUseItem = async (id: string) => {
    try {
      const result = await useInventoryItem(id);
      toast.success(result.msg);
      // 사용 후 수량 1 감소 처리
      setInventory((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0 }
            : item
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.msg || '아이템 사용 실패');
    }
  };

  if (loading) return <div className="inventory-loading">Loading...</div>;

  return (
    <div className="inventory-container">
      <h2>🎒 내 인벤토리</h2>
      <div className="inventory-list">
        {inventory.length === 0 ? (
          <p className="inventory-empty">보유한 아이템이 없습니다.</p>
        ) : (
          inventory.map((item) => (
            <div
              className={`inventory-item ${item.quantity === 0 ? 'used' : ''}`}
              key={item._id}
            >
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>보유 수량: {item.quantity}</p>
              <button
                disabled={item.quantity === 0}
                onClick={() => handleUseItem(item._id)}
              >
                {item.quantity === 0 ? '모두 사용됨' : '사용하기'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
