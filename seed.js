const db = require('./db');
const {User, Livestream, Message} = require ('./db/models');

const seedUsers = [
    {email: 'john.doe@gmail.com', password: 'tofu123', isAdmin: true},
    {email: 'jane.doe@gmail.com', password: 'tomato456', isAdmin: false},
    {email: 'lily.rose@gmail.com', password: 'sprinkles789'},
];

const seedLivestreams = [
    { user_id: 1, description: 'hello first stream', title: 'first stream'},
    { user_id: 2, description: 'second first stream' }
];

const seedMessages = [
    {content: 'hello', user_id: 1, livestream_id: 1 },
    { content: 'yes', user_id: 2, livestream_id: 2 }
];

const seed = async () => {
    await User.bulkCreate(seedUsers);
    await Livestream.bulkCreate(seedLivestreams);
    await Message.bulkCreate(seedMessages);
};

//only seed once
seed().then(() => process.exit());