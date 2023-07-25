const router = require('express').Router();
const { User } = require('../db/models');
const {Follow} = require('../db/models');
const sendEmailNotification = require('../sendNotifications'); 


router.get('/sendNotifications', async (req, res) => {
    const { userId } = req.query;
    console.log('api email running');
    try {
        // user who started the stream
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // get followers email addresses from the database
        const follows = await Follow.findAll({where: {following: userId}});
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
        const text = 'A new livestream has started!';

        // send email to all followers
        await sendEmailNotification(recipientEmails, subject, text, user.email);

        return res.json({ message: 'Email notifications sent successfully.' });
    } catch (error) {
        console.error('Error sending email notifications:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;