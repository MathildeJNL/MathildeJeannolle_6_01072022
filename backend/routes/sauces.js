//importe package
const express = require('express');

const auth = require('../middleware/auth');

//fonction router d'express = permet la création de routes individuelles pour création de router
const router = express.Router();

//importe package mutler pour la gestion des img
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

//création sauce
router.post('/', auth, multer, saucesCtrl.createSauce);

//modification de la sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//suppression de la sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//récup' d'une seule sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);

//récup' toutes les sauces
// router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/',auth, saucesCtrl.getAllSauces);

//like ou dislike une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;