const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const path = require('path')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'index.html'))
})

app.listen(4090, () => {
    console.log('Server is Running')
})