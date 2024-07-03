import express from "express";
import {
    allProducts,
    createProduct,
    deleteProduct,
    singleProduct,
    updateProduct
} from "../controller/productsConttroller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', allProducts);
router.post('/',authMiddleware, createProduct);
router.delete('/:id', deleteProduct);
router.put('/:id',authMiddleware, updateProduct);
router.get('/:id', singleProduct);

export default router;