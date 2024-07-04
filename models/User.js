import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        match: [/\S+@\S+\.\S+/, 'Email is not valid.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, 'Password must must be at least 8 characters'],
    }
},
    {
        timestamps: true,
    })
schema.virtual('passwordConfirmation')
    .get(function() {
        return this._passwordConfirmation;
    })
    .set(function(value) {
        this._passwordConfirmation = value;
    });
schema.pre('save', async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    }
})
schema.pre('validate', function(next) {
    if (this.password !== this.passwordConfirmation) {
        this.invalidate('passwordConfirmation', 'Enter the same password');
    }
    next();
});
schema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField:"creatorId",
    justOne: false
})
schema.plugin(uniqueValidator, { message: 'This {PATH} has been already taken' })
const User = mongoose.model("User", schema)
export default User;