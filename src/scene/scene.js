import * as THREE from 'three';
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { base } from '$app/paths';
import { getOBInteract, updateOBInteract, loadOogaBooga, animateOB, getCavemanCamMov, getMammothCamMov } from './oogaBooga';
import { animateSA, getStartAreaComplete, interactStartArea, loadStartingArea } from './startingArea';

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
/** @type {THREE.PerspectiveCamera} */
let camera;
/** @type {THREE.WebGLRenderer} */
let renderer;
let isMobile = false;
const degToRad = Math.PI / 180;

let playerOffset = new THREE.Vector3(0,0,0);
let dirLightOffset = new THREE.Vector3(100,100,100);
let cameraOffset = new THREE.Vector3(0,10,10);

// Camera panning
let isPanning = false;
let isInteracted = false;
let cameraTargetPos = new THREE.Vector3();
let startingPanPos = new THREE.Vector3();
let currentCameraOffset = cameraOffset.clone();
let startCameraOffset = cameraOffset.clone();

// Pathfinding 
const clock = new THREE.Clock();
const pathfinding = new Pathfinding();
const pathfindinghelper = new PathfindingHelper();
scene.add(pathfindinghelper)
const ZONE = 'level1';
/** @type {THREE.Vector3[]} */
let path;

//Movement Values
const startPos = new THREE.Vector3(0,0,6);
/** @type {THREE.Vector3} */
let currentPos = startPos;
/** @type {THREE.Vector3} */
let endPos;
const startRot = 90;
/** @type {Number} */
let currentRot = startRot;
/** @type {Number} */
let endRot;
/** @type {Number} */
let rotDir;
let currentIndex = 0;
let movSpeed = 5;
let rotSpeed = 200;
let isMoving = false;
const direction = new THREE.Vector3();
const temp = new THREE.Vector3();

// Player Model
/** @type {THREE.Object3D<THREE.Object3DEventMap>} */
let player;
// /** @type {THREE.Object3D<THREE.Object3DEventMap>} */
// let capsule;
/** @type {THREE.Object3D<THREE.Object3DEventMap>} */
let indicator;

let ambientLight;
/** @type {THREE.DirectionalLight} */
let dirLight;

export const interact = (/** @type {number} */ x, /** @type {number} */ y) => {
    if (isPanning) {
        return;
    }

    if (isInteracted) {
        isPanning = true;
        startingPanPos.copy(cameraTargetPos);
        startCameraOffset.copy(currentCameraOffset);

        if (getOBInteract() && isMobile) {
            cameraMovement(getMammothCamMov()[0], getMammothCamMov()[1]);
            updateOBInteract(false);
        } else {
            cameraMovement(currentPos.clone(), cameraOffset.clone());
        }
        
        return;
    }

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for(let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name.includes("Monument_") && getStartAreaComplete() && !isMoving) {
            cameraTargetPos.copy(currentPos);
            startingPanPos.copy(currentPos);
            isPanning = true;
            cameraMovement(new THREE.Vector3(0, 4, 0), cameraOffset.clone());
            break;
        }

        if (intersects[i].object.parent?.name.includes("Caveman")
            || intersects[i].object.parent?.name.includes("Mammoth")
            || intersects[i].object.name.includes("Stand") 
            && !isMoving) {
            cameraTargetPos.copy(currentPos);
            startingPanPos.copy(currentPos);
            isPanning = true;
            startCameraOffset = cameraOffset.clone();
            currentCameraOffset = cameraOffset.clone();
            if(isMobile) {
                cameraMovement(getCavemanCamMov()[0], getCavemanCamMov()[1]);
            } else {
                cameraMovement(new THREE.Vector3(20, 2, 40), new THREE.Vector3(0, 10, 15));
            }

            updateOBInteract(true);
            break;
        } 

        if (intersects[i].object.name.includes("Obelisk_")) {
            interactStartArea(intersects[i])
        }

        if(intersects[i].object.name == 'navmesh') {
            let b = intersects[i].point;

            const groupID = pathfinding.getGroup(ZONE, currentPos);
            const closest = pathfinding.getClosestNode(currentPos,ZONE,groupID);
            path = pathfinding.findPath(closest.centroid, b, ZONE, groupID);

            if (path) {
                isMoving = true;
                endPos = path[0];
                currentIndex = 0;

                direction.subVectors(endPos, currentPos);
                endRot = currentRot + rotateAngle();

                indicator.position.copy(b);
                indicator.visible = true;
                // pathfindinghelper.reset();
                // pathfindinghelper.setPlayerPosition(currentPos);
                // pathfindinghelper.setTargetPosition(b);
                // pathfindinghelper.setPath(path);
            } else {
                isMoving = false;
            }
        }
    }    
}

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    const delta = clock.getDelta();
    
    animateOB(delta);

    animateSA(delta);
    
    if(isMoving) {
        const rotationThisFrame = rotSpeed * delta;
        
        if (endRot != currentRot) {
            if (endRot * rotDir <= (currentRot + rotDir * rotationThisFrame) * rotDir) {
                currentRot = endRot;
            } else {
                currentRot = currentRot + rotDir * rotationThisFrame;
                player.rotation.y = currentRot * degToRad;
            }
            return;
        }

        const distanceThisFrame = movSpeed * delta;
        direction.subVectors(endPos, currentPos);
        const distanceToNext = direction.length();

        if (distanceToNext <= distanceThisFrame) {
            currentPos.copy(endPos)
            currentIndex++;

            if (currentIndex <= path.length - 1) {
                // Move to next position
                endPos.copy(path[currentIndex]);

                direction.subVectors(endPos, currentPos);
                endRot = currentRot + rotateAngle();
            } else {
                isMoving = false;
                currentIndex = 0;
                indicator.visible = false;
            }
        } else {
            direction.normalize();
            temp.copy(direction).multiplyScalar(distanceThisFrame);
            currentPos.add(temp);
        }

        player.position.copy(currentPos).add(playerOffset);
        camera.position.copy(currentPos).add(cameraOffset);
        camera.lookAt(currentPos);
    }
}

const rotateAngle = () => {
    const startRotVector = new THREE.Vector3(-Math.cos(currentRot * degToRad), 0, Math.sin(currentRot * degToRad))
    const normal = new THREE.Vector3(0, 1, 0);
    const cross = new THREE.Vector3().crossVectors(startRotVector, direction);
    rotDir = Math.sign(normal.dot(cross));

    return rotDir * startRotVector.angleTo(direction) * (1 / degToRad);
}

const cameraMovement = (/** @type {THREE.Vector3} */target, /** @type {THREE.Vector3} */targetOffset) => {
    let diff = new THREE.Vector3().subVectors(target, startingPanPos);
    cameraTargetPos.add(diff.divideScalar(50));

    let offsetDiff = new THREE.Vector3().subVectors(targetOffset, startCameraOffset);
    currentCameraOffset.add(offsetDiff.divideScalar(50));

    camera.position.copy(cameraTargetPos).add(currentCameraOffset);
    camera.lookAt(cameraTargetPos);

    if (cameraTargetPos.distanceTo(target) > 0.05) {
        setTimeout(() => {
            cameraMovement(target, targetOffset);
        }, 10);
    } else {
        isPanning = false;
        isInteracted = cameraTargetPos.distanceTo(currentPos) > 0.05
    }
}

export const resizeScene = (/** @type {number} */ newWidth, /** @type {number} */ newHeight, /** @type {boolean} */ isMob) => {
    isMobile = isMob;
    renderer.setSize(newWidth, newHeight, false);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
}

export const createScene = (/** @type {HTMLCanvasElement} */ el, /** @type {boolean} */ isMob) => {
    const fiveTone = new THREE.TextureLoader().load(`${base}/gradientMaps/fiveTone.jpg`);
    fiveTone.minFilter = THREE.NearestFilter;
    fiveTone.magFilter = THREE.NearestFilter;

    // const capsuleGeometry = new THREE.CapsuleGeometry( 0.5, 0.8, 10, 20);
    // const capsuleMaterial = new THREE.MeshToonMaterial({ color: 0x00ffff });
    // capsuleMaterial.gradientMap = fiveTone;
    // capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
    // scene.add(capsule)
    // capsule.position.set(startPos.x, startPos.y, startPos.z).add(playerOffset);
    // capsule.castShadow = true;

    const playerMaterial = new THREE.MeshToonMaterial({ color: 0x00ffff, gradientMap: fiveTone });

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera = new THREE.PerspectiveCamera(45, el.width / el.height, 0.2, 1000);
    camera.position.set(startPos.x, startPos.y, startPos.z).add(cameraOffset);
    camera.lookAt(currentPos);

    ambientLight = new THREE.AmbientLight( 0xffffff, 1.0 );
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    dirLight.position.copy(dirLightOffset);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    scene.add(dirLight);

    resizeScene(el.width, el.height, isMob);

    // Import model
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );

    loader.load(`${base}/models/Land.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        let navmesh;
        
        model.traverse((child) => {
            // @ts-ignore
            if(child.isMesh) {
                child.receiveShadow = true;
                if (child.name == "navmesh"){
                    navmesh = child;
                    // @ts-ignore
                    navmesh.visible = false;
                }
            }
        });

        //@ts-ignore
        pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh.geometry))
    });

    loader.load(`${base}/models/Robot.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        player = model;
        //dirLight.target = player;
        player.position.add(startPos);
        player.rotation.y = startRot * degToRad;

        model.traverse((child) => {
            // @ts-ignore
            if (child.isMesh) {
                // @ts-ignore
                child.material = playerMaterial;
            }
        })
    })

    loader.load(`${base}/models/Indicator.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        indicator = model;
        indicator.visible = false;
    });

    loadStartingArea(loader, scene);

    loadOogaBooga(loader, scene);

    animate();
}
