const router = require('express').Router();
const twilio = require('twilio');

router.get('/getCredentials', async (req, res) => {
    const accountSid = process.env.TWILIO_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    const client = twilio(accountSid, authToken);

    try{
        const token = await client.tokens.create();
        res.send({ token });
    }
    catch(error){
        console.log("error occurred while fetching turn server credentials");
        console.log(error);
        res.send ( { token: null });
    }
})


module.exports = router;