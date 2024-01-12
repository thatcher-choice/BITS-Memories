import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import PostMessage from '../models/postMessage.js';
import { v2 as cloudinary } from 'cloudinary'
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret:process.env.API_SECRET ,
    secure: true
  });

const router = express.Router();

export const getPosts = async (req, res) => {
    console.log(req.query, 'query req');
    const { page, placeId } = req.query;
    
    try {
        const LIMIT = 8;
        let startIndex;
        let posts;
        let total;
        const timeout = new Promise((resolve) => setTimeout(resolve, 2000)); // Adjust the timeout as needed
        await timeout;
        // Pagination logic if placeId is not provided
        const updatedPlaceId = req.query.placeId;
        if (updatedPlaceId) {
            posts = await PostMessage.find({ placeId: updatedPlaceId });
            total = posts.length;
            res.json({ data: posts });
        } else {
            // Handle the case where placeId is still not available
            console.log(placeId,'placeID');
        startIndex = (Number(page) - 1) * LIMIT;
        total = await PostMessage.countDocuments({});
        posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        res.json({ data: posts, currentPage: Number(page) || 1, numberOfPages: Math.ceil(total / LIMIT)});
        }
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    console.log('welcome 2');

    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}


export const getPostsByCreator = async (req, res) => {
    console.log('welcome 4');

    const { name } = req.query;

    try {
        const posts = await PostMessage.find({ name });

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;
    
    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    try {
        console.log(req.body, 'reqest file');
        const file = req.body.selectedFile;
        const cloudinaryResponse = await cloudinary.uploader.upload(file);
        console.log(cloudinaryResponse, 'cloudinaryResponse');
        const newPostMessage = new PostMessage({
            ...req.body,
            selectedFile: cloudinaryResponse.url,
            creator: req.userId,
            createdAt: new Date().toISOString(),
          });
            await newPostMessage.save();
            res.status(201).json(newPostMessage);
        
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export default router;