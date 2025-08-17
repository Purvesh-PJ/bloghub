const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },

        message : {
            type : String,
        },

        // post : {
        //     type : mongoose.Schema.Types.ObjectId,
        //     ref : 'Post'
        // },

        likes : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ],
        dislikes : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            }
        ],
        replies : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Comment'
            }
        ],
        replyCount: { 
            type: Number, default: 0 
        },
        date : {
            type : Date,
            default : Date.now
        }
    },
    
    {
        timeStamps : true
    }
)

module.exports = mongoose.model('Comment', CommentSchema);