const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up a simple SQLite database
const db = new sqlite3.Database(':memory:'); // Use ':memory:' for testing, or change to a file-based database

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cjs_cart_item (user_id INTEGER, product_id INTEGER, quantity INTEGER)');
    db.run('CREATE TABLE IF NOT EXISTS cjs_transaction (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, created_at TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS cjs_line_item (transaction_id INTEGER, product_id INTEGER, quantity INTEGER)');
});

// Middleware to simulate a session with a user ID
app.use((req, res, next) => {
    req.session = { userId: 1 }; // Example user ID; replace with actual session logic as needed
    next();
});

// Route to display the cart
app.get('/cart', (req, res) => {
    const userId = req.session.userId;
    db.all('SELECT * FROM cjs_cart_item WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).send('Error fetching cart items');
        }
        res.render('cart', { cartItems: rows });
    });
});

// Route to handle checkout
app.post('/cart', (req, res) => {
    const userId = req.body.user_id;
    const now = new Date().toISOString();

    db.serialize(() => {
        db.run('INSERT INTO cjs_transaction (user_id, created_at) VALUES (?, ?)', [userId, now], function(err) {
            if (err) {
                return res.status(500).send('Error creating transaction');
            }
            const transactionId = this.lastID;

            db.all('SELECT product_id, quantity FROM cjs_cart_item WHERE user_id = ?', [userId], (err, rows) => {
                if (err) {
                    return res.status(500).send('Error fetching cart items');
                }

                const stmt = db.prepare('INSERT INTO cjs_line_item (transaction_id, product_id, quantity) VALUES (?, ?, ?)');
                rows.forEach(row => {
                    stmt.run(transactionId, row.product_id, row.quantity);
                });
                stmt.finalize();

                db.run('DELETE FROM cjs_cart_item WHERE user_id = ?', [userId], err => {
                    if (err) {
                        return res.status(500).send('Error clearing cart');
                    }
                    res.redirect('/history');
                });
            });
        });
    });
});

// Route to display transaction history
app.get('/history', (req, res) => {
    const userId = req.session.userId;
    db.all(`
        SELECT t.id AS transaction_id, t.created_at, li.product_id, li.quantity
        FROM cjs_transaction t
        JOIN cjs_line_item li ON t.id = li.transaction_id
        WHERE t.user_id = ?
    `, [userId], (err, rows) => {
        if (err) {
            return res.status(500).send('Error fetching transactions');
        }
        res.render('history', { transactions: rows });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
