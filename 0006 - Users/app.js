const express = require('express');
const ejs = require('ejs');
const database = require('./database.js');  // Import the database module
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware for parsing form data and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home page route
app.get('/', (req, res) => {
    let products = database.getProducts();
    let sessionToken = req.cookies['cafejs_session'];
    let user = database.getUserBySessionToken(sessionToken);
    let data = {
        products: products,
        user: user,
    };
    ejs.renderFile('views/index.ejs', data, (err, str) => {
        if (err) {
            console.error('Error rendering index page:', err);
            res.status(500).send('An error occurred');
        } else {
            res.send(str);
        }
    });
});

// Login page route
app.get('/login', (req, res) => {
    ejs.renderFile('views/login.ejs', (err, str) => {
        if (err) {
            console.error('Error rendering login page:', err);
            res.status(500).send('An error occurred');
        } else {
            res.send(str);
        }
    });
});

// Login form submission route
app.post('/login', (req, res) => {
    // Check if the user's details are valid
    let user = database.getUserByUsername(req.body.username);
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        res.send('Invalid details!');
        return;
    }

    // Generate a random session token
    let sessionToken = crypto.randomBytes(16).toString('base64');

    // Set the `cafejs_session` cookie to the session token
    res.cookie('cafejs_session', sessionToken, { httpOnly: true });

    // Save the session to the database
    database.setSession(sessionToken, user.id);

    // Redirect to the home page
    res.redirect('/');
});

// Username route to display the logged-in username
app.get('/username', (req, res) => {
    let username = req.cookies.cafejs_username;
    if (username) {
        res.send(username);
    } else {
        res.send("No user logged in");
    }
});

// Logout route to clear session
app.post('/logout', (req, res) => {
    let sessionToken = req.cookies['cafejs_session'];
    if (sessionToken) {
        // Remove the session
        delete database.getSessions()[sessionToken];
    }
    res.clearCookie('cafejs_session');
    res.redirect('/');
});

// Product detail page route
app.get('/product/:productId', (req, res) => {
    let product = database.getProductById(req.params.productId);  // Get product by ID
    let sessionToken = req.cookies['cafejs_session'];
    let user = database.getUserBySessionToken(sessionToken);
    if (!product) {
        res.status(404).send('Product not found');
        return;
    }
    let data = {
        product: product,
        user: user,
    };
    ejs.renderFile('views/product_detail.ejs', data, (err, str) => {
        if (err) {
            console.error('Error rendering EJS:', err);
            res.status(500).send('An error occurred');
        } else {
            res.send(str);
        }
    });
});

// Start the server
app.listen(port, () => console.log(`App is listening on port ${port}`));
