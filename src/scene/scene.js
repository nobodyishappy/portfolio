import * as THREE from 'three';
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { base } from '$app/paths';
import { getMammothCamMov, animateMammoth, mammothInteract, loadMammoth } from './mammoth';
import { animateSA, getStartAreaComplete, interactStartArea, loadStartingArea } from './startingArea';
import { animateCaveman, getCavemanCamMov, loadCaveman, cavemanInteract } from './caveman';

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
/** @type {THREE.PerspectiveCamera} */
let camera;
/** @type {THREE.WebGLRenderer} */
let renderer;
let isMobile = false;
let interactDisabled = true;
const degToRad = Math.PI / 180;

let playerOffset = new THREE.Vector3(0,0,0);
let dirLightOffset = new THREE.Vector3(100,100,100);
let cameraOffset = new THREE.Vector3(0,2,0);

// Pathfinding 
const clock = new THREE.Clock();
const pathfinding = new Pathfinding();
const pathfindinghelper = new PathfindingHelper();
scene.add(pathfindinghelper)
const ZONE = 'level1';
/** @type {THREE.Vector3[]} */
let path;

//Movement Values
const startPos = new THREE.Vector3(0, 0, 10);
/** @type {THREE.Vector3} */
let currentPos = startPos.clone();
/** @type {THREE.Vector3} */
let endPos;
const startRot = 270;
/** @type {Number} */
let currentRot = startRot;
/** @type {Number} */
let endRot;
/** @type {Number} */
let rotDir;
let currentIndex = 0;
let movSpeed = 10;
let rotSpeed = 100;
let isMoving = false;
const direction = new THREE.Vector3();
const temp = new THREE.Vector3();

// Camera panning
let isPanning = false;
let isInteracted = false;
let currentPlayerLook = cameraOffset.clone().add(new THREE.Vector3(-Math.cos(currentRot * degToRad), 0, Math.sin(currentRot * degToRad)));
let cameraTargetPos = currentPos.clone().add(currentPlayerLook);
let startingPanPos = currentPos.clone().add(currentPlayerLook);
let currentCameraOffset = currentPos.clone().add(cameraOffset);
let startCameraOffset = currentPos.clone().add(cameraOffset);

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
    if (isPanning || interactDisabled) {
        return;
    }

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (isInteracted) {
        panToChar()
        
        return;
    }

    for(let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name.includes("Monument_") && getStartAreaComplete() && !isMoving) {
            cameraTargetPos.copy(currentPos).add(currentPlayerLook);
            startingPanPos.copy(currentPos).add(currentPlayerLook);
            isPanning = true;
            startCameraOffset = currentPos.clone().add(cameraOffset);
            let moveToTarget = new THREE.Vector3(0, 4, 0);
            let moveToPosition = moveToTarget.clone().add(new THREE.Vector3(0, 10, 10));
            cameraMovement(moveToTarget, moveToPosition, 50);
            break;
        }

        if (intersects[i].object.name.includes("Caveman") && !isMoving) {
            disableInteract();

            cameraTargetPos.copy(currentPos).add(currentPlayerLook);
            startingPanPos.copy(currentPos).add(currentPlayerLook);
            isPanning = true;
            startCameraOffset = currentPos.clone().add(cameraOffset);
            let moveToTarget = getCavemanCamMov()[0];
            let moveToPosition = moveToTarget.clone().add(getCavemanCamMov()[1]);
            cameraMovement(moveToTarget, moveToPosition, 50);
            cavemanInteract();
            break;
        } 

        if (intersects[i].object.name.includes("Mammoth") && !isMoving) {
            disableInteract();

            cameraTargetPos.copy(currentPos).add(currentPlayerLook);
            startingPanPos.copy(currentPos).add(currentPlayerLook);
            isPanning = true;
            startCameraOffset = currentPos.clone().add(cameraOffset);
            let moveToTarget = getMammothCamMov()[0];
            let moveToPosition = moveToTarget.clone().add(getMammothCamMov()[1]);
            cameraMovement(moveToTarget, moveToPosition, 50);
            mammothInteract();
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

export const panToChar = () => {
    startingPanPos.copy(cameraTargetPos);
    startCameraOffset.copy(currentCameraOffset);
    isPanning = true;
    cameraMovement(currentPos.clone().add(currentPlayerLook), currentPos.clone().add(cameraOffset), 20);
}

export const rotateCamera = (/** @type {Boolean} */ isRight) => {
    if (isMoving || interactDisabled) {
        return;
    }

    if (isRight) {
        currentRot -= 1;
        if (currentRot < 0) {
            currentRot = 359;
        }
    } else {
        currentRot += 1;
        if (currentRot > 359) {
            currentRot = 0;
        }
    }
    currentPlayerLook = new THREE.Vector3(-Math.cos(currentRot * degToRad), currentPlayerLook.y, Math.sin(currentRot * degToRad));
    cameraTargetPos = currentPos.clone().add(currentPlayerLook);
    camera.lookAt(cameraTargetPos);
    player.rotation.y = currentRot * degToRad;
}

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    const delta = clock.getDelta();
    
    animateCaveman(delta);

    animateMammoth(delta);

    animateSA(delta);
    
    if(isMoving) {
        const rotationThisFrame = rotSpeed * delta;
        
        if (endRot != currentRot) {
            if (endRot * rotDir <= (currentRot + rotDir * rotationThisFrame) * rotDir) {
                currentRot = endRot;
            } else {
                currentRot = currentRot + rotDir * rotationThisFrame;
                player.rotation.y = currentRot * degToRad;
                currentPlayerLook = new THREE.Vector3(-Math.cos(currentRot * degToRad), currentPlayerLook.y, Math.sin(currentRot * degToRad));
                cameraTargetPos = currentPos.clone().add(currentPlayerLook);
                camera.lookAt(cameraTargetPos);
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
        cameraTargetPos.copy(currentPos).add(currentPlayerLook);
        camera.position.copy(currentPos).add(cameraOffset);
        camera.lookAt(cameraTargetPos);

        currentCameraOffset = camera.position.clone();
    }
}

const rotateAngle = () => {
    const startRotVector = new THREE.Vector3(-Math.cos(currentRot * degToRad), 0, Math.sin(currentRot * degToRad))
    const normal = new THREE.Vector3(0, 1, 0);
    const cross = new THREE.Vector3().crossVectors(startRotVector, direction);
    rotDir = Math.sign(normal.dot(cross));

    return rotDir * startRotVector.angleTo(direction) * (1 / degToRad);
}

const cameraMovement = (/** @type {THREE.Vector3} */target, /** @type {THREE.Vector3} */targetOffset, /** @type {Number} */intervals) => {
    let diff = new THREE.Vector3().subVectors(target, startingPanPos);
    cameraTargetPos.add(diff.divideScalar(intervals)); 

    // let offsetDiff = new THREE.Vector3().subVectors(targetOffset, startCameraOffset);
    // currentCameraOffset.add(offsetDiff.divideScalar(intervals));

    // camera.position.copy(currentCameraOffset);
    camera.lookAt(cameraTargetPos);

    if (cameraTargetPos.distanceTo(target) > 0.01) {
        setTimeout(() => {
            cameraMovement(target, targetOffset, intervals);
        }, 10);
    } else {
        isPanning = false;
        //isInteracted = currentCameraOffset.distanceTo(currentPos.clone().add(cameraOffset)) > 0.01;
        isInteracted = cameraTargetPos.distanceTo(currentPos.clone().add(currentPlayerLook)) > 0.01;
    }
}

export const enableInteract = () => {
    interactDisabled = false;
}

export const disableInteract = () => {
    interactDisabled = true;
}

export const resizeScene = (/** @type {number} */ newWidth, /** @type {number} */ newHeight, /** @type {boolean} */ isMob) => {
    isMobile = isMob;
    renderer.setSize(newWidth, newHeight, false);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    // if (isMobile) {
    //     cameraOffset = new THREE.Vector3(0, 15, 15);
    //     currentCameraOffset = cameraOffset.clone()
    //     camera.position.set(startPos.x, startPos.y, startPos.z).add(cameraOffset);
    // } else {
    //     cameraOffset = new THREE.Vector3(0, 10, 10);
    //     camera.position.set(startPos.x, startPos.y, startPos.z).add(cameraOffset);
    // }
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
    camera.position.copy(currentCameraOffset);
    
    camera.lookAt(cameraTargetPos);

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
    })

    loader.load(`${base}/models/Indicator.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        indicator = model;
        indicator.visible = false;
    });

    loader.load(`${base}/models/OogaBoogaShowcase.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    });

    loader.load(`${base}/models/HumanCastleShowcase.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    });
    loader.load(`${base}/models/ElfForestShowcase.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    });
    loader.load(`${base}/models/DwarfMountainShowcase.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    });
    loader.load(`${base}/models/OrcDesertShowcase.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    });
    loader.load(`${base}/models/DemonDesolateShowcase.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    });

    loadStartingArea(loader, scene);

    loadCaveman(loader, scene);

    loadMammoth(loader, scene);

    animate();
}
