import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI);

        console.log(`db is connected with ${connection.host} to ${connection.port}`);
    }catch(err) {
        console.log(err)
    }
}