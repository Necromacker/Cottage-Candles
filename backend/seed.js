const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const productsData = require('../products.json');

const products = Object.values(productsData).map(p => {
    let category = 'Candles';
    if (p.id.startsWith('diffuser')) category = 'Diffusers';
    if (p.id.startsWith('hamper')) category = 'Hampers';

    return {
        name: p.name,
        price: p.price,
        category: category,
        imageLight: p.imageLight,
        imageDark: p.imageDark,
        description: p.name // Fallback description
    };
});

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Database seeded with all products successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
