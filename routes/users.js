const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
var nodemailer = require('nodemailer');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User ({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  sendMail(newUser, info => {
    console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
    res.send(info);
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
  
});

//sending emails
async function sendMail(newUser, callback) {
  var transport = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    SSL: false,
    port: 587,
    auth: {
      user: "kesava.asetty@gmail.com",
      pass: "kesava12!@"
    },
    tls: {
      rejectUnauthorized: false
  }
  });
  
  var mailOptions = {
    from: '"Learning Language" <kesava.asetty@gmail.com>',
    to: newUser.email,
    subject: 'welcome to our learning application',
    text: 'Hey there, it’s our first message sent with Nodemailer ',
    html: '<b>Hey there! </b><br> thanks for registration<br />'
  };
  
//   transport.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('Message sent: %s', info.messageId);
//   });
// }
  let info = await transport.sendMail(mailOptions);
  callback(info);
}
// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByUserEmail(email, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});


router.put('/:_id', function(req,res){
  var id = req.params._id;
  var user = req.body;
  User.updateUser(id, user, {},function(err,user){
      if(err){
          throw err;
      }
      res.json(user);
  });
});


//get all users
router.get('/all', function(req,res){
  User.getUser(function(err,user){
      if(err){
          throw err;
      }
      res.json(user);
  });
});

// app.get('all/:_id',function(req,res){
//   var id = req.params._id;
//  Student.getUserById(id,function(err,user){
//      if(err){
//          throw err;
//      }
//      res.json(user);
//  });
// });


//remove users

// API for remove record

router.delete('/delete/:_id',function(req,res){
  var id = req.params._id;
  User.removeUser(id,function(err,user){
      if(err){
          throw err;
      }
      res.json(user);
  });
});

module.exports = router;
