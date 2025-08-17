const Category = require('../models/category.model');
const Post = require('../models/post.model');


exports.createCategory = async ({ categories, postId }) => {

    // console.log(categories);
    // console.log(postId);

    if(!categories || !postId){
        throw new Error('something missing to create categories');
    }

    try {
        // Cerating new category 
        const category = new Category({
            name : categories,
            posts : postId
        });
        await category.save();

        // Finding post by id
        const post = await Post.findById(postId);
    
        if(!post){
            await Post.findByIdAndDelete(category._id);
            throw new Error('post not found');
        }
    
        // Attaching created category to desired post
        post.categories.push(category._id);
        await post.save();
        
        return category;
    }
    catch(error){
        console.error('Error creating category :', error.message);
        throw new Error('Error creating category');
    }
};