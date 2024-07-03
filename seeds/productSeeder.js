
import faker from "faker";
import Product from "../models/Product.js";
import {connectDB} from "../config/database.js";

const generateRandomProducts = async (num) => {
    await connectDB();
    for (let i = 0; i < num; i++) {
        const products = new Product({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
        });
        await products.save();
    }
};

export default generateRandomProducts(100);