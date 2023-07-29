const router = require('express').Router();
const { Videochat } = require('../db/models');

// root: http://localhost:3001/api/videochats

//get all videochats from the videochat table (SELECT * FROM videochats)
router.get('/', async (req, res, next) => {
    try{
        const allVideochats = await Videochat.findAll();
        allVideochats? res.status(200).json(allVideochats): res.status(404).send('VideochatListing Not Found');

    }
    catch(error){
        // console.log(error.message);
        next(error);
    }
})


//get a single videochat by id/pk (SELECT * FROM videochat WHERE id = pk)
router.get('/:id', async(req, res, next) =>{
    try{
        const { id } = req.params;
        const videochat = await Videochat.findByPk(id);
        videochat? res.status(200).json(videochat): res.status(404).send('Videochat Not Found');

    } catch (error){
        next(error);
    }
});

router.get("/byCode/:code", async (req, res, next) => {
    console.log("getting by code");
    try{
        const {code} = req.params;
        const videochat = await Videochat.findOne({where : { code: code }});
        videochat? res.status(200).json(videochat): res.status(404).send('Videochat Not Found');        
    }
    catch(error){
        next(error);
    }
})

//add a new videochat record to the videochats table (INSERT INTO...VALUES)
router.post('/', async(req, res, next) => {
    try{
        const { title, description, user_id, code } = req.body;
        const newVideochat= Videochat.build({title, description, user_id, code});
        await newVideochat.save();
        
        res.json(newVideochat);
    }
    catch(error){
        next(error);
    }
})

//delete a videochat record by id (pk)
router.delete('/:id', async(req, res, next) =>{
    try{
        const {id} = req.params;
        const videochatToDelete = await Videochat.findByPk(id);
        await videochatToDelete.destroy();
        res.json(videochatToDelete);

    } catch (error){
        next(error);
    }
});

module.exports = router;