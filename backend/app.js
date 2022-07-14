//importer Express
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//routes vers user et sauces
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//connexion à la BDD
mongoose.connect('URI',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//permet de créer une application Express
const app = express();

//app.use(express.json()); ce middleware intercepte toutes les requetes qui contiennent du json et donne accès au corps de la req (autre meth : body.parser)

//middleware général : s'applique à toutes les routes-requêtes envoyées au serveur
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //permet d'accéder à l'API de n'importe quelle origine ('*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //ajoute les headers mentionnés aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //envoie des requêtes avec les méthodes mentionnées
    next();
  });

app.use(bodyParser.json());

//on a importé ce qui était ici à la route sauces
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//exporter l'appli/constante pour y accéder depuis les autres fichiers du projet notamment le serveur NODE
module.exports = app;