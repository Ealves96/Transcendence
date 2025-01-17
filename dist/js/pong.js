let scene, camera, renderer, paddles, ball;

//fonction qui initialise le jeu
function initPongGame() {
    console.log('Initialisation de initPongGame');
    
    const canvas = document.getElementById('pongCanvas');
    if (!canvas) {
        console.error('Canvas introuvable, initPongGame annulé.');
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Lumières
    addLights(scene);

    // Éléments de la scène
    const floor = addFloor(scene);
    paddles = addPaddles(scene);
    ball = addBall(scene);
    addWalls(scene);

    addNeonLines(scene);
    const neonAmbientLight = new THREE.HemisphereLight(0x3333ff, 0x000033, 0.5);
    scene.add(neonAmbientLight);

    // Caméra
    setupCamera(camera);

    // Gestion des mouvements
    setupPaddleMovement(paddles);
    setupBallMovement(ball, paddles, floor);

    console.log('Démarrage de l\'animation.');
    animate();
}

//animations
function animate() {
    requestAnimationFrame(animate);

    // **Mouvements des paddles**
    paddles.leftPaddle.position.z += paddles.leftPaddle.userData.speed;
    paddles.rightPaddle.position.z += paddles.rightPaddle.userData.speed;

    // Limites des paddles pour ne pas sortir du terrain
    const maxZ = 13; // Ajustez selon la taille de votre terrain
    const minZ = -13;
    paddles.leftPaddle.position.z = Math.max(minZ, Math.min(maxZ, paddles.leftPaddle.position.z));
    paddles.rightPaddle.position.z = Math.max(minZ, Math.min(maxZ, paddles.rightPaddle.position.z));

    // **Mouvements de la balle**
    ball.position.x += ball.userData.speed.x;
    ball.position.z += ball.userData.speed.y;

    // Collision avec les murs haut et bas (rebond vertical)
    if (ball.position.z >= 14 || ball.position.z <= -14) {
        ball.userData.speed.y *= -1; // Inverse la direction verticale
    }

    // Réinitialisation si la balle sort des limites (gauche/droite)
    if (ball.position.x >= 25 || ball.position.x <= -25) {
        ball.position.set(0, 0, 0); // Réinitialise la position
        ball.userData.speed = { x: 0.2, y: 0.1 }; // Réinitialise la vitesse
    }

    // **Collisions balle/paddles**
    const paddleWidth = 2;
    const paddleHeight = 10;

    // Collision avec la raquette gauche
    if (
        ball.position.x <= paddles.leftPaddle.position.x + paddleWidth &&
        ball.position.x >= paddles.leftPaddle.position.x - paddleWidth &&
        ball.position.z <= paddles.leftPaddle.position.z + paddleHeight / 2 &&
        ball.position.z >= paddles.leftPaddle.position.z - paddleHeight / 2
    ) {
        ball.userData.speed.x *= -1; // Inverse la direction horizontale
    }

    // Collision avec la raquette droite
    if (
        ball.position.x <= paddles.rightPaddle.position.x + paddleWidth &&
        ball.position.x >= paddles.rightPaddle.position.x - paddleWidth &&
        ball.position.z <= paddles.rightPaddle.position.z + paddleHeight / 2 &&
        ball.position.z >= paddles.rightPaddle.position.z - paddleHeight / 2
    ) {
        ball.userData.speed.x *= -1; // Inverse la direction horizontale
    }

    // **Rendu de la scène**
    renderer.render(scene, camera);
}

//fonction qui gere les lumieres
function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    console.log('Lumières ajoutées à la scène.');
}

//fonction qui gere le sol
function addFloor(scene) {
    const floorGeometry = new THREE.PlaneGeometry(50, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,         // Couleur noire
        roughness: 0.1,          // Faible rugosité pour les reflets
        metalness: 0.8,          // Haute métallisation
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);

    console.log('Sol ajouté à la scène.');
    return floor;
}

//fonction qui gere les paddles
function addPaddles(scene) {
    const paddleGeometry = new THREE.BoxGeometry(2, 2, 10);
    const paddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 2, 
        roughness: 0,
        metalness: 1,
    });

    const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    leftPaddle.position.set(-20, 0, 0);
    leftPaddle.castShadow = true;
    scene.add(leftPaddle);

    const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    rightPaddle.position.set(20, 0, 0);
    rightPaddle.castShadow = true;
    scene.add(rightPaddle);

    console.log('Raquettes ajoutées à la scène.');
    return { leftPaddle, rightPaddle };
}

//fonction qui gere la balle
function addBall(scene) {
    const ballGeometry = new THREE.SphereGeometry(2, 16, 16);
    const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2.5, // Effet néon plus intense
        roughness: 0,
        metalness: 1,
    });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), ballMaterial);
    ball.position.set(0, 0, 0);
    ball.castShadow = true;
    scene.add(ball);

    console.log('Balle ajoutée à la scène.');
    return ball;
}

//fonction qui gere la config de la camera
function setupCamera(camera) {
    camera.position.set(0, 15, 50);
    camera.lookAt(0, 0, 0);
    console.log('Caméra configurée.');
}

//fonction qui gere le mouvement des paddles
function setupPaddleMovement(paddles) {
    // Initialisation des vitesses des paddles
    paddles.leftPaddle.userData = { speed: 0 };
    paddles.rightPaddle.userData = { speed: 0 };

    // Gestion des événements de clavier
    document.addEventListener('keydown', (event) => {
        if (event.key === 's') paddles.leftPaddle.userData.speed = 0.5;
        if (event.key === 'w') paddles.leftPaddle.userData.speed = -0.5;
        if (event.key === '2') paddles.rightPaddle.userData.speed = 0.5;
        if (event.key === '5') paddles.rightPaddle.userData.speed = -0.5;
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'w' || event.key === 's') paddles.leftPaddle.userData.speed = 0;
        if (event.key === '5' || event.key === '2') paddles.rightPaddle.userData.speed = 0;
    });

    console.log('Mouvements des raquettes configurés.');
}

//fonction qui gere le mouvement de la balle
function setupBallMovement(ball, paddles, floor) {
    let ballSpeed = { x: 0.2, y: 0.1 };

    ball.userData = { speed: ballSpeed };

    // Vous pouvez ajouter des collisions et des rebonds ici...
    console.log('Mouvement de la balle configuré.');
}

function addNeonLines(scene) {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Ligne centrale
    const centerLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.01, 15),
        new THREE.Vector3(0, 0.01, -15),
    ]);
    const centerLine = new THREE.Line(centerLineGeometry, lineMaterial);
    scene.add(centerLine);

    // Bords du terrain
    const borderGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-25, 0.01, 15),
        new THREE.Vector3(25, 0.01, 15),
        new THREE.Vector3(25, 0.01, -15),
        new THREE.Vector3(-25, 0.01, -15),
        new THREE.Vector3(-25, 0.01, 15),
    ]);
    const borderLine = new THREE.Line(borderGeometry, lineMaterial);
    scene.add(borderLine);
}

function addWalls(scene) {
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,        // Couleur blanche
        emissive: 0xffffff,     // Lumière émise blanche
        emissiveIntensity: 1,   // Intensité de l'effet néon
        roughness: 0.3,         // Rugosité pour les reflets
        metalness: 0.8,         // Apparence métallique
    });

    // Mur gauche
    const leftWallGeometry = new THREE.BoxGeometry(60, 2, 0); // (épaisseur, hauteur, longueur)
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(0, 5, -25); // Positionner sur le côté gauche (x, y, z)
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    leftWall.position.y = -2;

    // Mur droit
    const rightWallGeometry = new THREE.BoxGeometry(36, 1, 0);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(0, 5, 25); // Positionner sur le côté droit
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    rightWall.position.y = 4.5;

    // Ajouter les murs à la scène
    scene.add(leftWall);
    scene.add(rightWall);

    console.log('Murs ajoutés à la scène.');
}
