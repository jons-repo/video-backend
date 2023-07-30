const router = require('express').Router();
const { Livestream } = require('../db/models');

// root: http://localhost:3001/api/livestreams

//get all livestream from the livestream table (SELECT * FROM livestreams)
router.get('/', async (req, res, next) => {
    try{
        const allLivestreams = await Livestream.findAll();
        allLivestreams? res.status(200).json(allLivestreams): res.status(404).send('Livestream Listing Not Found');

    }
    catch(error){
        // console.log(error.message);
        next(error);
    }
})


//get a single livestream by id/pk (SELECT * FROM livestream WHERE id = pk)
router.get('/:id', async(req, res, next) =>{
    try{
        const { id } = req.params;
        const livestream = await Livestream.findByPk(id);
        livestream? res.status(200).json(livestream): res.status(404).send('Livestream Not Found');

    } catch (error){
        next(error);
    }
});

//get a livestream by livestream code
router.get("/byCode/:code", async (req, res, next) => {
    // console.log("getting by code");
    try{
        const {code} = req.params;
        const livestream = await Livestream.findOne({where : { code: code }});
        livestream? res.status(200).json(livestream): res.status(404).send('Livestream Not Found');        
    }
    catch(error){
        next(error);
    }
})

//add a new livestream record to the livestreams table (INSERT INTO...VALUES)
router.post('/', async(req, res, next) => {
    try{
        const { title, description, user_id, code } = req.body;
        const newLivestream= Livestream.build({title, description, user_id, code});
        await newLivestream.save();
        
        res.json(newLivestream);
    }
    catch(error){
        next(error);
    }
})

//delete a livestream record by id (pk)
router.delete('/:id', async(req, res, next) =>{
    try{
        const {id} = req.params;
        const livestreamToDelete = await Livestream.findByPk(id);
        await livestreamToDelete.destroy();
        res.json(livestreamToDelete);

    } catch (error){
        next(error);
    }
});

module.exports = router;