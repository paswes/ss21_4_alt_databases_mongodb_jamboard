const express = require('express');
const router = express.Router();
const {Board, Post} = require('../schemas/Boards');

//get all boards
router.get('/', async  (req, res) => {
    try {
        const boards = await Board.find();
        await res.json(boards);
    }
    catch(err) {
        await res.json({message: err});
    }
});

//add board
router.post('/add-board', async (req, res) => {
    const board = new Board({
        owner: req.body.owner,
    });

    try {
        const savedBoard = await board.save();
        await res.json(savedBoard);
    } catch(err) {
        await res.json({message: err});
    }
});

//delete board by ID
router.delete('/delete-board/:boardId', async (req, res) => {
    try {
        const removedBoard = await Board.deleteOne({_id: req.params.boardId});
        await res.json(removedBoard);
    } catch(err) {
        await res.json({message: err});
    }
});

//add editor to board
router.put('/add-editor/:boardId/:userId', async (req, res) => {
    try {
        const updatedEditor = await Board.updateOne(
            {_id: req.params.boardId},
            {$addToSet: {editors: req.params.userId}});

        await res.json(updatedEditor);
    } catch(err) {
        await res.json({message: err});
    }
});

//delete editor from board
router.delete('/delete-editor/:boardId/:userId', async (req, res) => {
    try {
        const updatedEditor = await Board.updateOne(
            {_id: req.params.boardId},
            {$pull: {editors: req.params.userId}});

        await res.json(updatedEditor);
    } catch(err) {
        await res.json({message: err});
    }
});

//add post to board
router.post('/add-post/:boardId', async (req, res) => {
    try {
        const updatedPost = await Board.updateOne(
            {_id: req.params.boardId},
            {$addToSet: {
                posts: new Post ({
                    author: req.body.author,
                    text: req.body.text,
                    position: {
                        x: 1,
                        y: 1
                    }
                })
            }});

        await res.json(updatedPost);
    } catch(err) {
        await res.json({message: err});
    }
});

//delete post from board
router.delete('/delete-post/:boardId/:postId', async (req, res) => {
    try {
        const deletedPost = await Board.updateOne(
            {_id: req.params.boardId},
            {$pull: {posts: {_id: req.params.postId}}});

        await res.json(deletedPost);
    } catch(err) {
        await res.json({message: err});
    }
});

//update a post
router.put('/update-post/:boardId/:postId', async (req, res) => {
    try {
        const updatedPost = await Board.findOneAndUpdate(
            {_id: req.params.boardId, "posts._id" : req.params.postId},
            {$set: {"posts.$.text": req.body.text}});
        await res.json(updatedPost);
    } catch(err) {
        await res.json({message: err});
    }
});


module.exports = router;
