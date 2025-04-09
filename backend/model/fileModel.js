import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60, // 🔥 Document will be auto-deleted after 60 seconds
    },
});

const fileModel = mongoose.model('file', fileSchema);
export default fileModel;
