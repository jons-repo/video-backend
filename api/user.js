const router = require('express').Router();
const { User } = require('../db/models');

//mounted on api/user
// http://localhost/8080/api/user

router.get('/allUsers', async (req, res, next)=>{
    try{
        //only want to get id and email back, do not want to return and expose their password
        const allUsers = await User.findAll({attributes: ["id", "email"]}) 
        allUsers? res.status(200).json(allUsers) : res.status(404).send('User Listing Not Found');
    } catch(error){
        next(error);
    }
});

//get a single user by id/pk (SELECT * FROM students WHERE id = pk)
router.get('/:id', async(req, res, next) =>{
    try{
        const {id} = req.params;
        const user = await User.findByPk(id);
        user? res.status(200).json(user): res.status(404).send('User Not Found');

    } catch (error){
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { messageLanguage, siteLanguage, streamLanguage } = req.body;
    const user = await User.findByPk(id);

    if (messageLanguage) {
      user.messageLanguage = messageLanguage;
    }

    if (siteLanguage) {
      user.siteLanguage = siteLanguage;
    }

    if (streamLanguage) {
      user.streamLanguage = streamLanguage;
    }

    await user.save();
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;