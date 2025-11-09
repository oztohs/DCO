import React, { useEffect, useState } from 'react';
import { getShopItems, buyShopItem } from '../../api/axiosShop';
import { toast } from 'react-toastify';
import Main from '../../components/main/Main';
import axiosInstance from '../../api/axiosInstance';
import '../../assets/scss/shop/ShopPage.scss';

interface ShopItem {
  _id: string;
  name: string;
  description: string;
  price: number;
}

const ShopPage: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null); // ✅ 현재 보유 코인

  // ✅ 유저 잔액 불러오기
  const fetchBalance = async () => {
    try {
      const res = await axiosInstance.get('/user/me');
      console.log('🪙 [ShopPage] /user/me 응답:', res.data);
      setBalance(res.data.user.htoCoin);
    } catch (err) {
      console.error('❌ [ShopPage] 잔액 불러오기 실패:', err);
      toast.error('유저 정보를 불러오지 못했습니다.');
    }
  };

  // ✅ 아이템 목록 불러오기
  const fetchItems = async () => {
    try {
      const data = await getShopItems();
      console.log('🧩 [ShopPage] 상점 아이템:', data);
      setItems(data);
    } catch (err) {
      console.error('❌ [ShopPage] 상점 정보 불러오기 실패:', err);
      toast.error('상점 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 페이지 로드 시 (처음 한 번만 실행)
  useEffect(() => {
    fetchBalance();
    fetchItems();
  }, []);

  // ✅ balance 값 변경 시마다 콘솔 출력
  useEffect(() => {
    console.log('🪙 [ShopPage] 현재 balance 값:', balance);
  }, [balance]);

  // ✅ 아이템 구매 처리
  const handleBuy = async (itemId: string) => {
    try {
      const result = await buyShopItem(itemId);
      toast.success(result.msg);
      console.log('✅ [ShopPage] 구매 완료:', result);
      await fetchBalance(); // ✅ 구매 후 코인 잔액 즉시 갱신
    } catch (err: any) {
      console.error('❌ [ShopPage] 구매 실패:', err);
      toast.error(err.response?.data?.msg || '구매 실패');
    }
  };

  return (
    <Main>
      <div className="shop-cyber-container">
        <div className="shop-background-grid" />

        <div className="shop-mode-module">
          <h1 className="shop-title" data-text="SHOP TERMINAL">
            SHOP TERMINAL
          </h1>

          {/* ✅ 현재 코인 표시 */}
          {balance !== null && (
            <p className="shop-balance">CURRENT BALANCE: {balance} HTO</p>
          )}

          {loading ? (
            <p className="shop-loading">Loading...</p>
          ) : (
            <div className="shop-item-grid">
              {items.length === 0 ? (
                <p className="no-items">현재 판매 중인 아이템이 없습니다.</p>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="shop-card">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-desc">{item.description}</p>
                    <div className="shop-footer">
                      <span className="price">{item.price} HTO</span>
                      <button
                        className="buy-btn"
                        onClick={() => handleBuy(item._id)}
                      >
                        [ BUY ]
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ✅ 인벤토리 버튼만 유지 */}
          <div className="shop-buttons">
            <button
              className="inventory-btn"
              onClick={() => (window.location.href = '/inventory')}
            >
              [ INVENTORY ]
            </button>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default ShopPage;
