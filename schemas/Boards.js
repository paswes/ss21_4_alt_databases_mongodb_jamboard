const mongoose = require('mongoose');


const User = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
};

const PostSchema = mongoose.Schema({
    author: User,
    text: String,
    position: {
        x: Number,
        y: Number
    }
});

const BoardSchema = mongoose.Schema({
    owner: User,
    editors: [User],
    posts: [PostSchema]
});

const Post = mongoose.model('Post', PostSchema);
const Board = mongoose.model('Board', BoardSchema);

module.exports = {Board, Post};
