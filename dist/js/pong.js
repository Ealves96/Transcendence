let scene, camera, renderer, paddles, ball;
let scores = { player1: 0, player2: 0 }; // Scores des deux joueurs
let isGamePaused = false; // État d'arrêt du jeu
let lastScorer = null; // Dernier joueur à avoir marqué

function initPongGame() {
    console.log("Initialisation du Pong Game");

    const canvas = document.getElementById("pongCanvas");
    if (!canvas) {
        console.error("Canvas introuvable. Annulation de l'initialisation.");
        return;
    }

    resizeCanvas();

    // Scène
    scene = new THREE.Scene();

    // Caméra légèrement inclinée
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 2000);
    camera.position.set(0, 25, 190); // Ajustement pour une vue plus horizontale
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize(canvas.width, canvas.height);
    // renderer.setSize(window.innerWidth, window.innerHeight);
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

	const floorMaterial = new THREE.MeshStandardMaterial({
		// map: floorTexture, // Applique la texture
        color: new THREE.Color("0x00ffff"),
		emissive: new THREE.Color("0x00ffff"), // Bleu foncé pour l'émission
		emissiveIntensity: 1.0, // Intensité d'émission
		transparent: true,
		opacity: 0.8,
	});

	const floorGeometry = new THREE.BoxGeometry(80, 200, 10);
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2.3; // Place le sol à plat
	floor.position.y = 10; // Position légèrement en dessous
	floor.receiveShadow = true; // Active la réception des ombres
	scene.add(floor);
}

//canvas s adapte dynamiquement a la taille de l ecran
function resizeCanvas() {
    const canvas = document.getElementById("pongCanvas");
    if (!canvas) {
        console.error("Erreur : Aucun élément #pongCanvas trouvé !");
        return;
    }

    // Utilise les dimensions HTML et non celles de la fenêtre
    canvas.width = canvas.getAttribute("width");
    canvas.height = canvas.getAttribute("height");

    console.log(`Canvas redimensionné : ${canvas.width}x${canvas.height}`);
}

// Redimensionner au chargement et lors du redimensionnement de la fenêtre
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Appelle une première fois la fonction pour ajuster le canvas au démarrage

// Raquettes
function addPaddles(scene) {
    const paddleGeometry = new THREE.BoxGeometry(20, 4, 4);
    const paddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x00008b,
        emissive: 0x00008b,
        emissiveIntensity: 1.5,
    });

    const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    leftPaddle.position.set(0, 0, 110); // Joueur proche
    leftPaddle.castShadow = true;
    scene.add(leftPaddle);

    const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    rightPaddle.position.set(0, 40, -110); // Adversaire éloigné
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

// Murs gauche et droite
function addWalls(scene) {
    const neonColor = new THREE.Color("rgba(2, 2, 2)");
    const emissiveColor = new THREE.Color("0x00ffff"); // Lumière émise

    // Matériau principal des murs (LED brillants)
    const wallMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff, // Bleu néon
        emissive: emissiveColor, // Lumière émise
        emissiveIntensity: 5.0, // Très intense
        transparent: true,
        opacity: 0.9, // Un peu de transparence pour effet LED
    });

    // Effet de lumière diffusée autour des murs
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color("0x00ffff"), // Bleu néon
        transparent: true,
        opacity: 0.5, // Transparence pour effet "halo"
    });

    // Dimensions du terrain
    const terrainLength = 35; // Hauteur des murs
    const wallThickness = 5; // Épaisseur des murs
    const wallHeight = 198; // Profondeur du terrain (Z)

    // Création des murs
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, wallHeight, terrainLength),
        wallMaterial
    );
    leftWall.position.set(-42, 10, 0);
    leftWall.rotation.x = -Math.PI / 2.3; // Suivre l'angle du terrain
    scene.add(leftWall);

    // Mur droit
    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, wallHeight, terrainLength),
        wallMaterial
    );
    rightWall.position.set(42, 10, 0);
    rightWall.rotation.x = -Math.PI / 2.3;
    scene.add(rightWall);

    // Ajouter un effet de "halo" lumineux en dupliquant les murs avec une transparence
    const leftGlow = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness * 1.2, wallHeight * 1, terrainLength * 1),
        glowMaterial
    );
    leftGlow.position.set(-42, 12, 0);
    leftGlow.rotation.x = -Math.PI / 2.3;
    scene.add(leftGlow);

    const rightGlow = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness * 1.2, wallHeight * 1, terrainLength * 1),
        glowMaterial
    );
    rightGlow.position.set(42, 12, 0);
    rightGlow.rotation.x = -Math.PI / 2.3;
    scene.add(rightGlow);

    console.log("Murs LED ajoutés avec effet lumineux.");
}

// Ligne centrale du terrain
function addNeonLines(scene) {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });

    const floorWidth = 80;
    const floorY = 12;
    const floorZ = 22; 

    const centerLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(floorWidth / 2, floorY, floorZ),
        new THREE.Vector3(-floorWidth / 2, floorY, floorZ),
    ]);
    const centerLine = new THREE.Line(centerLineGeometry, lineMaterial);
    scene.add(centerLine);

    console.log("Ligne centrale corrigée et parfaitement centrée !");
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
function setupBallMovement(ball, lastScorer) {
    ball.userData.speed = {
        x: 0, // Pas de mouvement horizontal initial
        z: lastScorer === 'player1' ? -2 : 2, // Part vers le paddle adverse
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

    // ✅ Fixation de la hauteur Y pour éviter que la balle ne descende
    if (lastScorer !== null) {
        ball.position.y = lastScorer === 'player1' ? 39 : 5; // Hauteur correcte
    }

    // Collision avec les murs gauche et droite
    if (ball.position.x > 35 || ball.position.x < -35) {
        ball.userData.speed.x *= -1; // Inversion de la direction horizontale
    }

    // ✅ Vérifier les rebonds contre les raquettes
    if (
        ball.position.z > paddles.leftPaddle.position.z - 2 &&
        ball.position.z < paddles.leftPaddle.position.z + 1 &&
        ball.position.x >= paddles.leftPaddle.position.x - 10 &&
        ball.position.x <= paddles.leftPaddle.position.x + 10
    ) {
        ball.userData.speed.z *= -1;
        ball.userData.speed.x += (ball.position.x - paddles.leftPaddle.position.x) * 0.1;
        ball.position.y = 5;
        limitBallSpeed(ball);
    }

    if (
        ball.position.z > paddles.rightPaddle.position.z - 2 &&
        ball.position.z < paddles.rightPaddle.position.z + 1 &&
        ball.position.x >= paddles.rightPaddle.position.x - 10 &&
        ball.position.x <= paddles.rightPaddle.position.x + 10
    ) {
        ball.userData.speed.z *= -1;
        ball.userData.speed.x += (ball.position.x - paddles.rightPaddle.position.x) * 0.1;
        ball.position.y = 39;
        limitBallSpeed(ball);
    }

    // ✅ Vérifier les limites pour reset
    if (ball.position.z > 126) { 
        scores.player2 += 1;
        lastScorer = 'player2'; // ✅ Stocke qui a marqué en dernier
        updateScoreBoard();
        checkForWinner();
        resetBall('player2');
        return;
    }

    if (ball.position.z < -126) { 
        scores.player1 += 1;
        lastScorer = 'player1'; // ✅ Stocke qui a marqué en dernier
        updateScoreBoard();
        checkForWinner();
        resetBall('player1');
        return;
    }
}

function resetBall(lastScorer) {
    isGamePaused = true; // Met le jeu en pause

    //Centre les paddles
    paddles.leftPaddle.position.set(0, 0, 115);
    paddles.rightPaddle.position.set(0, 40, -100);

    //Correction : Vérifie que lastScorer est bien défini
    if (!lastScorer) {
        lastScorer = 'player1'; // Par défaut, le premier joueur
    }

    //Positionne la balle devant le paddle adverse à la bonne hauteur
    ball.position.set(0, lastScorer === 'player1' ? 39 : 5, lastScorer === 'player1' ? -90 : 110);
    
    ball.userData.speed = { x: 0, z: 0 }; // Stoppe la balle

    document.addEventListener('keydown', function handleSpace(event) {
        if (event.code === 'Space') {
            setupBallMovement(ball, lastScorer); // Relance la balle avec un bon angle
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

