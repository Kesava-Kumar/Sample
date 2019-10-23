const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/database');


router.post('/register', (req, res, next) => {
    let newAdmin = new Admin({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    Admin.addAdmin(newAdmin, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "Admin registration is successful."
            });
        }

        // if(err) {
        //     res.json({success: false, msg: 'Failed to register Admin'});
        //   } else {
        //     res.json({success: true, msg: 'Admin registered'});
        //   }
        });
    });
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Admin.getAdminByEmail(email, (err, admin) => {
        if (err) throw err;
        if (!admin) {
            return res.json({
                success: false,
                message: "Admin not found."
            });
        }

        Admin.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "admin",
                    data: {
                        _id: admin._id,
                        username: admin.username,
                        email: admin.email
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});

/**
 * Get Authenticated user profile
 */

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});

module.exports = router;