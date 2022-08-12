//utilisation de regex lors de la création du MDP
module.exports = (req, res, next) => {
    const PASSWORD_REGEX_3=  /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (req.body.password.match(PASSWORD_REGEX_3)) {
        next();
    } else {
        //écrire la réponse avec une erreur 400 + le motif de l'erreur
        res.writeHead(
            400,
            "Mot de passe non valide: minimum 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.",
            {
              "content-type": "application/json",
            }
          );
          res.end("Le format de votre mot de passe est incorrect");
    }
  };