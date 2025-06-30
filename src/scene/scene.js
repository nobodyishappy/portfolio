import * as THREE from 'three';
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

const raycaster = new THREE.Raycaster();

const boxGeometry = new THREE.BoxGeometry(10,10,0.1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(0.1);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere)

const circleGeometry = new THREE.CircleGeometry(10);
const circleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
// scene.add(circle);

const ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add(ambientLight);

// Pathfinding 
const clock = new THREE.Clock();
const pathfinding = new Pathfinding();
const pathfindinghelper = new PathfindingHelper();
scene.add(pathfindinghelper)
const ZONE = 'level1';
/** @type {THREE.Vector3[]} */
let path;
/** @type {THREE.Vector3} */
let currentPos;
/** @type {THREE.Vector3} */
let endPos;
let currentIndex = 0;
let speed = 5;
let isMoving = false;
const direction = new THREE.Vector3();
const temp = new THREE.Vector3();


/** @type {THREE.PerspectiveCamera} */
let camera;
let cameraOffset = new THREE.Vector3(0,3,1.5);
/** @type {THREE.WebGLRenderer} */
let renderer;

export const interact = (/** @type {number} */ x, /** @type {number} */ y) => {
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(scene.children);

    let b = intersects[0].point;

    const groupID = pathfinding.getGroup(ZONE, sphere.position);
    path = pathfinding.findPath(sphere.position, b, ZONE, groupID);

    console.log(path)

    if (path) {
        isMoving = true;
        currentPos = sphere.position;
        endPos = path[0]
        // pathfindinghelper.reset();
        // pathfindinghelper.setPlayerPosition(sphere.position);
        // pathfindinghelper.setTargetPosition(b);
        // pathfindinghelper.setPath(path)
    }
}

const animate = () => {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    const delta = clock.getDelta();
    
    if(isMoving) {
        const distanceThisFrame = speed * delta;

        direction.subVectors(endPos, currentPos);
        const distanceToNext = direction.length();

        if (distanceToNext <= distanceThisFrame) {
            currentPos.copy(endPos)
            currentIndex++;

            if (currentIndex <= path.length - 1) {
                endPos.copy(path[currentIndex]);
            } else {
                isMoving = false;
                currentIndex = 0;
            }
        } else {
            direction.normalize();
            temp.copy(direction).multiplyScalar(distanceThisFrame);
            currentPos.add(temp);
        }

        sphere.position.copy(currentPos);
        camera.position.copy(currentPos).add(cameraOffset);
        camera.lookAt(sphere.position);
    }
}

export const resizeScene = (/** @type {number} */ newWidth, /** @type {number} */ newHeight) => {
    renderer.setSize(newWidth, newHeight, false);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
}

export const createScene = (/** @type {HTMLCanvasElement} */ el) => {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el});
    camera = new THREE.PerspectiveCamera(75, el.width / el.height, 0.2, 1000);
    camera.position.add(cameraOffset);
    camera.lookAt(sphere.position);

    resizeScene(el.width, el.height);
    animate();

    // Import model
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );

    loader.load('/models/Test.glb', (gltf) => {
        scene.add(gltf.scene);
        let navmesh = gltf.scene.children[0];
        //@ts-ignore
        pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh.geometry))
    })
}
