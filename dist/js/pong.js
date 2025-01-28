let scene, camera, renderer, paddles, ball;
let scores = { player1: 0, player2: 0 }; // Scores des deux joueurs
let isGamePaused = false; // État d'arrêt du jeu

function initPongGame() {
    console.log("Initialisation du Pong Game");

    const canvas = document.getElementById("pongCanvas");
    if (!canvas) {
        console.error("Canvas introuvable. Annulation de l'initialisation.");
        return;
    }

    // Scène
    scene = new THREE.Scene();

    // Caméra légèrement inclinée
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 25, 190); // Ajustement pour une vue plus horizontale
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Lumières
    addLights(scene);

    // Terrain et éléments
    addFloor(scene);
    paddles = addPaddles(scene);
    ball = addBall(scene);
    addWalls(scene);
    addNeonLines(scene);

    // Initialiser le tableau des scores
    updateScoreBoard();

    // Configuration des mouvements
    setupPaddleMovement(paddles);
    setupBallMovement(ball);

    console.log("Démarrage de l'animation...");
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Mise à jour des raquettes et de la balle
    updatePaddlePositions();
    updateBallPosition();

    // Rendu de la scène
    renderer.render(scene, camera);
}

// Lumières
function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 100, 50);
    directionalLight.castShadow = true; //active les ombres
    directionalLight.shadow.mapSize.width = 1024; // Résolution des ombres
    directionalLight.shadow.mapSize.height = 1024;// ++
    directionalLight.shadow.camera.near = 0.5;//++
    directionalLight.shadow.camera.far = 500;//++
    scene.add(directionalLight);
}

// Terrain (prolongé pour un effet de profondeur)
function addFloor(scene) {
    // const textureLoader = new THREE.TextureLoader();

    // Charge une texture bleu foncé
	// const floorTexture = textureLoader.load('./img/fond_bleu.jpg');
	// floorTexture.wrapS = THREE.RepeatWrapping;
	// floorTexture.wrapT = THREE.RepeatWrapping;
	// floorTexture.repeat.set(10, 10); // Répétition pour l'effet de profondeur

	const floorMaterial = new THREE.MeshStandardMaterial({
		// map: floorTexture, // Applique la texture
        color: new THREE.Color("rgb(15, 7, 59)"),
		emissive: new THREE.Color("rgb(3, 3, 3)"), // Bleu foncé pour l'émission
		emissiveIntensity: 1.0, // Intensité d'émission
		transparent: true,
		opacity: 0.8,
	});

	const floorGeometry = new THREE.PlaneGeometry(80, 200);
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2.3; // Place le sol à plat
	floor.position.y = 15; // Position légèrement en dessous
	floor.receiveShadow = true; // Active la réception des ombres
	scene.add(floor);
}


// Raquettes
function addPaddles(scene) {
    const paddleGeometry = new THREE.BoxGeometry(20, 3, 3);
    const paddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
    });

    const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    leftPaddle.position.set(0, 0, 110); // Joueur proche
    leftPaddle.castShadow = true;
    scene.add(leftPaddle);

    const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    rightPaddle.position.set(0, 0, -110); // Adversaire éloigné
    rightPaddle.castShadow = true;
    scene.add(rightPaddle);

    return { leftPaddle, rightPaddle };
}

// Balle (part vers l'adversaire)
function addBall(scene) {
    const ballGeometry = new THREE.SphereGeometry(2, 16, 16);
    const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2,
    });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0, 0);
    ball.castShadow = true;
    scene.add(ball);

    // Direction initiale aléatoire (toujours vers l'adversaire)
    ball.userData = {
        speed: {
            x: (Math.random() > 0.5 ? 0.5 : -0.5), // Aléatoire à gauche/droite
            z: (Math.random() > 0.5 ? 0.7 : -0.7), // Toujours vers l'adversaire
        },
    };
    return ball;
}

// Murs (gauche et droit)
function addWalls(scene) {
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff, // Bleu néon
        emissive: 0x00ffff, // Lumière émise par l'objet
        emissiveIntensity: 2.0, // Intensité LED
        metalness: 1.0, // Métallique pour refléter la lumière
        roughness: 0.1, // Surface lisse
    });

    // Dimensions du terrain
    const terrainLength = 2; // Longueur du terrain (Z)
    const wallThickness = 2; // Épaisseur des murs
    const wallHeight = 198; // Hauteur des murs (doit être bien visible)

    // Mur gauche (le long du terrain, axe Z)
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, wallHeight, terrainLength), // Épaisseur, Hauteur, Longueur
        wallMaterial
    );
    leftWall.position.set(-42, 15, 0); // Positionné sur le bord gauche
    leftWall.rotation.x = -Math.PI / 2.3; // Suivre l'angle du terrain
    scene.add(leftWall);

    // Mur droit (le long du terrain, axe Z)
    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, wallHeight, terrainLength),
        wallMaterial
    );
    rightWall.position.set(42, 15, 0); // Positionné sur le bord droit
    rightWall.rotation.x = -Math.PI / 2.3; // Suivre l'angle du terrain
    scene.add(rightWall);
}






// Lignes du terrain
function addNeonLines(scene) {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });

    // Ligne centrale
    const centerLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-40, -2, 0),
        new THREE.Vector3(40, -2, 0),
    ]);
    const centerLine = new THREE.Line(centerLineGeometry, lineMaterial);
    scene.add(centerLine);

    // Bordures du terrain haut et bas
    const borderGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-40, -2, 115),
        new THREE.Vector3(40, -2, 115),
        new THREE.Vector3(40, -2, -115),
        new THREE.Vector3(-40, -2, -115),
        new THREE.Vector3(-40, -2, 115),
    ]);
    const borderLine = new THREE.Line(borderGeometry, lineMaterial);
    scene.add(borderLine);
}

// Mouvement des raquettes
function setupPaddleMovement(paddles) {
    paddles.leftPaddle.userData = { speed: 0 };
    paddles.rightPaddle.userData = { speed: 0 };

    document.addEventListener("keydown", (event) => {
        if (event.key === "a") paddles.leftPaddle.userData.speed = -0.8;
        if (event.key === "d") paddles.leftPaddle.userData.speed = 0.8;
        if (event.key === 'ArrowLeft') paddles.rightPaddle.userData.speed = -0.8;
        if (event.key === 'ArrowRight') paddles.rightPaddle.userData.speed = 0.8;
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "a" || event.key === "d") paddles.leftPaddle.userData.speed = 0;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') paddles.rightPaddle.userData.speed = 0;
    });
}

// Mouvement de la balle
function setupBallMovement(ball) {
    ball.userData.speed = {
        x: (Math.random() > 0.5 ? 0.6 : -0.6),
        z: (Math.random() > 0.5 ? 0.8 : -0.8),
    };
}

// Fonction pour limiter la vitesse de la balle
function limitBallSpeed(ball) {
    const maxSpeed = 1.2; // Vitesse maximale autorisée
    ball.userData.speed.x = Math.max(-maxSpeed, Math.min(maxSpeed, ball.userData.speed.x));
    ball.userData.speed.z = Math.max(-maxSpeed, Math.min(maxSpeed, ball.userData.speed.z));
}


function updatePaddlePositions() {
    paddles.leftPaddle.position.x += paddles.leftPaddle.userData.speed;
    paddles.rightPaddle.position.x += paddles.rightPaddle.userData.speed;

    const limitX = 26; // Limites des raquettes
    paddles.leftPaddle.position.x = Math.max(-limitX, Math.min(limitX, paddles.leftPaddle.position.x));
    paddles.rightPaddle.position.x = Math.max(-limitX, Math.min(limitX, paddles.rightPaddle.position.x));
}

function updateBallPosition() {
    ball.position.x += ball.userData.speed.x;
    ball.position.z += ball.userData.speed.z;

    // Collision avec les murs gauche et droite
    if (ball.position.x > 35 || ball.position.x < -35) {
        ball.userData.speed.x *= -1; // Inversion de la direction horizontale
    }

    //POUR COMPTER LES POINTS SE SERVIR DE CA
    // Collision avec les murs haut et bas (si nécessaire)
    // if (ball.position.z > 50 || ball.position.z < -50) {
    //     ball.userData.speed.z *= -1; // Inversion de la direction verticale
    // }

    // Collision avec la raquette du joueur
    if (
        ball.position.z > paddles.leftPaddle.position.z - 2 &&
        ball.position.z < paddles.leftPaddle.position.z + 1 &&
        ball.position.x >= paddles.leftPaddle.position.x - 10 &&
        ball.position.x <= paddles.leftPaddle.position.x + 10
    ) {
        ball.userData.speed.z *= -1; // Rebond sur la raquette
        ball.userData.speed.x += (ball.position.x - paddles.leftPaddle.position.x) * 0.1; // Angle
        limitBallSpeed(ball); // Limite la vitesse après le rebond
        return;
    }

    // Collision avec la raquette de l'adversaire
    if (
        ball.position.z > paddles.rightPaddle.position.z - 2 &&
        ball.position.z < paddles.rightPaddle.position.z + 1 &&
        ball.position.x >= paddles.rightPaddle.position.x - 10 &&
        ball.position.x <= paddles.rightPaddle.position.x + 10
    ) {
        ball.userData.speed.z *= -1; // Rebond sur la raquette
        ball.userData.speed.x += (ball.position.x - paddles.rightPaddle.position.x) * 0.1; // Angle
        limitBallSpeed(ball); // Limite la vitesse après le rebond
        return;
    }

    // Gestion des angles (collision combinée avec la raquette et le mur)
    if (
        (ball.position.x >= 40 || ball.position.x <= -40) && // Mur gauche/droite
        ((ball.position.z > paddles.leftPaddle.position.z - 1 &&
            ball.position.z < paddles.leftPaddle.position.z + 1) ||
            (ball.position.z > paddles.rightPaddle.position.z - 1 &&
            ball.position.z < paddles.rightPaddle.position.z + 1))
    ) {
        ball.userData.speed.z *= -1; // Rebond sur la raquette
        ball.userData.speed.x *= -1; // Rebond sur le mur en simultané
        limitBallSpeed(ball); // Limite la vitesse après le rebond
    }

    // Réinitialisation si la balle dépasse les limites
    if (ball.position.z > 126) { // La balle passe derrière le joueur 1
        scores.player2 += 1; // Point pour le joueur 2
        updateScoreBoard();
        checkForWinner();
        resetBall('player2');
        return;
    }

    if (ball.position.z < -126) { // La balle passe derrière le joueur 2
        scores.player1 += 1; // Point pour le joueur 1
        updateScoreBoard();
        checkForWinner();
        resetBall('player1');
        return;
    }
}

function resetBall(lastScorer) {
    isGamePaused = true; // Met le jeu en pause
   
    // Centre les paddles
    paddles.leftPaddle.position.set(0, 0, 115);
    paddles.rightPaddle.position.set(0, 0, -100);

    // Positionne la balle devant le paddle adverse
    ball.position.set(0, 0, lastScorer === 'player1' ? -90 : 110);
    ball.userData.speed = { x: 0, z: 0 }; // Stoppe la balle

    document.addEventListener('keydown', function handleSpace(event) {
        if (event.code === 'Space') {
            setupBallMovement(ball); // Relance la balle
            isGamePaused = false;
            document.removeEventListener('keydown', handleSpace); // Supprime l'écouteur
        }
    });
}

function resetGame() {
    scores = { player1: 0, player2: 0 }; // Réinitialise les scores
    resetBall('player1'); // Place la balle pour le joueur 1
}

function checkForWinner() {
    if (scores.player1 >= 5) {
        alert("Le joueur 1 a gagné !");
        resetGame();
    } else if (scores.player2 >= 5) {
        alert("Le joueur 2 a gagné !");
        resetGame();
    }
}

function updateScoreBoard() {
    const scoreBoard = document.getElementById('scoreBoard');
    scoreBoard.innerText = `Joueur 1: ${scores.player1} - ${scores.player2} : Joueur 2`;
}
