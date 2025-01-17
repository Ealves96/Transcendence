let isLoggedIn = false; // Indique si l'utilisateur est connecté
let currentUsername = ""; // Stocke le nom d'utilisateur après connexion

function toggleProfileOrLogin() {
    if (isLoggedIn) {
        loadSection('user-profile'); // Afficher les informations utilisateur
    } else {
        showLoginModal(); // Afficher la fenêtre de connexion
    }
}

function showLoginModal() {
    const modalElement = document.getElementById('login-modal');
    const loginModal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
    loginModal.show();
}

function showUserProfile() {
    alert(`Profil de l'utilisateur : ${currentUsername}`);
    // Remplacez cet alert par une modal ou une section de profil.
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        console.log(`Utilisateur connecté : ${username}`);
        isLoggedIn = true;
        currentUsername = username;

        // Ferme la modal de connexion
        const modalElement = document.getElementById('login-modal');
        const loginModal = bootstrap.Modal.getInstance(modalElement);
        loginModal.hide();

        // Met à jour le bouton utilisateur et affiche l'username
        updateUserButton();
        displayUsername();

        // Charge le jeu Pong
        loadSection('pong-game');
    } else {
        alert('Veuillez entrer un pseudo et un mot de passe valides.');
    }
}

function updateUserButton() {
    const userActionBtn = document.getElementById('user-action-btn');
    if (isLoggedIn) {
        userActionBtn.setAttribute('title', `Profil : ${currentUsername}`);
    } else {
        userActionBtn.removeAttribute('title');
    }
}

function loadUserProfile() {
    const userInfo = {
        username: currentUsername,
        email: `${currentUsername.toLowerCase()}@example.com`,
        dob: '01/01/1990', // Exemple de date de naissance
        phone: '+33 6 12 34 56 78', // Exemple de numéro de téléphone
        joined: '01/01/2023'
    };

    document.getElementById('profile-username').innerText = userInfo.username;
    document.getElementById('profile-email').innerText = userInfo.email;
    document.getElementById('profile-dob').innerText = userInfo.dob;
    document.getElementById('profile-phone').innerText = userInfo.phone;
    document.getElementById('profile-joined').innerText = userInfo.joined;
}

function handleLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        isLoggedIn = false; // Réinitialise l'état de connexion
        currentUsername = ''; // Réinitialise le nom d'utilisateur

        // Efface l'username affiché
        displayUsername();

        // Redirige vers la page de connexion
        loadSection('login');

        // Met à jour le bouton utilisateur
        updateUserButton();

        console.log('Utilisateur déconnecté');
    }
}

function displayUsername() {
    const usernameDisplay = document.getElementById('username-display');
    if (isLoggedIn && currentUsername) {
        usernameDisplay.innerText = currentUsername;
    } else {
        usernameDisplay.innerText = '';
    }
}
