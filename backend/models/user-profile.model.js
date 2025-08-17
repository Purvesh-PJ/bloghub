const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },

    image: {
        data : {
            type: Buffer,
        },
        contentType : {
            type: String,
        } 
    },
    
    bio: {
        type: String,
    },

    followings : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    postCount : {
        type : Number,
        default : 0
    },

    followersCount : {
        type : Number,
        default : 0
    },

    followingsCount : {
        type : Number,
        default : 0
    }
  
}, {timestamps : true});

module.exports = mongoose.model('UserProfile', UserProfileSchema);











