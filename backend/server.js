import express from 'express';
import path from 'path';
import dayjs from 'dayjs';
import { connectDB } from './database/db.js';
import Order from './database/models/ordersdb.js';
import Cart from './database/models/cartdb.js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { formatCart, calculateCost } from './scripts/formatCalculate.js';
import Product from './database/models/productdb.js';



const __dirname = path.dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(readFileSync(path.join(__dirname, '/data/products.json')).toString());

const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

await connectDB();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '/frontend/index.html'));
})

app.get('/amazon.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/frontend/index.html'));
})

app.get('/api/products', async (req, res) => {
    const products = await Product.find().lean();
    res.json(products);
})

app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const words = query.toLowerCase().split(" ");

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { keywords: { $in: words } }
      ]
    }).lean();

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});


app.post('/api/orders', async (req, res) => {
    try {
        const data = req.body.cart.map(cartItem => formatCart(cartItem));
        let totalCostCents = calculateCost(data, products);
        const order = new Order({
            products: data,
            orderTime: dayjs(),
            totalCostCents: totalCostCents
        });
        const savedOrder = await order.save();
        const response = {
            id: savedOrder._id,
            orderTime: savedOrder.orderTime,
            products: savedOrder.products,
            totalCostCents: savedOrder.totalCostCents
        }
        res.json(response);
    } catch (err) {
        console.error('Error saving order:', err);
        res.status(500).json({ error: 'Failed to save order' });
    }

})

app.get('/api/cart', async (req, res) => {
    try {
        const items = await Cart.find();
        return res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/api/cart', async (req, res) => {
    try {
        const data = req.body;
        const cartItem = new Cart({
            productId: data.productId,
            quantity: data.quantity,
            deliveryOption: data.deliveryOption
        });
        const savedCart = await cartItem.save();
        return res.json({
            productId: savedCart.productId,
            quantity: savedCart.quantity,
            deliveryOption: savedCart.deliveryOption
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(4090, () => {
    console.log('Server is Running');
})