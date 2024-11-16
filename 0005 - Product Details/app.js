const express = require('express');
const ejs = require('ejs');
const database = require('./database.js');  // Importing the database module

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    let products = database.getProducts();  // Get products from the database
    let data = {
        products: products,
    };
    ejs.renderFile('views/index.ejs', data, (err, str) => {
        if (err) {
            console.error('Error rendering EJS:', err);
            res.status(500).send('An error occurred');
        } else {
            res.send(str);
        }
    });
});

app.get('/product/:productId', (req, res) => {
    let product = database.getProductById(req.params.productId);  // Get product by ID
    let data = { product: product };
    ejs.renderFile('views/product_detail.ejs', data, (err, str) => {
        if (err) {
            console.error('Error rendering EJS:', err);
            res.status(500).send('An error occurred');
        } else {
            res.send(str);
        }
    });
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
