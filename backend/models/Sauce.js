const mongoose = require('mongoose');

//ci-dessous le modèle du schéma de chaque info pour la sauce
const sauceSchema = mongoose.Schema({
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    mainPepper: {type: String, required: true},
    heat: {type: Number, required: true},
    userId: {type: String, required: true},
    likes: {type: Number, required: true},
    dislikes: {type: Number, required: true},
    usersLiked: {type: [String], required: true},
    usersDisliked: {type: [String], required: true},
});

module.exports = mongoose.model('Sauce', sauceSchema);