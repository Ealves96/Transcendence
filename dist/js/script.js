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
    loadHTML('partials/footer.html', 'footer-placeholder');
    loadHTML('partials/login-modal.html', 'login-modal-placeholder')
        .then(() => {
            // Afficher la modal de connexion automatiquement
            const modalElement = document.getElementById('login-modal');
            const loginModal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
            // loginModal.show(); //desactive l'affichage de la fenetre de connexion
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
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

function loadSection(section) {
    const sectionMap = {
        'friends': 'partials/friends.html',
        'ranking': 'partials/ranking.html',
        'chat': 'partials/chat.html',
		'login': 'partials/login-modal.html',
        'pong-game': 'partials/pong-game.html',
        'user-profile': 'partials/user-profile.html',
        'friend-request': 'partials/friend-request.html'
    };
    if (sectionMap[section]) {
        loadHTML(sectionMap[section], 'main-content')
            .then(() => {
                switch (section) {
                    case 'pong-game':
                        console.log('Appel de InitPongGame');
                         try {
                            initPongGame();
                        } catch (error) {
                            console.error('Erreur lors de l\'initialisation du jeu Pong:', error);
                        }
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
                        console.log('Section sans initialisation spécifique');
                }
            })
            .catch(error => console.error('Error loading section:', error));
    }
}
