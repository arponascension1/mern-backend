import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],

    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        minLength: [20, 'Product description must be at least 20 characters'],
    },
    price: {
        type: String,
        required: [true, "Product price is required"],
        validate: {
            validator: function(value) {
                return /^\d+(\.\d{1,3})?$/.test(value) && parseFloat(value) >= 0;
            },
            message: 'Please enter a valid price'
        }
    },
    creatorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    updatorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps: true,
})
schema.pre('save', function(next) {
    if (this.price) {
        const priceNumber = parseFloat(this.price);
        this.price = priceNumber.toString();
    }
    next();
});
schema.index({ name: "text", description: "text" });

const Product = mongoose.model('Product', schema);

export default Product;