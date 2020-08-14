const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const User = require("../../models/user");

exports.user_signup = (req, res, next) => {
  User.find({
      email: req.body.email,
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "email already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
              message: "002"
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              place: req.body.place,
              gender: req.body.gender,
              phoneNumber: req.body.phoneNumber,
              language: req.body.language,
            });
            user
              .save()
              .then(result => {
                res.status(200).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  message: "002"
                });
              });
          }
        });
      }
    });
};

exports.user_get_user = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then(doc => {
      User.findById(id)
        .exec()
        .then(doc => {
          if (doc) {
            res.status(200).json({
              user: doc,
            });
          } else {
            res.status(404).json({
              message: "047"
            });
          }
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: "002"
      });
    });
};

exports.user_login = (req, res, next) => {
  User.find({
      email: req.body.email,
    })
    .select("+password")
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "032"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "032"
          });
        }
        if (result) {
          const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY, {
              expiresIn: "7d"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            _id: user[0]._id,
            language: user[0].language
          });
        }
        res.status(401).json({
          message: "032"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "002"
      });
    });
};

exports.users_update_user = (req, res, next) => {
  if (req.userData.userId == req.params.userId) {
    const id = req.params.userId;
    delete req.body.password;
    User.update({
        _id: id
      }, {
        $set: newbody,
      })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "User updated",
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "002"
        });
      });
  } else {
    return res.status(401).json({
      message: "003"
    });
  }
};

exports.user_delete = (req, res, next) => {
  if (req.userData.userId == req.params.userId) {
    User.deleteOne({
      _id: req.params.userId
    }).then(deleted => {
      res.status(200).json({
        message: "User deleted",
      });
    })
  } else {
    return res.status(401).json({
      message: "003"
    });
  }
};