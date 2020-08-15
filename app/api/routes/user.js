const express = require("express");
const router = express.Router();
const UserControllerV1 = require('../controllers/v1/user');
var routesVersioning = require('express-routes-versioning')();
const checkAuth = require('../middleware/check-auth');


router.post("/signup",routesVersioning({
  "1.0.0": UserControllerV1.user_signup, 
}));

router.post("/login",routesVersioning({
  "1.0.0": UserControllerV1.user_login, 
}));

router.patch("/:userId",checkAuth,routesVersioning({
  "1.0.0": UserControllerV1.users_update_user, 
}));

router.delete("/:userId", checkAuth,routesVersioning({
  "1.0.0": UserControllerV1.user_delete, 
}));

router.get("/:userId",checkAuth,routesVersioning({
  "1.0.0": UserControllerV1.user_get_user, 
}));

router.post("/html/:userId", checkAuth, routesVersioning({
  "1.0.0": UserControllerV1.user_html_cv,
}));

router.post("/export/:userId", checkAuth, routesVersioning({
  "1.0.0": UserControllerV1.user_export_cv,
}));

module.exports = router;
