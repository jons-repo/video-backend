const db = require('./db');
const {User, Livestream, Message, Follow} = require ('./db/models');

const seedUsers = [
    {email: 'john.doe@gmail.com', password: 'tofu123', isAdmin: true, firstName: 'John', lastName: 'Doe', userName: 'johndoe88', mobile:'+19092258730'},
    {email: 'jane.doe@gmail.com', password: 'tomato456', isAdmin: false, firstName: 'Jane', lastName: 'Doe', userName: 'janedoe99',mobile:'+12287369800'},
    {email: 'lily.rose@gmail.com', password: 'sprinkles789', firstName: 'Lily', lastName:'Rose', userName:'lilyloa15',mobile:'+17162554949'},
    {email: 'tom.hanks@gmail.com', password: 'tom123', firstName: 'Tom', lastName:'Hanks', userName:'justtomhanks'},
];

const seedLivestreams = [
    { user_id: 1, description: 'hello first stream', title: 'first stream', code:'dfnkjswe0-43498fi-nrre'},
    { user_id: 2, description: 'second first stream', code:'430jrejjifd-dfnrie4-diore43' },
];

const seedMessages = [
    {content: 'hello', user_id: 1, livestream_id: 1 },
    { content: 'yes', user_id: 2, livestream_id: 2 }
];

const seedFollows = [
  { follower: 4, following: 3 }, 
  { follower: 1, following: 2 }, 

];

const seed = async () => {
  try {
    await User.bulkCreate(seedUsers);
    await Livestream.bulkCreate(seedLivestreams);
    await Message.bulkCreate(seedMessages);

    await Follow.bulkCreate(seedFollows);

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit();
  }
};

seed().then(() => process.exit());