import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

//fonction principale pong
function initPongGame() {
    console.log('Initialisation de initPongGame');
    
    const canvas = document.getElementById('pongCanvas');
    if (!canvas) {
        console.error('Canvas introuvable, initPongGame annulé.');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Lumières
    addLights(scene);

    // Éléments de la scène
    const floor = addFloor(scene);
    const paddles = addPaddles(scene);
    const ball = addBall(scene);

    // Caméra
    setupCamera(camera);

    // Gestion des mouvements
    setupPaddleMovement(paddles);
    setupBallMovement(ball, paddles, floor);

    // Configuration des effets de post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // Intensité du bloom
        0.4, // Rayon
        0.85 // Seuil
    );
    composer.addPass(bloomPass);

    // Animation avec composer
    function animate() {
        requestAnimationFrame(animate);
        composer.render(); // Utilisation du composer au lieu du renderer
    }
    animate();
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
        color: 0xffffff,       // Couleur de base
        emissive: 0xffffff,    // Couleur émise (blanche pour l'effet néon)
        emissiveIntensity: 1,  // Intensité de la lumière émise
        roughness: 0.2,        // Surface lisse
        metalness: 0.5,        // Apparence métallique
    });

    const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    leftPaddle.position.set(-20, 0, 0);
    leftPaddle.castShadow = true;
    scene.add(leftPaddle);

    const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    rightPaddle.position.set(20, 0, 0);
    rightPaddle.castShadow = true;
    scene.add(rightPaddle);

    const neonLightLeft = new THREE.PointLight(0x00ff00, 1, 50); // Lumière verte
    neonLightLeft.position.set(-20, 5, 0); // Position sur la raquette gauche
    scene.add(neonLightLeft);

    const neonLightRight = new THREE.PointLight(0xff0000, 1, 50); // Lumière rouge
    neonLightRight.position.set(20, 5, 0); // Position sur la raquette droite
    scene.add(neonLightRight);

    console.log('Raquettes ajoutées à la scène.');
    return { leftPaddle, rightPaddle };
}

//fonction qui gere la balle
function addBall(scene) {
    const ballGeometry = new THREE.SphereGeometry(2, 16, 16);
    const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.9,
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
    let leftPaddleSpeed = 0;
    let rightPaddleSpeed = 0;

    document.addEventListener('keydown', (event) => {
        if (event.key === 'w') leftPaddleSpeed = 0.5;
        if (event.key === 's') leftPaddleSpeed = -0.5;
        if (event.key === 'ArrowUp') rightPaddleSpeed = 0.5;
        if (event.key === 'ArrowDown') rightPaddleSpeed = -0.5;
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'w' || event.key === 's') leftPaddleSpeed = 0;
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') rightPaddleSpeed = 0;
    });

    paddles.leftPaddle.userData.speed = leftPaddleSpeed;
    paddles.rightPaddle.userData.speed = rightPaddleSpeed;

    console.log('Mouvements des raquettes configurés.');
}

//fonction qui gere le mouvement de la balle
function setupBallMovement(ball, paddles, floor) {
    let ballSpeed = { x: 0.2, y: 0.1 };

    ball.userData = { speed: ballSpeed };

    // Vous pouvez ajouter des collisions et des rebonds ici...
    console.log('Mouvement de la balle configuré.');
}
