import fileModel from "../model/fileModel.js";
import path from "path";
import dotenv from "dotenv";


export const UploadController = async (req,res)=>{
    try{
        dotenv.config();
        const backendUrl = process.env.BACKEND_URL;

        
       
        
        const fileObject = {
            path:req.file.path,
            name:req.file.originalname,
        }
        const file = await fileModel.create(fileObject);
        // console.log(file);
        return res.status(200).json({path:`${backendUrl}/files/${file._id}`})

        


    }catch(err){


        return res.status(500).json({message:err.message});
    }
}


export const DownloadController = async(req,res)=>{
    try{
        const file = await fileModel.findById(req.params.fileId);

        if(!file){
            return res.status(404).json({message:"File not found"});
        }
        const filePath = path.resolve(file.path);
        res.download(filePath,file.name);

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}