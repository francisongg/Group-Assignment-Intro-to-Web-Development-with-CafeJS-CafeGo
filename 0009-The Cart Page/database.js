const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite'); // Create or connect to db.sqlite file

// Initialize the database (create tables if they don't exist)
function initializeDatabase() {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS cjs_user (username TEXT, password TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS cjs_product (name TEXT, price INTEGER, description TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS cjs_session (token TEXT, user_id INTEGER)");

        // Seed users if table is empty
        db.get('SELECT COUNT(*) AS count FROM cjs_user', [], (err, row) => {
            if (err) {
                console.error("Error fetching user count:", err);
                return;
            }
            if (row.count === 0) {
                const stmt = db.prepare("INSERT INTO cjs_user (username, password) VALUES (?, ?)");
                const users = [
                    { username: 'zagreus', password: 'cerberus' },
                    { username: 'melinoe', password: 'b4d3ec1' }
                ];
                users.forEach(user => stmt.run(user.username, user.password));
                stmt.finalize();
            }
        });

        // Seed products if table is empty
        db.get('SELECT COUNT(*) AS count FROM cjs_product', [], (err, row) => {
            if (err) {
                console.error("Error fetching product count:", err);
                return;
            }
            if (row.count === 0) {
                const stmt = db.prepare("INSERT INTO cjs_product (name, price, description) VALUES (?, ?, ?)");
                const products = [
                    { name: 'Americano', price: 100, description: 'Espresso, diluted with hot water for a lighter experience' },
                    { name: 'Cappuccino', price: 110, description: 'Espresso with steamed milk' },
                    { name: 'Espresso', price: 90, description: 'A strong shot of coffee' },
                    { name: 'Macchiato', price: 120, description: 'Espresso with a small amount of milk' }
                ];
                products.forEach(product => stmt.run(product.name, product.price, product.description));
                stmt.finalize();
            }
        });
    });
}

// Function to get all products
function getProducts() {
    return new Promise((resolve, reject) => {
        db.all('SELECT rowid, * FROM cjs_product', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => ({
                    id: row.rowid,
                    name: row.name,
                    price: row.price,
                    description: row.description
                })));
            }
        });
    });
}

// Function to get a product by ID
function getProductById(id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT rowid, * FROM cjs_product WHERE rowid = ?';
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? {
                    id: row.rowid,
                    name: row.name,
                    price: row.price,
                    description: row.description
                } : null);
            }
        });
    });
}

// Session handling functions
function createSession(token, userId) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO cjs_session (token, user_id) VALUES (?, ?)', [token, userId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

function getUserBySessionToken(token) {
    return new Promise((resolve, reject) => {
        db.get('SELECT user_id FROM cjs_session WHERE token = ?', [token], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                getUserById(row.user_id).then(resolve).catch(reject);
            } else {
                resolve(null);
            }
        });
    });
}

function getUserById(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT rowid, * FROM cjs_user WHERE rowid = ?', [userId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? {
                    id: row.rowid,
                    username: row.username,
                    password: row.password
                } : null);
            }
        });
    });
}

module.exports = {
    initializeDatabase,
    getProducts,
    getProductById,
    createSession,
    getUserBySessionToken,
    getUserById
};

// Call initialize to set up tables
initializeDatabase();

db.run("CREATE TABLE IF NOT EXISTS cjs_cart_item (product_id, quantity, user_id)")

function getCartItemsByUser(user) {
    return new Promise((resolve, reject) => {
        let userId = user.id
        let query = `
        SELECT
            SUM(cjs_cart_item.quantity) AS quantity,
            cjs_product.name AS product_name
        FROM cjs_cart_item LEFT JOIN cjs_product
        ON cjs_cart_item.product_id = cjs_product.rowid
        WHERE cjs_cart_item.user_id = ?
        GROUP BY cjs_product.name
        `
        db.all(query, [userId], (err, rows) => {
            let result = rows.map(row => {
                return {
                    userId: userId,
                    quantity: row.quantity,
                    productName: row.product_name,
                }
            })
            resolve(result)
        })
    })
}