import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShopItem from '../models/ShopItem';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hto';

const seedShopItems = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    await ShopItem.deleteMany({});
    console.log('🧹 Old shop items cleared');

    const items = [
      {
        name: '힌트권 1회권',
        description: '어려운 문제에 단서가 필요할 때 사용합니다.',
        price: 3,
        type: 'hint',
        isListed: true
      },
      {
        name: '힌트권 3회권',
        description: '어려운 문제에 단서가 필요할 때 사용합니다.',
        price: 7,
        type: 'hint_bundle',
        isListed: true
      },
      {
        name: '시간 정지권',
        description: '문제를 풀 때 문제 타이머를 30초 정지할 수 있습니다.',
        price: 10,
        type: 'time_freeze',
        isListed: true
      },
      {
        name: '랜덤 버프 패키지',
        description: '개봉 시 힌트권 1회권 또는 시간 정지권 중 하나를 랜덤으로 획득합니다.',
        price: 6,
        type: 'random_buff',
        isListed: true
      }
    ];

    await ShopItem.insertMany(items);
    console.log('🎉 Shop items inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error while seeding shop items:', err);
    process.exit(1);
  }
};

seedShopItems();
