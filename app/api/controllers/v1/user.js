const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const User = require("../../models/user");
const cvFunctions = require("../../global/cvFunction")

exports.user_signup = async (req, res, next) => {
  try {
    const {
      email,
      gender,
      place,
      firstName,
      password,
      lastName,
      phoneNumber,
      language,
      educations,
      experiences
    } = req.body

    if (
      !email ||
      !gender ||
      !place ||
      !firstName ||
      !lastName ||
      !password ||
      !phoneNumber ||
      !language
    ) {
      return res.status(409).json({
        message: "missing fields",
      });
    }
    const tryuser = await User.findOne({
      email: req.body.email
    })
    if (tryuser) {
      return res.status(409).json({
        message: "email already exists"
      });
    }
    const hash = await new Promise((resolve, reject) => {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      password: hash,
      firstName: firstName,
      lastName: lastName,
      place: place,
      gender: gender,
      phoneNumber: phoneNumber,
      language: language,
      educations: educations || [],
      experiences: experiences || [],
    });
    await user.save()
    res.status(200).json({
      message: "user created"
    });
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "error"
    });
  }
};

exports.user_get_user = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await User.findById(id)
    if (!user) {
      res.status(401).json({
        message: "user not found"
      });
    }
    res.status(200).json({
      user: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "error"
    });
  }
};

exports.user_login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    }).select("+password")
    if (!user) {
      res.status(401).json({
        message: "user not found"
      });
    }
    const result = await new Promise((resolve, reject) => {
      bcrypt.compare(req.body.password, user.password, function (err, hash) {
        if (err) {
          return res.status(401).json({
            message: "email or password incorrect"
          });
        }
        resolve(hash)
      });
    })
    if (result) {
      const token = jwt.sign({
          email: user.email,
          userId: user._id
        },
        process.env.JWT_KEY, {
          expiresIn: "7d"
        }
      );
      return res.status(200).json({
        message: "auth successful",
        token: token,
        _id: user._id,
        language: user.language
      });
    } else {
      return res.status(401).json({
        message: "email or password incorrect"
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "error"
    });
  }
};

exports.users_update_user = async (req, res, next) => {
  if (req.userData.userId == req.params.userId) {
    try {
      const id = req.params.userId;
      delete req.body.password;
      await User.updateOne({
        _id: id
      }, {
        $set: req.body
      })
      res.status(200).json({
        message: "user updated",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "error"
      });
    }
  } else {
    return res.status(401).json({
      message: "unathorized"
    });
  }
};

exports.user_delete = async (req, res, next) => {
  if (req.userData.userId == req.params.userId) {
    try {
      await User.deleteOne({
        _id: req.params.userId
      })
      res.status(200).json({
        message: "user deleted",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "error"
      });
    }
  } else {
    return res.status(401).json({
      message: "unathorized"
    });
  }
};

exports.user_export_cv = async (req, res, next) => {
  if (req.userData.userId == req.params.userId) {
    try {
      const id = req.params.userId;
      const template = req.body.template;
      const user = await User.findById(id)
      await cvFunctions.exportCV(user, template)
      var filename = './app/cv/' + user._id + '.pdf'
      var file = fs.readFileSync(filename)
      res.contentType('application/pdf');
      res.send(file);
      fs.unlinkSync(filename)
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "error"
      });
    }
  } else {
    return res.status(401).json({
      message: "unathorized"
    });
  }
};