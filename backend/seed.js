const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
    // Candles
    {
        name: "STRAWBERRY SHORTCAKE",
        price: 30.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Strawberry-Shortcake-Light.png",
        imageDark: "images/Products/Candles/Strawberry-Shortcake-Dark.png",
        description: "Sweet Dessert"
    },
    {
        name: "SUNBURST FLAVOUR",
        price: 28.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Sunburst-Flavour-Light.png",
        imageDark: "images/Products/Candles/Sunburst-Flavour-Dark.png",
        description: "Bright Citrus"
    },
    {
        name: "COFFEE LATTE",
        price: 32.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Coffee-Latte-Light.png",
        imageDark: "images/Products/Candles/Coffee-Latte-Dark.png",
        description: "Warm & Roasted"
    },
    {
        name: "MYSTIC OCEAN",
        price: 34.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Mystic-Ocean-Light.png",
        imageDark: "images/Products/Candles/Mystic-Ocean-Dark.png",
        description: "Fresh Breeze"
    },
    {
        name: "MERRY CHRISTMAS",
        price: 35.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Merry-Christmas-Light.png",
        imageDark: "images/Products/Candles/Merry-Christmas-Dark.png",
        description: "Holiday Spirit"
    },
    {
        name: "SIMPLE COOKIE",
        price: 15.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Simple-Cookie-Light.png",
        imageDark: "images/Products/Candles/Simple-Cookie-Dark.png",
        description: "Baked Goodness"
    },
    {
        name: "SMALL SWAN",
        price: 32.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Small-Swan-Light.png",
        imageDark: "images/Products/Candles/Small-Swan-Dark.png",
        description: "Graceful & Pure"
    },
    {
        name: "MOON BLOOM",
        price: 29.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Moon-Bloom-Light.png",
        imageDark: "images/Products/Candles/Moon-Bloom-Dark.png",
        description: "Floral & Sweet"
    },
    {
        name: "SUNFLOWER BOQUET",
        price: 26.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Sunflower-Boquet-Light.png",
        imageDark: "images/Products/Candles/Sunflower-Boquet-Dark.png",
        description: "Bright & Sunny"
    },
    {
        name: "DIWALI LADOO",
        price: 18.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Diwali-Ladoo-Light.png",
        imageDark: "images/Products/Candles/Diwali-Ladoo-Dark.png",
        description: "Festive Delight"
    },
    {
        name: "FAIRYTALE WALTZ",
        price: 24.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Fairytale-Waltz-Light.png",
        imageDark: "images/Products/Candles/Fairytale-Waltz-Dark.png",
        description: "Magical Whimsy"
    },
    {
        name: "PAINTED TAPER",
        price: 22.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Painted-Taper-Light.png",
        imageDark: "images/Products/Candles/Painted-Taper-Dark.png",
        description: "Artistic Stick"
    },
    {
        name: "SEA SHELL",
        price: 20.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Sea-Shell-Light.png",
        imageDark: "images/Products/Candles/Sea-Shell-Dark.png",
        description: "Coastal Chic"
    },
    {
        name: "TULIP BOQUET",
        price: 28.0,
        category: "Candles",
        imageLight: "images/Products/Candles/Tulip-Boquet-Light.png",
        imageDark: "images/Products/Candles/Tulip-Boquet-Dark.png",
        description: "Spring Blooms"
    },
    // Diffusers
    {
        name: "ROOM AND BATHROOM DIFFUSERS",
        price: 45.0,
        category: "Diffusers",
        imageLight: "images/Products/Diffusers/Room-And-Bathroom-Diffusers-Light.png",
        imageDark: "images/Products/Diffusers/Room-And-Bathroom-Diffusers-Dark.png",
        description: "Continuous Freshness"
    },
    {
        name: "CAR DIFFUSERS",
        price: 25.0,
        category: "Diffusers",
        imageLight: "images/Products/Diffusers/Car-Diffusers-Light.png",
        imageDark: "images/Products/Diffusers/Car-Diffusers-Dark.png",
        description: "On-the-go Scent"
    },
    // Hampers
    {
        name: "LUXURY GIFT HAMPER",
        price: 55.0,
        category: "Hampers",
        imageLight: "images/hamper2.png",
        imageDark: "images/hamper2.png",
        description: "Curated Elegance"
    }
];

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
