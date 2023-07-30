const express = require('express');
const router = express.Router();
const { User } = require('../db/models');
const {Follow} = require('../db/models');
const { sendEmailNotification, sendTextNotification } = require('../sendNotifications'); 

// API endpoint to get followers for a user by their ID
router.get('/followers/:userId', async (req, res) => {
  console.log('follow api hit');
  try {
    const { userId } = req.params;
    console.log(userId,'is the user id from the api');
    const followers = await Follow.findAll({
      where: { following: userId },
    });
    console.log(followers,'are the followers found')
    console.log('user' + userId + 'has ' + followers + 'followers');
    return res.json(followers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/sendNotifications', async (req, res) => {
    const { userId, livestreamCode } = req.query;
    console.log('api email running');
    try {
        // user who started the stream
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // get followers email addresses from the database
        const follows = await Follow.findAll({ where: { following: userId } });
        console.log(follows);

        // email addresses of followers
        const follower_ids = follows.map((follow) => follow.follower);
        const recipientUsers = await Promise.all(follower_ids.map(async (user_id) => await User.findByPk(user_id)));
        const recipientEmails = recipientUsers.map((recipientUser) => recipientUser.email);
        console.log(follower_ids);
        console.log(recipientUsers);
        console.log(recipientEmails);

        if (recipientEmails.length === 0) {
            // If no followers, return error 
            return res.status(404).json({ error: 'No followers found' });
        }

        const subject = 'New Livestream Started';
        const text = `A new livestream has started! http://localhost:3000/livestream/${livestreamCode}`;

        // send email to all followers
        await sendEmailNotification(recipientEmails, subject, text);

        return res.json({ message: 'Email notifications sent successfully.' });
    } catch (error) {
        console.error('Error sending email notifications:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/phoneNumbers', async (req, res) => {
    const { userId, livestreamCode } = req.query;
    try {

        // const follows = await Follow.findAll({
        //     where: { following: userId },
        //     // include: [{ model: User, as: 'followerUser', attributes: ['mobile'] }],
        // });

        // const phoneNumbers = followers.map((follower) => follower.user_id.mobile);

        const follows = await Follow.findAll({ where: { following: userId } });
        console.log(follows);

        // email addresses of followers
        const follower_ids = follows.map((follow) => follow.follower);
        const recipientUsers = await Promise.all(follower_ids.map(async (user_id) => await User.findByPk(user_id)));
        const recipientMobiles = recipientUsers.map((recipientUser) => recipientUser.mobile);
        console.log(recipientMobiles);
        console.log(livestreamCode);
        await sendTextNotification(recipientMobiles, livestreamCode);

        res.json({ message: 'Text message sent' });
    } catch (error) {
        console.error(error);
    }
});

router.post('/', async (req, res) => {
  const { loggedInUserId, userId } = req.body;
  try {
    await Follow.create({
      follower: loggedInUserId,
      following: userId,
    });
    res.json({ message: 'user followed ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'failed to follow user' });
  }
});

router.delete('/', async (req, res) => {
  const { loggedInUserId, userId } = req.body;
  try {
    await Follow.destroy({
      where: { follower: loggedInUserId, following: userId },
    });
    res.json({ message: 'user unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'failed to unfollow user' });
  }
});



module.exports = router;