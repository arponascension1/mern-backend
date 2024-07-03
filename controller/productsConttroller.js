import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import Product from "../models/Product.js";
import errorHandler from "../utils/errorHandler.js";

export const allProducts = catchAsyncError(async (req, res, next) => {
    let { page = 1, limit = 5, minPrice, maxPrice, search,orderBy } = req.query;
    if(page < 1){
        page= 1;
    }
    const filter = {};
    if (minPrice) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
    if (search){
        filter.$text = { $search: search };
    }
    const sortOption= {};
    if(orderBy) {
        const [field, order] = orderBy.split('.');
        sortOption[field] = order === 'desc' ? 'desc' : 'asc'
    }
    const products = await Product.find(filter)
        .sort(sortOption)
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();

    const count = await Product.countDocuments(filter);

    const totalPage = Math.ceil(count / limit);
    res.json({
        products,
        totalPages: totalPage<1?1:totalPage,
        pageSize: limit,
        currentPage: page,
    });
})

export const createProduct = catchAsyncError(async (req, res, next) => {
    const {name, description, price} = req.body;
    const product = await Product.create({name, description ,creatorId: req.user._id, price});
    if(product){
        res.status(201).json(product)
    }else{
        return next(new errorHandler("There is a problem in creating product", 500))
    }

})
export const deleteProduct = catchAsyncError(async (req, res, next) => {

})
export const updateProduct = catchAsyncError(async (req, res, next) => {

    const update = req.body;
    const {id} = req.params;
    update.updatorId = req.user._id;
    const options = {
        new: true, runValidators: true
    }
    const newUser = await Product.findByIdAndUpdate(id, update,options );
    if(newUser){
        res.status(200).json({
            message: "Product Updated",
        })
    }else {
        return next(new errorHandler("Product not Found", 500))
    }

})
export const singleProduct = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        return next(new errorHandler("Product not Found", 500))
    }
    res.status(200).json({
        product
    })
})