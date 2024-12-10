import mongoose from "mongoose";

const dbConnect = async(req,res) => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT),
        console.log("db is connected")
    } catch (error) {
        console.log(console.error("not connecting"));
    }
}

export default dbConnect