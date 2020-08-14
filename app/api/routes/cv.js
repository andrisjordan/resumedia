const express = require("express");
const router = express.Router();
const CVControllerV1 = require('../controllers/v1/cv');
var routesVersioning = require('express-routes-versioning')();
const checkAuth = require('../middleware/check-auth');

router.post("/", checkAuth, routesVersioning({
    "1.0.0": CVControllerV1.cv_create_cv,
}));

router.patch("/:cvId", checkAuth, routesVersioning({
    "1.0.0": CVControllerV1.cv_update_cv,
}));

router.delete("/:cvId", checkAuth, routesVersioning({
    "1.0.0": CVControllerV1.cv_delete,
}));

router.get("/user/:userId", checkAuth, routesVersioning({
    "1.0.0": CVControllerV1.cv_get_user,
}));

router.get("/export/:cvId", checkAuth, routesVersioning({
    "1.0.0": CVControllerV1.cv_export_cv,
}));

router.get("/:cvId", checkAuth, routesVersioning({
    "1.0.0": CVControllerV1.cv_get_cv,
}));

module.exports = router;