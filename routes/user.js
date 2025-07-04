const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync (userController.signup));

router.get("/login",userController.renderLoginForm);

router.post('/login', saveRedirectUrl,
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),userController.login);

router.get("/logout", userController.logout);

router.get("/profile", userController.profile);

module.exports = router;