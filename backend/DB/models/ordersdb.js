import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  products: { type: Array, required: true },
  orderTime: { type: Date },
  totalCostCents: { type: Number}
});

const Order = mongoose.model('Order', orderSchema);

export default Order;