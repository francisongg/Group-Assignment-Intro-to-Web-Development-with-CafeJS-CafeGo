const express = require('express');
const { getProducts, getProductById } = require('./database.js'); // Import functions

const app = express();
const port = 3000;

// Route to get all products
app.get('/products', async (req, res) => {
    try {
        const products = await getProducts();
        res.json(products); // Send products as JSON response
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Route to get a product by ID
app.get('/product/:productId', async (req, res) => {
    try {
        const product = await getProductById(req.params.productId);
        if (product) {
            res.json(product); // Send product data as JSON
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Code that starts the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
