const db = require('./db');
const {User} = require ('./db/models');

const seedUsers = [
    {email: 'john.doe@gmail.com', password: 'tofu123', isAdmin: true},
    {email: 'jane.doe@gmail.com', password: 'tomato456', isAdmin: false},
    {email: 'lily.rose@gmail.com', password: 'sprinkles789'},
];


const seed = async () => {
    await User.bulkCreate(seedUsers);
};

//only seed once
seed().then(() => process.exit());