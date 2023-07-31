// Associations 
const Livestream = require('./livestream');
const User = require('./user');
const Message = require('./message')
const Follow = require('./follow');
const Videochat = require('./videochat');
const Recording = require('./recording');

User.hasOne(Livestream, {
    foreignKey: 'user_id',
    as: 'user',
})

Livestream.hasMany(Message, {
    foreignKey: 'livestream_id',
    as: 'message',
});

Message.belongsTo(Livestream, {
    foreignKey: 'livestream_id',
    as: 'livestream'
});

User.hasMany(Message, {
    foreignKey: 'user_id',
    as: 'message',
});

Message.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Follow.belongsTo(User, {
    foreignKey: 'follower',
    as: 'followerUser',
});

Follow.belongsTo(User, {
    foreignKey: 'following',
    as: 'followingUser',
});

User.hasOne(Videochat, {
    foreignKey: 'user_id',
    as: 'videochat-user',
})

Videochat.belongsTo(User, {
    foreignKey: 'user_id',
})

Videochat.hasMany(Message, {
    foreignKey: 'videochat_id',
    as: 'videochat-message',
});

Message.belongsTo(Videochat, {
    foreignKey: 'videochat_id',
    as: 'videochat'
});

Livestream.hasMany(Recording, {
    foreignKey: 'livestream_id',
    as: 'recording-livestream-rel',
});

Recording.belongsTo(Livestream, {
    foreignKey: 'livestream_id',
    as: 'recording-livestream-rel'
});

User.hasMany(Recording, {
    foreignKey: 'user_id',
    as: 'recording-user-rel',
});

Recording.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'recording-user-rel'
});



module.exports = {
    User,
    Livestream,
    Message,
    Follow,
    Videochat,
    Recording,
};