const router = require('express').Router();
const { Message } = require('../db/models');

// root: http://localhost/3001/api/messages

//get all messages from the messages table (SELECT * FROM messages)
router.get('/', async (req, res, next) => {
    try{
        const allMessages = await Message.findAll();
        allMessages? res.status(200).json(allMessages): res.status(404).send('Livestream Listing Not Found');

    }
    catch(error){
        // console.log(error.message);
        next(error);
    }
})


//get a single messages by id/pk (SELECT * FROM messages WHERE id = pk)
router.get('/:id', async(req, res, next) =>{
    try{
        const { id } = req.params;
        const message = await Message.findByPk(id);
        message? res.status(200).json(message): res.status(404).send('Message Not Found');

    } catch (error){
        next(error);
    }
});

//add a new message record to the message table (INSERT INTO...VALUES)
router.post('/', async(req, res, next) => {
    try{
        const { content, user_id, livestream_id, videochat_id } = req.body;
        const newMessage= Message.build({content, user_id, livestream_id, videochat_id});
        await newMessage.save();
        res.json(newMessage);
    }
    catch(error){
        next(error);
    }
})

//delete a message record by id (pk)
router.delete('/:id', async(req, res, next) =>{
    try{
        const {id} = req.params;
        const messageToDelete = await Message.findByPk(id);
        await messageToDelete.destroy();
        res.json(messageToDelete);

    } catch (error){
        next(error);
    }
});

module.exports = router;