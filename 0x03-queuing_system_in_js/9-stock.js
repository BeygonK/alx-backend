// Import necessary modules
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const app = express();
const PORT = 1245;

// Connect to Redis
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

// Promisify Redis methods for easier async/await usage
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Data
const listProducts = [
    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

// Data access
const getItemById = (id) => {
    return listProducts.find(product => product.id === id);
};

// Reserve stock in Redis
const reserveStockById = async (itemId, stock) => {
    await setAsync(`item.${itemId}`, stock);
};

// Get current reserved stock by ID
const getCurrentReservedStockById = async (itemId) => {
    const stock = await getAsync(`item.${itemId}`);
    return stock ? parseInt(stock) : 0; // Return 0 if no stock is reserved
};

// Server
app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

// Route to get product details by itemId
app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const product = getItemById(itemId);
    
    if (!product) {
        return res.status(404).json({ status: 'Product not found' });
    }

    const currentQuantity = await getCurrentReservedStockById(itemId);
    res.json({
        itemId: product.id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock,
        currentQuantity: product.stock - currentQuantity // Available stock after reservation
    });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const product = getItemById(itemId);
    
    if (!product) {
        return res.status(404).json({ status: 'Product not found' });
    }

    const currentReservedStock = await getCurrentReservedStockById(itemId);
    const availableStock = product.stock - currentReservedStock;

    if (availableStock <= 0) {
        return res.status(400).json({
            status: 'Not enough stock available',
            itemId: product.id
        });
    }

    // Reserve one item
    await reserveStockById(itemId, currentReservedStock + 1);
    res.json({
        status: 'Reservation confirmed',
        itemId: product.id
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
