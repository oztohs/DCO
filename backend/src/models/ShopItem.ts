import mongoose from 'mongoose';

const ShopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['hint', 'hint_bundle', 'time_freeze', 'random_buff'],
    required: true
  },
  isListed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('ShopItem', ShopItemSchema);
