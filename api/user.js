const router = require('express').Router();
const { User, Follow } = require('../db/models');

//mounted on api/user
// https://video-backend-6mkl.onrender.com/api/user

router.get('/allUsers', async (req, res, next)=>{
  console.log(req.user + " HEEEEYEYEYEYEYYYYY!!!!")
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

router.get("/viewProfile/:id", async (req, res, next) => {
  try {
    //the id of the user to be viewed
    const { id } = req.params;
    //this is the user making the request
    const { loggedInUserId } = req.query;
    console.log(loggedInUserId,'ACCESSING USER ID')
    // Get a specific user's profile
    const viewUser = await User.findByPk(id);
    if (!viewUser) {
        return res.status(404).send("User not found");
    }
    console.log(viewUser.id,'VIEW USER');
    // to get all the followers of the view user profile
    const viewUserFollowersCount = await Follow.count({
        where: { following: viewUser.id},
    });

    // get all followers of the accessing user
    const loggedInUserFollowersCount = await Follow.count({
        where: { following: loggedInUserId },
    });
    //find the mutual followers


    // Get all followers of the accessing user
    const loggedInUserFollowers = await Follow.findAll({
    where: { following: loggedInUserId },
    });

console.log(loggedInUserFollowers,'LOGGED IN USER\'s FOLLOWERS');
const viewUserFollowers = await Follow.findAll({
  where: { following: viewUser.id },
});

// Find the intersection of followers
const loggedInUserFollowerIds = loggedInUserFollowers.map((follower) => follower.follower.id);
const mutualFollowers = viewUserFollowers.filter((follower) => loggedInUserFollowerIds.includes(follower.follower.id));
    console.log(mutualFollowers,'MUTUAL FOLLOWERS')
    console.log(viewUserFollowers,'VIEW USER FOLLOWERS');

    return res.status(200).json({
        viewUser,
        viewUserFollowers,
        mutualFollowers,
        viewUserFollowersCount
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async(req, res, next) => {
    console.log("hit post user route");
    try{
        const { email, imgUrl, firstName, lastName } = req.body;
        console.log("req.body: " + req.body);
        const newUser= User.build({email, imgUrl, firstName, lastName});
        await newUser.save();
            
        res.json(newUser);
    }
    catch(error){
        console.log(error);
    }
});


//to get the user data by the email registration via email endpoint
router.get("/byEmail/:email", async (req, res, next) => {
    console.log("getting by email");
    try{
        const { email } = req.params;
        const user = await User.findOne({where : { email: email }});
        // console.log("by email api hit")
        user? res.status(200).json(user): res.status(404).send('User Not Found');        
    }
    catch(error){
        next(error);
    }
})

// router.patch('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByPk(id);
//     const updates = req.body;

//     //update the user with all updates that have been submitted
//     user = { ...user, ...updates };

//     await user.save();
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// });

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, firstName, lastName, email, imgUrl, mobile, country, state, city, bio, language, isDeactivated, isPrivate, mobileNotifications, emailNotifications } = req.body;
    const user = await User.findByPk(id);
    
    user.userName = userName ?? user.userName;
    user.language = language ?? user.language;
    user.bio = bio ?? user.bio;
    user.city = city ?? user.city;
    user.state = state ?? user.state;
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.email = email ?? user.email;
    user.imgUrl = imgUrl ?? user.imgUrl;
    user.country = country ?? user.country;
    user.mobile = mobile ?? user.mobile;
    user.isDeactivated = isDeactivated ?? user.isDeactivated;
    user.isPrivate = isPrivate ?? user.isPrivate;
    user.mobileNotifications = mobileNotifications ?? user.mobileNotifications;
    user.emailNotifications = emailNotifications ?? user.emailNotifications;

    await user.save();
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// router.patch('/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { userName, language, bio, city, state, firstName, lastName, email, mobile, isDeactivated, isPrivate, emailNotifications, mobileNotifications } = req.body;
//     const user = await User.findByPk(id);

//     user.userName = userName ?? user.userName;
//     user.language = language ?? user.language;
//     user.bio = bio ?? user.bio;
//     user.city = city ?? user.city;
//     user.state = state ?? user.state;
//     user.firstName = firstName ?? user.firstName;
//     user.lastName = lastName ?? user.lastName;
//     user.email = email ?? user.email;
//     user.mobile = mobile ?? user.mobile;
//     user.isDeactivated = isDeactivated ?? user.isDeactivated;
//     user.isPrivate = isPrivate ?? user.isPrivate;
//     user.mobileNotifications = mobileNotifications ?? user.mobileNotifications;
//     user.emailNotifications = emailNotifications ?? user.emailNotifications

//     await user.save();
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// });

    /**
 * Profile: username, bio, topics, location(city,state)
 * Account: first name, last name, email, phone number, deactivate
 * Preferences: language, notifications (phone/email), make private
 * 
 */

module.exports = router;