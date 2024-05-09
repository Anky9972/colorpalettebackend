// routes/user.js

const express = require('express');
const router = express.Router();

const {signup,login,savePalette,getSavedPalette,saveFullPalette,getFullPalette} = require('../controller/Auth');
const {getImage} = require('../controller/Image');


router.post('/signup',signup);
router.post('/login',login)
router.post('/save',savePalette)
router.post('/savefullpalette',saveFullPalette)
router.get('/getsaved/:userId',getSavedPalette);
router.get('/getfullpalette/:userId',getFullPalette);
router.get('/image-proxy',getImage);
module.exports = router;
