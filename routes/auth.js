const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const secret = "sagar";
const fetchuser = require('../middleware/fetchuser')

//POST: /api/auth
router.post(
  "/",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 3 }),
  ], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({"email": req.body.email});
    if (user) {
      return res.status(400).json({ errors: "User already exist" });
    }
    const salt = await  bcrypt.genSalt(10);
    const encrptPass = await bcrypt.hash(req.body.password, salt);
    const userModal = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: encrptPass
    });

    const data = {
      user: {
         id: userModal.id
      }
    }

    var token = jwt.sign(data, secret);
    console.log(token)
    res.json({"authToken": token})
  }
);

router.post('/login', [body('email', 'Enter a valid email').isEmail()], 
async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
      let user = await User.findOne({"email": email});
      if (!user) {
        return res.status(400).json({error: "Please login with correct username and password"});
      }
      const salt = await  bcrypt.genSalt(10);
      const encrptPass = await bcrypt.hash(req.body.password, salt);
      const passwordCompare = await bcrypt.compare(password, encrptPass);
      if(!passwordCompare) {
        return res.status(400).json({error: "Please login with correct username and password"});
      }

      const data = {
        user: {
           id: user.id
        }
      }
  
      var token = jwt.sign(data, secret);
      console.log(token)
      res.json({"authToken": token})
    } catch (error) {
      console.log(error);
      res.status(500).json({error: "Internal server error"});
    }
})


router.get('/getuser', fetchuser, async (req, res) => {
  try {
  let user = await User.findById(req.body.id).select("-password");
  res.json(user);
  } catch (error) {
  console.log(error);
  res.status(500).json({error: "Internal server error"});
}
})

module.exports = router;
