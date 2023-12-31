const router = require('express').Router();

//Mounted on /api
router.use('/user', require("./user"));
router.use('/livestreams', require("./livestreams"));
router.use('/messages', require("./messages"));
router.use('/follows', require("./follows"));
router.use('/videochats', require("./videochats"));
router.use('/turn', require("./turn"));
router.use('/recordings', require("./recordings"));
router.use('/explore', require("./explore"));

//404 Handling
router.use((req, res, next) => {
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
})

module.exports = router;