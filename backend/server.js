import express from 'express';
import path from 'path';
import dayjs from 'dayjs';
import { connectDB } from './DB/db.js';
import Order from './DB/models/ordersdb.js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { formatCart, calculateCost } from './scripts/formatCalculate.js';




let cart = [];
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

app.get('/api/products', (req, res) => {
    res.json(products);
})

app.post('/api/cart', (req, res) => {
    cart = req.body || [];
    writeFileSync('./cart.json', JSON.stringify(cart));
    res.json({ success: true })
})

app.get('/api/cart', (req, res) => {
    res.json(cart)
})

app.post('/api/orders', async (req, res) => {
    try {
        const data = req.body.cart.map(cartItem => formatCart(cartItem));
        let totalCostCents = calculateCost(data, products);
        console.log(totalCostCents);
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

app.listen(4090, () => {
    console.log('Server is Running');
})