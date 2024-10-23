import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const db = mongoose
            .connect(process.env.MONGOURL , { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("Successfully connected to Mongo-Database");
            })
            .catch((error) => {
                console.error(error);
            });
        
export default db;