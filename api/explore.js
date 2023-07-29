const express = require('express');
const router = express.Router();
const { User } = require('../db/models'); 

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'userName', 'imgUrl'],
    });
    res.json(users);
  } catch (error) {
      console.error(error);
  }
});

module.exports = router;