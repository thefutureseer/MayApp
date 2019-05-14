const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator/check');


const User = require('../../models/User');

//@route GET api/users
//@discription test route
//@access public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch {
      console.error(err.message);
      res.status(500).send('server error');
    }
});


//@route POST api/auth
//@discription authenticate user and get token
//@access public
router.post(
  '/', 
  [
    check('name', 'please include a name').exists(),
    check('phone', 'phone number required').exists(),
    check('password', 'password is required').exists()
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
    const { name, password } = req.body;
    try {
      let user = await User.findOne({ name });

 //see if user exists
      if (!user) {
        return res
         .status(400)
         .json({ errors: [{ msg: 'invalid credentials'}] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(400)
          .json({ errors: [{ msg: 'invalid credentials'}] });
      }
  const payload = {
    user: {
      id: user.id
    }
  };

  jwt.sign(
    payload, 
    config.get('jwtSecret'), 
    { expiresIn: 36000 },
    (err, token) => {
      if (err) throw err;
      res.json({token});
  });

    } catch (err) {
       console.error(err.message);
       res.status(500).send('server error');
    }
 
  }
);

module.exports = router;