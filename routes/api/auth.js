const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

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



module.exports = router;