const router = require('express').Router();
const { Recording } = require('../db/models');

// root: http://localhost:3001/api/recordings

//get all recordings from the recordings table (SELECT * FROM livestreams)
router.get('/', async (req, res, next) => {
    try{
        const allRecordings = await Recording.findAll();
        allRecordings? res.status(200).json(allRecordings): res.status(404).send('Recording Listing Not Found');

    }
    catch(error){
        // console.log(error.message);
        next(error);
    }
})

//get a single recording by id/pk (SELECT * FROM livestream WHERE id = pk)
router.get('/:id', async(req, res, next) =>{
    try{
        const { id } = req.params;
        const recording = await Recording.findByPk(id);
        recording? res.status(200).json(recording): res.status(404).send('Recording Not Found');

    } catch (error){
        next(error);
    }
});

//get all recordings generated by a user
router.get("/byUser/:id", async (req, res, next) => {
    console.log("getting by user_id");
    try{
        const {id} = req.params;
        const allRecordings = await Recording.findAll({where : { user_id: id}});
        allRecordings? res.status(200).json(allRecordings): res.status(404).send('Recordings Not Found');        
    }
    catch(error){
        next(error);
    }
})

module.exports = router;

//get all recordings related to a particular livestream
router.get("/byLivestream/:id", async (req, res, next) => {
    console.log("getting by livestream_id");
    try{
        const {id} = req.params;
        const allRecordings = await Recording.findAll({where : { livestream_id: id}});
        allRecordings? res.status(200).json(allRecordings): res.status(404).send('Recordings Not Found');        
    }
    catch(error){
        next(error);
    }
})

//post a new recording
router.post('/', async(req, res, next) => {
    console.log("posting new recording");
    try{
        const { blob, user_id, livestream_id } = req.body;
        const newRecording= Recording.build({blob, user_id, livestream_id});
        await newRecording.save();
        
        res.json(newRecording);
    }
    catch(error){
        next(error);
    }
})

module.exports = router;