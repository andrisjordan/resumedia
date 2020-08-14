const mongoose = require("mongoose");
const fs = require("fs");
const CV = require("../../models/cv");
const User = require("../../models/user");
const cvFunctions = require("../../global/cvFunction");

exports.cv_create_cv = async (req, res, next) => {
    try {
        const {
            user,
            eduactions,
            experiences
        } = req.body

        if (
            !user ||
            !eduactions ||
            !experiences
        ) {
            return res.status(409).json({
                message: "missing fields",
            });
        }
        const cv = new CV({
            _id: new mongoose.Types.ObjectId(),
            user: user,
            eduactions: eduactions,
            experiences: experiences
        })
        await cv.save()
        res.status(200).json({
            message: "cv created",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "error"
        });
    }
};

exports.cv_get_cv = async (req, res, next) => {
    try {
        const id = req.params.cvId;
        const cv = await CV.findById(id)
        res.status(200).json({
            cv: cv,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "error"
        });
    }
};

exports.cv_get_user = async (req, res, next) => {
    if (req.userData.userId == req.params.userId) {
        try {
            const id = req.params.userId;
            const cvs = await CV.find({
                user: id
            })
            res.status(200).json({
                cvs: cvs,
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

exports.cv_update_cv = async (req, res, next) => {
    try {
        const id = req.params.cvId;
        await CV.updateOne({
            _id: id
        }, {
            $set: req.body
        })
        res.status(200).json({
            message: "cv updated",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "error"
        });
    }
};

exports.cv_export_cv = async (req, res, next) => {
    try {
        const id = req.params.cvId;
        const cv = await CV.findById(id)
        if (req.userData.userId == cv.user) {
            const user = await User.findById(cv.user)
            await cvFunctions.exportCV(user, cv)
            var filename = './app/cv/' + cv._id + '.pdf'
            var file = fs.readFileSync(filename)
            res.contentType('application/pdf');
            res.send(file);
            fs.unlinkSync(filename)
        } else {
            return res.status(401).json({
                message: "unathorized"
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "error"
        });
    }
};

exports.cv_delete = async (req, res, next) => {
    try {
        await CV.deleteOne({
            _id: req.params.cvId
        })
        res.status(200).json({
            message: "cv deleted",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "error"
        });
    }
};