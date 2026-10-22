import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const db = async() =>{
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not configured");
    }

    const connection = mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 5000,
    });

    await Promise.race([
        connection,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error("MongoDB connection timed out after 5 seconds")), 5000);
        }),
    ]);
};