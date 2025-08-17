const mongoose = require('mongoose');

const ViewSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        
        post : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Post'
        }
    },
    
    {
        timeStamps : true
    }
)

module.exports = mongoose.model('View', ViewSchema);