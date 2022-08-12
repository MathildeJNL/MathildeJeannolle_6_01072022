//importation du model
const Sauce = require('../models/Sauce');

//File System = donne accès aux fonct° qui permettent de modifier/supprimer un fichier
const fs = require('fs');

//CREATION SAUCE :
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId
    const sauce = new Sauce({
        //opérateur spread (...) récupère toutes les infos du body
        ...sauceObject,
        //on initialise les likes/dislikes à 0
        likes: 0,
        dislikes: 0,
        //on ajoute au tableau prévu l'id de l'utilisateur en fonction de son choix
        usersLiked: [],
        usersDisliked: [],
        userId: req.auth.userId,
        //récupère l'img (dynamique)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //sauvegarde la sauce dans la BDD
    sauce.save()
        //promesse
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée' }) })
        .catch(error => { res.status(400).json({ error }) })
};

//MODIFICATION SAUCE :
exports.modifySauce = (req, res, next) => {

    // opérateur ? = condition
    const sauceObject = req.file ? {
        //opérateur spread (...) récupère toutes les infos du body
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    //retrouve la sauce grâce à l'id
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //si l'user n'est pas le bon : non autorisé
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non-autorisé' });
            } else {
                //sinon, on MAJ la sauce
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    //avec message concerné selon retour promesse
                    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => { res.status(400).json({ error }) });
};

//SUPPRESSION SAUCE :
exports.deleteSauce = (req, res, next) => {
    //retrouve l'élément grâce à l'id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //si ce n'est pas l'user qui a posté, on ne donne pas autorisation
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non-autorisé' });
                //si user ok, on recupère d'abord le nom du fichier
            } else {
                //on récupère le nom du fichier
                const filename = sauce.imageUrl.split('/images/')[1];
                //puis suppression img et id du système
                //unlink() permet de supprimer un fichier du syst. de fichier
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                })
            }
        })
        .catch(error => { res.status(5500).json({ error }) });
};

//RECUP 1 SAUCE :
exports.getOneSauce = (req, res, next) => {
    //retrouve l'élément grâce à l'id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//RECUP TOUTES LES SAUCES :
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//LIKE OU DISLIKE UNE SAUCE
exports.likeSauce = (req, res, next) => {
    //on récupère l'id du user, l'id de la sauce et le like.
    const userId = req.body.userId;
    const sauceId = req.params.id;
    const like = req.body.like;

    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            //on récupère les valeurs de like et dislike
            const values = {
                //initialise (tableau) users qui like/dislike sauce
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                //on compte le nombre de likes et dislikes grâce au nombre de user qu'on peut compter dans le tableau
                likes: sauce.usersLiked.length,
                dislikes: sauce.usersDisliked.length,
            };
            //Plusieurs scénarios possibles avec utilisation de la condition switch
            switch (like) {
                case 1: //on insère le userId dans le tableau (push) si le user fait un like
                    values.usersLiked.push(userId);
                    break;
                case -1: //on insère le userId dans le tableau (push) si le user fait un dislike
                    values.usersDisliked.push(userId);
                    break;
                case 0: //annulation d'un like ou dislike
                    //si le user annule son like
                    if (values.usersLiked.includes(userId)) {
                        //indexOf : renvoi la position du le tableau de userLike pour ce cas
                        const index = values.usersLiked.indexOf(userId);
                        //splice : suppression d'un indice spécifique du tableau
                        values.usersLiked.splice(index, 1);
                        
                    //si le user annule son dislike
                    } else {
                        const index = values.usersDisliked.indexOf(userId);
                        values.usersDisliked.splice(index, 1);
                    }
                    break;
                //case default :
                //error
            }

            //on affiche la sauce avec les nouvelles valeurs
            //
            Sauce.updateOne({ _id: sauceId }, values)
                .then(() => res.status(200).json({ message: "Votre vote a bien été pris en compte!" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};