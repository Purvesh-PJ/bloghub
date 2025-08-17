const Comment = require('../models/comment.model');
const Post = require('../models/post.model');


exports.createComment = async ({ userId, postId, message }) => {

    if(!userId || !postId || !message){
        throw new Error('something missing to create comment');
    }

    try {

        const comment = new Comment({
            message,
            user : userId,
            post : postId
        });
        await comment.save();

        const post = await Post.findById(postId);

        if(!post){
            await Comment.findByIdAndDelete(comment._id);
            throw new Error('Post not found');
        }
    
        post.comments.push(comment._id);
        await post.save();

        return comment;
        
    }
    catch(error){
        console.error('Error adding comment to post :', error.message);
        throw new Error('Error adding comment to post');
    }
};



