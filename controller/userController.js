import errorHandler from "../utils/errorHandler.js";
import User from "../models/User.js";
import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const create = catchAsyncError( async (req, res,next) =>{
    const {name, email, password, passwordConfirmation} = req.body;
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
    })
    if(user){
        res.status(201).json(user)
    }else{
        return next(new errorHandler("There is a problem in creating user", 500))
    }
});
export const login = catchAsyncError( async (req, res,next) =>{
    const {email, password=''} = req.body;
    const user = await User.findOne({email});
    if(user && await bcrypt.compare(password, user.password)){
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token,{
            secure: true,
            maxAge: 3600000*2,
        });
        res.status(201).json({
            message: 'User Logged In',
        })
    }
    return next(new errorHandler("Wrong credential", 401))
})
export const me =  catchAsyncError( async (req, res,next) =>{
    res.send(req.user);
})
export const logout = catchAsyncError(async (req, res,next) =>{
    res.clearCookie('token').json({
        message: 'User Logged out',
    });
})
export const updateUser = catchAsyncError( async (req, res,next) =>{
    const update = req.body;
    const options = {
        new: true, runValidators: true
    }
   const newUser = await User.findByIdAndUpdate(req.user._id, update,options );
    res.status(200).json({
        message: "User Updated"
    })
});