const express = require('express');
//permet la création de routes individuelles
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordValidator = require('../middleware/password');

//routes POST car frontend va également envoyer les infos (mail+mdp)
router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;