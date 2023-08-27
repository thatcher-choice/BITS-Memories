import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    lat: { type: Number, required: true, get: v => parseFloat(v).toFixed(14) }, 
    lng:{ type: Number, required: true, get: v => parseFloat(v).toFixed(14) },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;