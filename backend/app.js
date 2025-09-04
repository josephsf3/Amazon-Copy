const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const products = require('./products.json');
const app = express();

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'index.html'));
})

app.get('/api/products', (req, res) => {
    res.json(products);
})

app.listen(4090, () => {
    console.log('Server is Running');
})