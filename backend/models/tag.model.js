const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
    {
        name : [{
            type : String,
        }],

        posts : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Post'
        }]
    },

    {
        timeStamps : true
    }
)

module.exports = mongoose.model('Tag', TagSchema);