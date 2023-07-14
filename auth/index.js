const router = require('express').Router();
const { User } = require('../db/models')

// route: mounted on /auth


// /auth/login
router.post("/login", async(req, res, next) => {
    try{
        const user = await User.findOne({where: {email: req.body.email} });

        //two problems --> user doesnt exist or the password is incorrect
        if(!user || !user.correctPassword(req.body.password)){
            res.status(401).send("Invalid login credentials");
        } else {
            //req.login function, coming from passport.js --> to manage oauth and user login
            req.login(user, (err) => (err? next(err) : res.status(200).json(user))) //login user, or if there is error next it
        }


    }catch(error){
        console.error(error);
        next(error);
    }
})

// /auth/signup
router.post('/signup', async(req, res, next) => {
    console.log("running auth/signup route")
    try{
        const {email, password, isAdmin} = req.body;
        // const email = req.body.email;
        // const password = req.body.password;
        if (!email || !password){ //cannot pass !isAdmin in here because that is boolean and when false will execute
            return res.status(400).send("Required fields missing");
        }
        const user = await User.create(req.body);
        //once signed up automatically log them in using Passport JS method
        req.login(user, (err) => (err? next(err) : res.status(200).json(user)))


    } catch(error) {
        if(error.name === "SequelizeUniqueConstraintError"){//user already exists
            res.status(409).send("User already exists"); //could also keep it at 400

        } else {
            next(error);
        }
    }
});

// auth/logout
router.post('/logout', (req, res, next) => {
    console.log("running auth/logout route")

    // req.session.destroy((err) => {
    //     if(err){
    //        return next(err);
    //     }else{
    //         console.log(session.email);
    //        // req.logout();
    //         req.end();
    //         res.redirect('/signup');
    //     }
    //  });

    // passport js method on the request
    req.logout((error) => {
        if(error){
            return next(error);
        }
        res.redirect("/");
    })
    // req.session = null;
    req.session.destroy(); //
})

// auth/me (another option: auth/profile)
router.get('/me', (req, res, next) => {
    //when on me, will send me my data so i can access it
    res.status(200).json(req.user);
})

// /auth/google
router.use("/google", require("./google"));

module.exports = router;