//création de token aléatoires et uniques
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //gérer les erreurs
    try{
        /*on récupère le token (dans le header) qui se situe après "Bearer" (place 0 dans le tableau),
        donc au n°1 dans le tableau*/
        const token = req.headers.authorization.split(' ')[1];
        /*=>la fonction verify permet de faire une vérification que le token soit correct (bon mot de passe)
        puis le décode (on récupère le payload)
        */
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error){
        res.status(401).json({error});
    }
};