//crypte les informations
const bcrypt = require('bcrypt');
//permet de créer les tokens et de les vérifier
const jwt = require('jsonwebtoken');

//import du modèle (models) utilisateur
const User = require('../models/User');

//enregistrement de nvx users
exports.signup = (req, res, next) => {
    //crypte le mdp 10 fois
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: req.body.email, //crée new user avec mdp crypté et adresse mail passé dans le corps de la req
            password: hash //hashage du mdp à la création
        });
        user.save() //enregistre user dans la BDD
        .then(() => res.status(201).json({message: 'Utilisateur crée'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

//fonction login pour connecter user existant
exports.login = (req, res, next) => {
    //vérification de l'email si déjà existant
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        //si l'utilisateur est inexistant, on affiche une erreur
        if (user === null) {
            //pour toute confidentialité, on indique un message qui ne donne pas de grosse précision sur l'objet de l'erreur
            res.status(401).json({message: 'Identifiant ou mot de passe incorrect'});
        } else {
            bcrypt.compare(req.body.password, user.password) //on compare les entrées et les données
            .then(valid => {
                if (!valid){
                    res.status(401).json({message: 'Identifiant ou mot de passe incorrect'});
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( 
                            //chiffrer un nv token (contient ID en tant que payload (données encodées dans le token))
                            //donnée que l'on veut encoder dans le token
                            {userId: user._id},
                            //cle secrète encodée
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '1h'}
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({error}));
        }
    })
    .catch(error => res.status(500).json({error}));
};