const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // ctx ici est pour contexte et donc ça va nous permettre d'animer des choses en 2D (aller voir getContext dans votre navigateur)
const img = new Image();
img.src = './media/flappy-bird-set.png';

// Réglage général
let gamePlaying = false; // Je vérifie que l'on est entrain de jouer ou non au jeux pour afficher l'ecran d'acceuil
const gravity = .5; // Je place une variable gravité
const speed = 6.2; // Je place une variable de vitesse
const size = [51, 36]; // Je place une variable de la taille de mon ange
const jump = -11.5; // Je place une variable de la taille des sauts de mon ange
const cTenth = (canvas.width / 10); // Je place une varaible dont je me ressert plus tard pour placer mon ange pendant le jeu à 1/10eme de l'écran sur la gauche

// Réglages des poteaux
const pipeWidth = 78; // Largeur d'un poteau en px, utile pour les calculs plus tard
const pipeGap = 270; // Espace entre deux poteaux, utile pour les calculs plus tard
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth; // Formule alambiqué pour avoir la hauteur des poteaux en aleatoire (je n'ai pas chercher a comprendre cette formule)

let index = 0, // Cela nous permet de gérer l'effet d'optique que l'ange avance 
    bestScore = 0, // BestScore à 0 si pas de partie avant
    currentScore = 0, // CurrentScore à 0 si pas de partie en cours
    pipes = [], // Ce sont les poteaux, on les met dans un tableau
    flight, // C'est la variable pour le vol de mon ange
    flyHeight; // C'est la hauteur de vol de mon ange

const setup = () => { // Je crée un setup qui se lance à chque partie
    currentScore = 0; // Je remet le currentScore à 0
    flight = jump; // Je remet l'ange au bon endroit
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
    index++; // Augmenter l'index nous permet de donner l'illusion d'avancer sur la map

    // Background
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);

    if (gamePlaying) {
        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
    } 
    else {

    // Ici je crée l'animation de mon oiseau
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size); // Permet de selectionner une partie de l'image à afficher sur une image ou il y a plusieurs éléments
    // 432 coorespond à l'axe X est l'ange est à 432px, 0 correspond à l'axe Y, ...size nous permet de faire ref à size en ligne 10 et cela nous rentre le 3eme et le 4eme paramétre
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    ctx.fillText(`Meilleur Score : ${bestScore}`, 55, 245); // Ici je crée le texte qui apparait sur mon écran d'acceuil, 55 et 245 représente sa position x et y
    ctx.fillText(`Cliquez pour jouer`, 48, 535); // Ici je crée le texte qui apparait sur mon écran d'acceuil, 48 et 535 représente sa position x et y
    ctx.font = "bold 30px courier"; // Ici je régle la police ainsi que sa taiile
    }

    // Je crée l'animation de mes poteaux
    if (gamePlaying) {
        pipes.map(pipe => {
            pipe[0] -= speed; // Ici je détermine la vitesse de mes poteaux grace a ma const décalré plus haut

            // Poteaux du haut
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            // Poteaux du bas
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            if (pipe[0] <= -pipeWidth) {
                currentScore++; // Rajoute un point lorsque qu'un poteau disparait sur la gauche
                bestScore = Math.max(bestScore, currentScore); // Je vérifie que mon currentScore n'est pas mon bestScore sinon place en bestScore

                // Retrait d'un poteaux et creation d'un nouveau
                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }
            // Si contact avec un des poteaux fin de la partie
            if ([ // Toutes les conditions doivent être false, si l'une passe sur true fin de la partie
                pipe[0] <= cTenth + size[0], // Avec ces 2 conditions je vérifie que l'ange ne touche pas les poteaux
                pipe[0] + pipeWidth >= cTenth, 
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1] // Ici je vérifie que l'ange se situe dans le gap entre les deux poteaux
              ].every(elem => elem)) { // every est une fonction statique permettant de verifier toutes les conditions présente au dessus en mettant un seul IF
                gamePlaying = false; // Fin de la partie
                setup(); // On relance le setup
              }
        })
    }
    // J'affiche les scores de manière dynamique dans le canvas
    document.getElementById('bestScore').innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById('currentScore').innerHTML = `Actuel : ${currentScore}`;

    window.requestAnimationFrame(render); // Cette fonction permet de faire tourner l'animation en boucle
}

setup();
img.onload = render; // Au chargement de l'image tu peux lancer la fonction render

document.addEventListener('click', () => gamePlaying = true); // le Jeu se lance en cliquant sur l'écran
window.onclick = () => flight = jump; // Quand on clique sur l'écran applique la hauteur du jump au vol de mon ange