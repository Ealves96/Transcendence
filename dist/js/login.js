let isLoggedIn = false; // Indique si l'utilisateur est connecté
let currentUsername = ""; // Stocke le nom d'utilisateur après connexion

//verifie le stockage utilisateur
document.addEventListener("DOMContentLoaded", () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        console.log("Utilisateur déjà connecté, récupération des infos...");
        getUserInfo(accessToken);
    }
});

//script de connexion
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");

    if (authCode) {
        console.log("Code d'autorisation reçu :", authCode);

        // Stocker la connexion
        localStorage.setItem("isAuthenticated", "true");
        console.log("Authentification enregistrée !");
        console.log("isAuthenticated:", localStorage.getItem("isAuthenticated"));


        // Nettoyer l'URL pour enlever le paramètre 'code'
        window.history.replaceState({}, document.title, window.location.pathname);

        // Masquer la fenêtre de connexion et afficher le contenu restreint
        hideLoginModal();
    } else {
        // Vérifier si l'utilisateur est déjà connecté
        if (localStorage.getItem("isAuthenticated") === "true") {
            hideLoginModal();
        } else {
            showLoginModal();
        }
    }
});

// Fonction pour afficher la modale de connexion
function showLoginModal() {
    console.log("showLoginModal() a été appelée !");
    const modalElement = document.getElementById("login-modal");
    if (modalElement) {
        const loginModal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
        loginModal.show();
    } else {
        console.error("La modale de connexion n'a pas été trouvée !");
    }
}

// Fonction pour cacher la modale et afficher le contenu après connexion
function hideLoginModal() {
    const loginModal = document.getElementById("login-modal");
    if (loginModal) {
        loginModal.style.display = "none"; // Cache la fenêtre de connexion
        console.log("La fenêtre de connexion a été cachée !");
    }

    // Afficher le contenu restreint
    const restrictedContent = document.getElementById("restricted-content");
    console.log("Vérification de #restricted-content :", restrictedContent);
    
    if (restrictedContent) {
        restrictedContent.style.display = "block";
        console.log("Le contenu restreint a été affiché !");
    } else {
        console.error("Impossible d'afficher le contenu restreint !");
    }
}

function toggleProfileOrLogin() {
    if (isLoggedIn) {
        loadSection('user-profile'); // Afficher les informations utilisateur
    } else {
        showLoginModal();
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
        loadSection('home');
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

// Connexion avec l'API 42
// https://profile.intra.42.fr/oauth/applications

function connectWith42() {
    const clientId = "u-s4t2ud-d3bf68e1f05428e626baa356712fb0a64416bb1075f2c1ed941bb8be980d8e2e"; //client ID (intra 42)
    const redirectUri = encodeURIComponent("http://0.0.0.0:5500/dist/index.html"); // L'URL de redirection a changer avec le bon port
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=public`;

    window.location.href = authUrl;
}

//echanger le code d'autorisation contre jeton d acces (en front)
async function exchangeCodeForToken(authCode) {
    const clientId = "u-s4t2ud-d3bf68e1f05428e626baa356712fb0a64416bb1075f2c1ed941bb8be980d8e2e"; // Client ID
    const clientSecret = "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"; // Client Secret
    const redirectUri = "http://0.0.0.0:5500/dist/index.html"; // Doit être identique à celui utilisé pour la connexion

    const url = "https://api.intra.42.fr/oauth/token";

    const data = {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: authCode,
        redirect_uri: redirectUri
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.access_token) {
            console.log("Jeton d'accès reçu :", result.access_token);
            localStorage.setItem("accessToken", result.access_token);
            
            // Récupérer les infos de l'utilisateur
            getUserInfo(result.access_token);
        } else {
            console.error("Erreur lors de l'échange du code :", result);
        }
    } catch (error) {
        console.error("Erreur lors de la requête de token :", error);
    }
}

// Récupérer les infos de l'utilisateur
async function getUserInfo(accessToken) {
    const url = "https://api.intra.42.fr/v2/me";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userData = await response.json();
        console.log("Données de l'utilisateur :", userData);

        // Stocker les infos dans le localStorage (si nécessaire)
        localStorage.setItem("user", JSON.stringify(userData));

        // Rediriger vers l'accueil
        window.location.href = "index.html"; // Remplace avec ta vraie page d'accueil
    } catch (error) {
        console.error("Erreur lors de la récupération des infos utilisateur :", error);
    }
}


