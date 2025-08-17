const Post = require('../models/post.model');
const Category = require('../models/category.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Profile = require('../models/user-profile.model');
const { createPost, updatePost } = require('../services/postService');

exports.getBlogs = async (req, res) => {
    try {
        const Posts = await Post.find().populate('comments');
        res.status(200).send(Posts);
    }
    catch(err){
        res.status(500).json({
            success : false , 
            message : 'Model doesnt exists',
        });
    }
};

exports.getSinglePost = async (req, res) => {
    // console.log(req.body);
    try {
        const singlePost = await Post.findById(req.params.id).populate('user', 'username').populate({
            path : 'comments',
            populate : [ 
                {
                    path : 'user',
                    select : 'username',
                    model : 'User'
                },
                {
                    path : 'replies',
                    populate : {
                        path : 'user',
                        select : 'username',
                        model : 'User'
                    }
                }
            ]
        }).populate('categories');

        return res.status(200).json({
            success : true , 
            message : 'post found succesfully',
            data : singlePost
        });  
    } 
    catch (error) {
        res.status(500).json({
            success : false , 
            message : 'post not found',
        });
    }
};

exports.postBlogs = async (req, res)=> {
 
    const user_id = req.user;
    // console.log(req);

    try {

        const newPost = await createPost(user_id, req.body);

        await Profile.findOneAndUpdate(
            { user : user_id }, 
            { $inc : { postCount : 1 }},
            { new : true, runValidators : true }
        )
        return res.status(201).json({
            success: true,
            message: 'post created successfully',
            postId : newPost._id
        });
    }
    catch(error){
        console.error(error.message);
        const statusCode = error.message === 'All fields are required' || error.message === 'User not found' ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'An error occurred while creating the blog post'
        });
    }
};

exports.putBlogs = async (req, res) => {
    try {
        const post = req.body;
        const postId = req.params;

        await updatePost(post, postId);

        res.status(200).json({
            success: true,
            message: 'post updated successfully',
        });
    }
    catch(error){
        console.error(error.message);
        const statusCode = error.message === 'All fields are required' || error.message === 'User not found' ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || 'An error occurred while updating the blog post'
        });
    }
};

exports.deletePost = async (req,res) => {
    // console.log(req.params);
    const user_id = req.user;
    try {
        const post_id = req.params._id;
        // console.log(post_id);

        const post = await Post.findById(post_id).populate('categories').populate('comments');
        // console.log(post);

        if(!post){
            return new Error(`Post not found`);
        }

        const postAttachedCategoryIds = post.categories.map(catId => catId._id);
        const postAttachedCommentIds = post.comments.map(cmtId => cmtId._id);
        
        await Category.updateMany(
            { _id :   { $in : postAttachedCategoryIds }},
            { $pull : { posts : post_id }}
        );

        await Comment.deleteMany(
            { _id :   { $in : postAttachedCommentIds }},
        );

        await User.updateOne(
            { _id :   { $in : user_id }},
            { $pull : { posts : post_id }}
        );

        await Post.findByIdAndDelete(post_id);

        await Profile.findOneAndUpdate(
            { user : user_id }, 
            { $inc : { postCount : -1 }}, 
            { new : true, runValidators : true }
        );

        return res.status(200).json({
            success : true,
            message : 'post deleted succesfully',
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ 
            success : false,
            error : 'Internal Server error'
        });
    }
};


