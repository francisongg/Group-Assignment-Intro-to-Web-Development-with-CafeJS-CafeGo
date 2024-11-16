
app.post('/product/:productId', async (req, res) => {
    // Collect the form data
    let sessionToken = req.cookies['cafejs_session']
    let user = await database.getUserBySessionToken(sessionToken)
    let userId = user.id
    let quantity = req.body.quantity
    let productId = req.body.product_id
    // Sanity check: just echo it back
    await database.createCartItem(productId, quantity, userId)
res.redirect('/')
})

function createCartItem(productId, quantity, userId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let stmt = db.prepare('INSERT INTO cjs_cart_item (product_id, quantity, user_id) VALUES (?, ?, ?)')
            stmt.run(productId, quantity, userId)
            resolve(true)
        })
    })
}