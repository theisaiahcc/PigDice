import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import die_1 from '../img/die_1.gif';
import die_2 from '../img/die_2.gif';
import die_3 from '../img/die_3.gif';
import die_4 from '../img/die_4.gif';
import die_5 from '../img/die_5.gif';
import die_6 from '../img/die_6.gif';

const velocities = [
    [-6.405424942929163, 6.52107106067988, 7.603509163831401],
    [-6.022533294073957, 9.242482810727601, 8.420019900577607],
    [-5.89924277116199, 1.8037447510034865, 7.075632866667547],
    [-6.274884683595103, 3.3118425339657787, 5.092390134058078],
    [-7.024207728586751, 6.822340656954655, 6.335619386630826],
    [-3.021195389208964, 9.716700100778517, 2.2343773248488707],
    [-9.733246896618278, 7.279486854628727, 1.5389602076275466],
    [-6.939611709372535, 9.017052371455796, 4.1775002959336405],
    [-3.7840730333144568, 3.914179043927064, 6.47696331674215],
    [-3.9779950557724586, 4.1860986484788265, 6.225891791367699],
    [-9.070451584689053, 2.7996703914477195, 5.041990496912407],
    [-0.9280793665428333, 6.5836226952559285, 1.1850710265213138]
]

const renderer = new THREE.WebGLRenderer();

function diceRoll(roll) {

    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    game = get("game");

    game.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // const orbit = new OrbitControls(camera, renderer.domElement);
    // orbit.update();

    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
    //test cam
    // camera.position.set(5, 40, 10);
    // camera.rotation.set(30, 0, 0);
    //cool cam
    camera.position.set(0, 20, 20);
    camera.rotation.set(30.5, 0, 0);

    const dieTexture_1 = new THREE.TextureLoader().load(die_1);
    const dieTexture_2 = new THREE.TextureLoader().load(die_2);
    const dieTexture_3 = new THREE.TextureLoader().load(die_3);
    const dieTexture_4 = new THREE.TextureLoader().load(die_4);
    const dieTexture_5 = new THREE.TextureLoader().load(die_5);
    const dieTexture_6 = new THREE.TextureLoader().load(die_6);

    const dieTexture = [
        new THREE.MeshStandardMaterial({ map: dieTexture_1 }),
        new THREE.MeshStandardMaterial({ map: dieTexture_6 }),
        new THREE.MeshStandardMaterial({ map: dieTexture_3 }),
        new THREE.MeshStandardMaterial({ map: dieTexture_4 }),
        new THREE.MeshStandardMaterial({ map: dieTexture_5 }),
        new THREE.MeshStandardMaterial({ map: dieTexture_2 })
    ];


    const box = createDiceBox(dieTexture);
    scene.add(box);
    // box.position.set(0, 5, 0);
    // box.rotation.set(63, 20, 5);
    box.castShadow = true;

    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFFF,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.receiveShadow = true;

    // add a sphere
    const sphereGeo = new THREE.SphereGeometry(2);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    const ambientLight = new THREE.AmbientLight(0x33333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFFFF, 0.8);
    scene.add(directionalLight);
    directionalLight.castShadow = true;

    directionalLight.position.set(-30, 50, 00);
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;

    // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(dLightShadowHelper);

    const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.8, 0)
    });

    // ground body
    const groundBody = new CANNON.Body({
        shape: new CANNON.Plane(),
        //mass: 10
        type: CANNON.Body.STATIC
    });

    world.addBody(groundBody);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    const boxBody = createBoxBody();

    world.addBody(boxBody);

    side = roll * 2 - (generateNum(2) - 1) - 1;

    let x = velocities[side][0];
    let y = velocities[side][1];
    let z = velocities[side][2];
    boxBody.angularVelocity.set(x, y, z);
    console.log(x, y, z);
    boxBody.velocity.set(0, 0, -5);
    // boxBody.velocity.set(0, 0, -1 * (4 + getRandomDec(2)));
    // boxBody.quaternion.setFromEuler(getRandomDec(Math.PI*2) - Math.PI, getRandomDec(Math.PI*2) - Math.PI, getRandomDec(Math.PI*2) - Math.PI);
    // boxBody.linearDamping = 0.1;

    const sphereBody = new CANNON.Body({
        mass: 3,
        shape: new CANNON.Sphere(2),
        position: new CANNON.Vec3(-30, 10, 30),
        // type: CANNON.Body.STATIC
    });
    world.addBody(sphereBody);

    const timeStep = 1 / 60;

    function animate() {
        world.step(timeStep);

        plane.position.copy(groundBody.position);
        plane.quaternion.copy(groundBody.quaternion);

        box.position.copy(boxBody.position);
        box.quaternion.copy(boxBody.quaternion);

        sphere.position.copy(sphereBody.position);
        sphere.quaternion.copy(sphereBody.quaternion);

        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
}

function createDiceBox(dieTexture) {
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = dieTexture;
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    return box;
}

function createBoxBody() {
    return new CANNON.Body({
        mass: 3,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
        position: new CANNON.Vec3(0, 15, 15),
    });
}

function getRandomDec(max) {
        return Math.random() * max;
    }

var total = 0;

function rollDice() {
    get("dice").classList.remove("red");
    get("dice").value = "";
    
    var num = generateNum(6);
    diceRoll(num);
    setTimeout(function(){
        get("dice").value = "" + num;
        if (num == 1) {
            get("dice").classList.add("red");
            nextTurn();
        }
        else {
            total += num;
            displayTotal();
        }
    }, 2000)
}

function generateNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

function passTurn() {
    var playerOne = get("player-one");
    if (playerOne.classList.contains("active")) {
        var currScore = parseInt(get("score-one").innerText);
        currScore += total;
        get("score-one").innerText = "" + currScore;
        if (scoreWins(currScore)) {
            get("message").innerText = "Player 1 wins!";
        }
        else {
            nextTurn();
        }
    }
    else {
        var currScore = parseInt(get("score-two").innerText);
        currScore += total;
        get("score-two").innerText = "" + currScore;
        if (scoreWins(currScore)) {
            get("message").innerText = "Player 2 wins!";
        }
        else {
            nextTurn();
        }
    }
}
function nextTurn() {
    if (nextTurn.caller != passTurn) {
        get("message").innerText = "You rolled a one. Switching players...";
    }
    else {
        get("message").innerText = "Switching players...";
    }
    get("new-game").disabled = true;
    get("roll").disabled = true;
    get("pass").disabled = true;
    setTimeout(changePlayers, 1150);
    function changePlayers() {
        var playerOne = get("player-one");
        var playerTwo = get("player-two");
        if (playerOne.classList.contains("active")) {
            playerOne.classList.remove("active");
            playerTwo.classList.add("active");
        }
        else {
            playerTwo.classList.remove("active");
            playerOne.classList.add("active");
        }
        total = 0;
        displayTotal();
        get("message").innerText = "";
        setTimeout(function () {
            get("new-game").disabled = false;
            get("roll").disabled = false;
            get("pass").disabled = false;
        }, 300);
    }
}
function get(id) {
    return document.getElementById(id);
}
window.onload = function () {
    get("roll").onclick = rollDice;
    get("pass").onclick = passTurn;
    get("new-game").onclick = newGame;
};
function displayTotal() {
    get("total").innerText = "" + total;
}
function newGame() {
    var playerOne = get("player-one");
    var playerTwo = get("player-two");
    playerTwo.classList.remove("active");
    playerOne.classList.add("active");
    get("score-one").innerText = "0";
    get("score-two").innerText = "0";
    total = 0;
    displayTotal();
    get("message").innerText = "";
}
function scoreWins(n) {
    return n > 100;
}
