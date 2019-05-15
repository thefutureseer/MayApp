const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route POST api/posts
//@discription create a post
//@access private
router.post(
  '/', 
  [ 
    auth, 
    [ 
      check('text', 'text is required')
        .not()
        .isEmpty()
    ]
  ], 
  async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
   }
   try {
    const user = await User.findById(req.user.id).select('-password');
    
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      user: req.user.id
    });

    const post = await newPost.save();
    res.json(post);
   } catch (err) {
     console.error(err.message);
     res.status(500).send('server error');
   }
  
  }
);

//@route GET api/posts
//@discription get all posts
//@access private
router.get('/', auth, async (req, res) => {
 try {
  const post = await Post.find().sort({ date: -1 });
  res.json(post)
   
 } catch (err) {
   console.error(err.message);
   err.status(500).send('server error');
   
 }
});

//@route GET api/posts/:id
//@discription get a post by its id
//@access private
router.get('/:id', auth, async (req, res) => {
  try {
   const post = await Post.findById(req.params.id);

   if(!post) {
    return res.status(404).json({ msg: 'post not found '});
   }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found '});
    }
    res.status(500).send('server error');
    
  }
 });

 //@route DELETE api/posts/:id
//@discription delete a posts
//@access private
router.delete('/:id', auth, async (req, res) => {
  try {
   const post = await Post.findById( req.params.id );

   if(!post) {
    return res.status(404).json({ msg: 'post not found '});
  }

//Check user
   if (post.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'user not authorized to delete this post'})
   }

   await post.remove();
   res.json({msg: 'post removed'});
    
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found '});
    }
    err.status(500).send('server error');
    
  }
 });
 

module.exports = router;