// const socket = new WebSocket('ws://your-server-url');

// socket.onmessage = function(event) {
//     const data = JSON.parse(event.data);
//     console.log('Message reçu depuis le serveur:', data);
//     // Mettez à jour la position de la balle ou des raquettes ici
// };

function sendPlayerPosition(position) {
    socket.send(JSON.stringify({ type: 'playerPosition', position }));
}

document.addEventListener("DOMContentLoaded", function () {
    loadHTML('partials/header.html', 'header-placeholder');
    loadHTML('partials/sidebar.html', 'sidebar-placeholder');
	loadHTML('partials/home.html', 'main-content');
	// loadHTML('partials/user-profile.html', 'main-content');
    loadHTML('partials/footer.html', 'footer-placeholder');
    loadHTML('partials/login-modal.html', 'login-modal-placeholder')
        .then(() => {
            // Afficher la modal de connexion automatiquement
            const modalElement = document.getElementById('login-modal');
            const loginModal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
            // DECOMMENTER :
            loginModal.show(); //desactive l'affichage de la fenetre de connexion
        });
});

function loadHTML(url, elementId) {
    console.log(`Chargement de : ${url}`);
    return fetch(url)
        .then(response => {
            console.log(`Réponse reçue pour : ${url}`);
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            } else {
                console.error(`Élément introuvable : ${elementId}`);
            }
        })
        .catch(error => console.error('Erreur de chargement HTML:', error));
}


function loadSection(section) {
    const sectionMap = {
        'home': 'partials/home.html',
        'friends': 'partials/friends.html',
        'ranking': 'partials/ranking.html',
        'chat': 'partials/chat.html',
        'login': 'partials/login-modal.html',
        'pong-game': 'partials/pong-game.html',
        'user-profile': 'partials/user-profile.html',
        'friend-request': 'partials/friend-request.html'
    };

    if (!sectionMap[section]) {
        console.error(`Section inconnue : ${section}`);
        return;
    }

    console.log(`Chargement de la section : ${section}`);

    // Charger le contenu de la section
    loadHTML(sectionMap[section], 'main-content')
        .then(() => {
            switch (section) {
                case 'home':
                    console.log('Accueil chargé.');
                    break;

                case 'pong-game':
                    console.log('Chargement du Pong...');

                    // Vérifier si l'élément de chargement existe
                    const loadingScreen = document.getElementById("loading-screen");
                    if (loadingScreen) {
                        loadingScreen.classList.add("show"); // Afficher le loading
                    } else {
                        console.warn("⚠️ L'élément #loading-screen est introuvable !");
                    }

                    setTimeout(() => {
                        try {
                            initPongGame(); // Démarrer le Pong après le chargement
                            console.log("Pong lancé avec succès !");
                        } catch (error) {
                            console.error("Erreur lors du lancement du Pong :", error);
                        }

                        // Masquer l'écran de chargement après 1 seconde
                        if (loadingScreen) {
                            setTimeout(() => {
                                loadingScreen.classList.remove("show");
                            }, 400);
                        }
                    }, 500); // Ajout d'une attente avant l'initiation
                    break;

                case 'chat':
                    initChat();
                    break;

                case 'ranking':
                    initRanking();
                    break;

                case 'friends':
                    initFriends();
                    break;

                case 'user-profile':
                    loadUserProfile();
                    break;

                case 'login':
                    showLoginModal();
                    break;

                case 'friend-request':
                    initFriendRequest();
                    break;

                default:
                    console.log('ℹSection sans initialisation spécifique.');
            }
        })
        .catch(error => {
            console.error(`Erreur lors du chargement de la section ${section}:`, error);
        });
}



function startGame(mode) {
    console.log("Mode sélectionné :", mode);

    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) {
        console.error("Erreur : l'élément #loading-screen est introuvable !");
        return;
    }

    // Afficher l'écran de chargement
    loadingScreen.classList.add("show");

    setTimeout(() => {
        if (mode === 'solo') {
            loadSection('pong-game'); // Charge le Pong
        } else if (mode === 'duo') {
            alert("Le mode 2 joueurs n'est pas encore disponible !");
            loadingScreen.classList.remove("show"); // Cache le loading si pas de jeu
        } else {
            alert("Mode multijoueur en cours de développement !");
            loadingScreen.classList.remove("show"); // Cache le loading si pas de jeu
        }
    }, 500); // Temps d'affichage du loading avant de charger le jeu
}


