const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const products = require('./products.json');
let cart = require('./cart.json');
const { writeFileSync } = require('fs')
const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, '..')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'index.html'));
})

app.get('/api/products', (req, res) => {
    res.json(products);
})

app.post('/api/cart', (req, res) => {
    cart = req.body;
    writeFileSync('./cart.json', JSON.stringify(cart));
    res.json({ success: true })
})

app.get('/api/cart', (req, res)=> {
    res.json(cart)
})

app.listen(4090, () => {
    console.log('Server is Running');
})