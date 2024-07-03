import express from "express";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import {connectDB} from "./config/database.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true, // Allow credentials (cookies, etc.)
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
connectDB();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(errorMiddleware);
