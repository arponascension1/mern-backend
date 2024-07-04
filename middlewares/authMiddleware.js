import User from "../models/User.js";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new errorHandler("Unauthorized", 401))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate('posts');
        if(!user){
            res.clearCookie('token');
        }
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie('token');
        return next(new errorHandler("Unauthorized", 401))
    }
};
export default authMiddleware;