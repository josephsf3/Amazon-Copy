import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  deliveryOption: { type: String, default: "1"}
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;