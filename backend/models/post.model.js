const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
        user : {
            type : mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
        },

        imageURL : {
            type : String,
        },

        title : {
            type : String,
            required : true
        },

        slug : {
            type : String,
            required : true
        },

        visibility : {
            type : String , 
            enum : ['draft', 'private', 'public'], 
            default : 'draft'
        },

        content : {
            type : String,
            required : true
        },

        tags : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Tag',
        }],

        categories : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }],

        views : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'View'
        }],

        likes : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Like'
        }],

        comments : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
           
    }, { timestamps : true }
)

module.exports = mongoose.model('Post', PostSchema);  