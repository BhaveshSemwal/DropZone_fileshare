import express from "express";
import Connection from "./database/db.js";
import router from "./routes/api.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

const app = express();
dotenv.config();

const PORT = 9000;
app.use(cors());
app.use('/',router);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname,'/frontend/dist')));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
})

app.listen(PORT,()=>
    console.log("server is running on port: ",PORT)
);
Connection();