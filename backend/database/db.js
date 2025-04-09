import mongoose from 'mongoose';
import dotenv from 'dotenv';


const Connection=()=>{
    dotenv.config();
 
    const URL = process.env.MONGODB_URL;

    mongoose.connect(URL).then(()=>{
        console.log("Database Connected!!!");
    }).catch((err=>{
        console.log("Error while connecting with database", err);
    }));



   
}

export default Connection; 