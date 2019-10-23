const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema ({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String
  },
  password: {
    type: String,
    required: true
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUserEmail = function(email, callback) {
  const query = {email: email}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}

module.exports.updateUser = function(id,user,options,callback){
  var query = {_id:id};
  var update = {
    name: user.name,
    email: user.email,
    username: user.username,
    password: user.password
    
  }
  User.findOneAndUpdate(query, update, options, callback);
}

// module.exports.updateUser = function (req, res) {
//   Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
//       if (err) return next(err);
//       res.send('Product udpated.');
//   });
// };


//get all users

module.exports.getUser = function(callback,limit){
  User.find(callback).limit(limit);
}

//delete a recored

module.exports.removeUser = function(id,callback)
{
    var query = {_id:id};
    User.remove(query,callback);
}
