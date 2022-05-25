const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json());
const db = require('./db');


app.get('/api/products', (req, res) => {
    res.json(db.items)
})
app.get('/api/products/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    const productDetails = db.items.find(item => item.id === productId)
    res.json(productDetails)
})
app.post('/api/checkout/', (req, res) => {
    const productId = Number(req.body.productId);
    if (!productId) {
        res.status(400).json({ message: "missing product id" })
    }

    let updatedProduct = null;
    db.items = db.items.map(item => {
        if (item.id === productId) {
            if (!item.quantity) {
                res.status(406).json({ message: "out of stock" })
                return;
            }
            item.quantity -= 1;
            updatedProduct = item;
            db.pendingRequests.push(updatedProduct);
        }
        return item;
    })
    console.log(db.pendingRequests)
    res.json(updatedProduct)
})
app.get('/api/raspberry/pending-request', (req, res) => {
    res.json(db.pendingRequests);
})

app.post('/api/raspberry/completed-request', (req, res) => {
    const productId = Number(req.body.productId);
    const idOfItemToBeRemoved = db.pendingRequests.findIndex((val) => {
        return val.id === productId;
    })
    db.pendingRequests.splice(idOfItemToBeRemoved, 1)
    console.log(`${productId} was removed from list`)
    res.json(productId)
})


/*
REST FRAMEWORK
GET /api/products list all products
POST /api/products create a new products
PATH, PUT /api/products/:productId modify a product
DELETE /api/products/:productId delete a product
*/













const PORT = process.env.PORT || 4110;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));