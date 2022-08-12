const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*ci-dessous le modèle du schéma du mail et du mdp :
l'email est unique*/
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//on ne peut pas avoir plsrs users avec même adresse mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);