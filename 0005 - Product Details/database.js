let products = [
    {
        id: 1,
        name: 'Americano',
        price: 100,
        description: 'Espresso, diluted with hot water for a lighter experience',
    },
    {
        id: 2,
        name: 'Cappuccino',
        price: 110,
        description: 'Espresso with steamed milk',
    },
    {
        id: 3,
        name: 'Espresso',
        price: 90,
        description: 'A strong shot of coffee',
    },
    {
        id: 4,
        name: 'Macchiato',
        price: 120,
        description: 'Espresso with a small amount of milk',
    },
];

function getProducts() {
    return products;
}

function getProductById(id) {
    return products.filter(v => v.id == id)[0];
}

module.exports = {
    getProducts,
    getProductById,
};
