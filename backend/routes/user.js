const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//routes POST car frontend va également envoyer les infos (mail+mdp)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;