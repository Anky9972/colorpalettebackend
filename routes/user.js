

const express = require('express');
const router = express.Router();

const {signup,login,savePalette,getSavedPalette,saveFullPalette,getFullPalette} = require('../controller/Auth');
const {getImage} = require('../controller/Image');
const {shareURL,sharePDF,sharePNG,shareSVG,shareEmbeddedSVG} = require('../controller/Exports')
const { forgotPassword, resetPassword } = require('../controller/Reset');

router.post('/signup',signup);
router.post('/login',login)
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/save',savePalette)
router.post('/savefullpalette',saveFullPalette)
router.get('/getsaved/:userId',getSavedPalette);
router.get('/getfullpalette/:userId',getFullPalette);
router.get('/image-proxy',getImage);
router.get('/share',shareURL);
router.get('/share-pdf',sharePDF);
router.get('/share-png',sharePNG);
router.get('/share-svg',shareSVG);
router.get('/share-embedded',shareEmbeddedSVG);
module.exports = router;
