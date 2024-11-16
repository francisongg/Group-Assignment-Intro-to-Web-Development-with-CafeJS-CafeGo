let products = [
    { name: 'Americano', price: 100 },
    { name: 'Cappuccino', price: 110 },
    { name: 'Espresso', price: 90 },
    { name: 'Macchiato', price: 120 }, // New product added
];

function getProducts() {
    return products;
}

module.exports = {
    getProducts
};
