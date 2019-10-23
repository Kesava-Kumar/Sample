const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = module.exports = mongoose.model('Admin', AdminSchema);

// Find the Admin by ID
module.exports.getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}

// Find the Admin by Its email
module.exports.getAdminByEmail = function (email, callback) {
    const query = {email: email}
    Admin.findOne(query, callback);
}

// to Register the Admin
module.exports.addAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
}

// module.exports.addUser = function(newUser, callback) {
//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(newUser.password, salt, (err, hash) => {
//         if(err) throw err;
//         newUser.password = hash;
//         newUser.save(callback);
//       });
//     });
//   }



// Compare Password
module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}