//multer est un logiciel de gestion de fichiers
const multer = require('multer');

//création dictionnaire
const MIME_TYPES= {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg,',
    'image/png': 'png',
};

//création d'un obj de config pour multer
const storage = multer.diskStorage({ //configure le chemin et le nom de fichier pour les fichiers entrants
    destination: (req, file, callback) => { //La fonction de destination indique à Multer de sauvegarder les fichiers dans le fichier "images".
        callback(null, 'images')
    },
    filname: (req, file, callback) => { //La fonction "filename" indique à multer d'utiliser le nom d'origine 
        const name = file.originalname.split(' ').join('_'); //remplacer les espaces par des caractères de soulignement et ajouter l'horodatage comme nom de fichier
        const extension = MIME_TYPES[file.mimetype]; // Utilisez la constante du dictionnaire MIME pour résoudre l'extension de fichier appropriée ( ?).
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Exportation de l'élément multer entièrement configuré
module.exports = multer({storage}).single('image');