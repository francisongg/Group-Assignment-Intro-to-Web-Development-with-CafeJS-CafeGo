const bcrypt = require('bcrypt');
let products = [
    {
        id: 1,
        name: 'Americano',
        price: 100,
        description: 'Espresso, diluted with hot water for a lighter experience',
        imageUrl: '/images/americano.jpg',
        stock: 20
    },
    {
        id: 2,
        name: 'Cappuccino',
        price: 110,
        description: 'Espresso with steamed milk',
        imageUrl: '/images/cappuccino.jpg',
        stock: 15
    },
    {
        id: 3,
        name: 'Espresso',
        price: 90,
        description: 'A strong shot of coffee',
        imageUrl: '/images/espresso.jpg',
        stock: 25
    },
    {
        id: 4,
        name: 'Macchiato',
        price: 120,
        description: 'Espresso with a small amount of milk',
        imageUrl: '/images/macchiato.jpg',
        stock: 10
    },
];

let users = [
    {
        id: 1,
        username: 'zagreus',
        password: bcrypt.hashSync('cerberus', 10),
    },
    {
        id: 2,
        username: 'melinoe',
        password: bcrypt.hashSync('b4d3ec1', 10),
    }
];

let sessions = {};

function getProducts() {
    return products;
}

function getProductById(id) {
    return products.find(v => v.id == id);
}

function getUsers() {
    return users;
}

function getUserById(id) {
    return users.find(v => v.id == id);
}

function getUserByUsername(username) {
    return users.find(v => v.username == username);
}

function getSessions() {
    return sessions;
}

function getUserBySessionToken(sessionToken) {
    let userId = sessions[sessionToken];
    return getUserById(userId);
}

function setSession(sessionToken, userId) {
    sessions[sessionToken] = userId;
}

module.exports = {
    getProducts,
    getProductById,
    getUsers,
    getUserById,
    getUserByUsername,
    getSessions,
    getUserBySessionToken,
    setSession,
};
