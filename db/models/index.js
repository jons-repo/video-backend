// Associations 
const Livestream = require('./livestream');
const User = require('./user');
const Chat = require('./chat')

// //one to many: student can have one campus WHILE campus can have many students
// Campus.hasMany(Student, {
//     foreignKey: 'campusId',
//     as: 'student',
// });

// Student.belongsTo(Campus, {
//     foreignKey: 'campusId',
//     as: 'campus'
// });

// module.exports = {
//     Student,
//     Campus
// }

 module.exports = {
     User,
     Livestream,
     Chat
     }