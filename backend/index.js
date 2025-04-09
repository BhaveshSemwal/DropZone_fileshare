import express from "express";
import Connection from "./database/db.js";
import router from "./routes/api.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import fs from "fs";
import fileModel from "./model/fileModel.js"; // Make sure this path is correct

const app = express();
dotenv.config();

const PORT = 9000;
app.use(cors());
app.use('/', router);

const __dirname = path.resolve();

// File Upload Logic Here
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const originalName = req.file.originalname;

    try {
        const fileDoc = await fileModel.create({
            path: filePath,
            name: originalName,
        });

        // ⏳ Delete file from disk after 1 minute
        setTimeout(() => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                } else {
                    console.log(`Deleted file: ${filePath}`);
                }
            });
        }, 60 * 1000); // 60 seconds

        res.status(200).json({ downloadLink: `${req.protocol}://${req.get('host')}/files/${fileDoc._id}` });
    } catch (err) {
        res.status(500).json({ error: "Failed to upload file." });
    }
});

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log("server is running on port: ", PORT);
});

Connection();
