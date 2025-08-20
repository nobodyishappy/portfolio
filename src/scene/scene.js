import * as THREE from 'three';
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { base } from '$app/paths';

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
/** @type {THREE.PerspectiveCamera} */
let camera;
/** @type {THREE.WebGLRenderer} */
let renderer;

// Camera panning
let isPanning = false;
let isInteracted = false;
let cameraTargetPos = new THREE.Vector3();
let startingPanPos = new THREE.Vector3();

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
let rotSpeed = 100;
let isMoving = false;
const direction = new THREE.Vector3();
const temp = new THREE.Vector3();

let playerOffset = new THREE.Vector3(0,0.0,0);
let dirLightOffset = new THREE.Vector3(100,100,100);
let cameraOffset = new THREE.Vector3(0,10,10);

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

// Variables for obelisk animations
/** @type {THREE.AnimationMixer[]} */
let obeliskMixers = [];
/** @type {THREE.AnimationAction[]} */
let obeliskActions = [];
let obeliskInteracted = [false, false, false, false, false, false];
let obelistIntCount = 0;
let obeliskLoaded = false;
let monumentMats = [];
let randObeliskArr = [0, 1, 2, 3, 4, 5];
/** @type {THREE.Object3D<THREE.Object3DEventMap>[]} */
let monumentRings = [];
/** @type {THREE.Object3D<THREE.Object3DEventMap>} */
let monumentCenter;
let monumentFloatDir = 1;

let monumentComplete = false;
let monumentConstructing = false;
const glowSpeed = 0.025;
const monumentHeight = 4;
const monumentSpeed = 5;
const ringRots = [[0,38,0],[0,90,30],[0,60,0],[90,0,0],[23.44,0,0],[0,0,0]]
const monumentRotSpd = 2.5;
const monumentFloatSpd = 0.8;
const monumentFloatDist = 0.5;
const degToRad = Math.PI / 180;

export const interact = (/** @type {number} */ x, /** @type {number} */ y) => {
    if (isPanning) {
        return;
    }

    if (isInteracted) {
        isPanning = true;
        startingPanPos.copy(cameraTargetPos);
        cameraMovement(currentPos.clone(), cameraOffset.clone());
        return;
    }

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(scene.children);
    for(let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name.includes("Monument_") && monumentComplete && !isMoving) {
            cameraTargetPos.copy(currentPos);
            startingPanPos.copy(currentPos);
            isPanning = true;
            cameraMovement(new THREE.Vector3(0, 4, 0), cameraOffset.clone());
            break;
        }

        if (intersects[i].object.name.includes("Obelisk_")) {
            // @ts-ignore
            const num = parseInt(intersects[i].object.name.at(-1), 10) - 1;

            if (!obeliskInteracted[num]) {
                let obelisk = intersects[i].object;
                while (!obelisk.name.includes("Obelisk_Arm_") && obelisk != null) {
                    // @ts-ignore
                    obelisk = obelisk.parent;
                }

                obelisk.traverse((child) => {
                    // @ts-ignore
                    if(child.name.includes("Obelisk_Glow_")) {
                        // @ts-ignore
                        morphTarget(child, num);
                    }

                    if(child.name.includes("Obelisk_Model_")) {
                        setTimeout(() => {
                            // @ts-ignore
                            child.material.emissiveIntensity = 1;
                        }, 1800)
                    }
                });
            
                obeliskActions[num].timeScale = 1;
                obeliskInteracted[num] = true;
                return;
            }
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

    if (obeliskLoaded) {
        for (let i = 0; i < obeliskMixers.length; i++) {
            obeliskMixers[i].update( delta );
        }
    }

    if (obelistIntCount == 6) {
        obelistIntCount++;
        setTimeout(() => {
            // @ts-ignore
            monumentCenter.material.emissiveIntensity = 3;
            monumentConstructing = true;
            setTimeout(() => {
                monumentConstructing = false;
                monumentComplete = true;
            }, 1500)
        }, 500)
    }

    if (monumentConstructing) {
        if (monumentCenter.position.y < monumentHeight) {
            monumentCenter.position.y += delta * monumentSpeed;
        } else {
            for (let i = 0; i < monumentRings.length; i++) {
                let ring = monumentCenter.children[i]
                if (ring.rotation.x < ringRots[i][0] * degToRad) {
                    ring.rotation.x += delta * monumentRotSpd;
                }
                if (ring.rotation.y < ringRots[i][2] * degToRad) {
                    ring.rotation.y += delta * monumentRotSpd;
                }
                if (ring.rotation.z < ringRots[i][1] * degToRad) {
                    ring.rotation.z += delta * monumentRotSpd;
                }
            }
            if (monumentCenter.rotation.z < 23.44 * degToRad) {
                monumentCenter.rotation.z += delta * monumentRotSpd;
            }
        }
    }

    if (monumentComplete) {
        monumentCenter.rotation.y += delta * monumentRotSpd;
        if (monumentCenter.position.y < monumentHeight - monumentFloatDist) {
            monumentFloatDir = 1;
        } else if (monumentCenter.position.y > monumentHeight + monumentFloatDist) {
            monumentFloatDir = -1;
        }
        monumentCenter.position.y += delta * monumentFloatSpd * monumentFloatDir;
    }
    
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

const morphTarget = (/** @type {THREE.SkinnedMesh} */obeliskGlow, /** @type {number} */ num) => {
    // @ts-ignore
    obeliskGlow.morphTargetInfluences[0] = THREE.MathUtils.clamp(obeliskGlow.morphTargetInfluences[0] + glowSpeed, 0, 1);

    if (obeliskGlow.morphTargetInfluences?.[0] != 1) {
        setTimeout(() => {morphTarget(obeliskGlow, num)}, 50);
    } else {
        setTimeout(() => {
            // @ts-ignore
            monumentRings[num].material.emissiveIntensity = 1;
            obelistIntCount++;
        }, 200);
    }
}

const shuffleArray = (/** @type {Number[]} */ array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

const cameraMovement = (/** @type {THREE.Vector3} */target, /** @type {THREE.Vector3} */targetOffset) => {
    let diff = new THREE.Vector3().subVectors(target, startingPanPos);
    cameraTargetPos.add(diff.divideScalar(50));
    camera.position.copy(cameraTargetPos).add(targetOffset);
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

export const resizeScene = (/** @type {number} */ newWidth, /** @type {number} */ newHeight) => {
    renderer.setSize(newWidth, newHeight, false);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
}

export const createScene = (/** @type {HTMLCanvasElement} */ el) => {
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

    for (let i = 0; i < 6; i++) {
        let randColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        let randToonMat = new THREE.MeshToonMaterial({ color: randColor});
        randToonMat.gradientMap = fiveTone;
        monumentMats[i] = randToonMat;
    }

    randObeliskArr = shuffleArray(randObeliskArr);

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

    resizeScene(el.width, el.height);

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

    loader.load(`${base}/models/Obelisk.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        
        model.traverse((child) => {
            // @ts-ignore
            if(child.isMesh) {
                child.receiveShadow = true;
                if (child.name.includes("Obelisk_Model_") || child.name.includes("Obelisk_Glow_")) {
                    child.frustumCulled = false;
                    // @ts-ignore
                    const num = parseInt(child.name.at(-1), 10) - 1;

                    let randToonMat = monumentMats[num].clone();
                    randToonMat.emissive = randToonMat.color;
                    
                    if (child.name.includes("Obelisk_Glow_")) {
                        randToonMat.emissiveIntensity = 2;
                    } else if (child.name.includes("Obelisk_Model_")) {
                        randToonMat.emissiveIntensity = 0;
                    }

                    // @ts-ignore
                    child.material = randToonMat;
                }
            }
        });

        for (let i = 0; i < gltf.animations.length; i++) {
            obeliskMixers[i] = new THREE.AnimationMixer( model );
            obeliskActions[i] = obeliskMixers[i].clipAction( gltf.animations[i] );

            obeliskActions[i].setLoop(THREE.LoopOnce, 1);
            obeliskActions[i].clampWhenFinished = true;
            obeliskActions[i].timeScale = 0;
            obeliskActions[i].play();
        }

        obeliskLoaded = true;
    });

    loader.load(`${base}/models/Monument.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.traverse((child) => {
            if (child.name.includes("Monument_Sphere")) {
                monumentCenter = child;

                let sunToonMat = new THREE.MeshToonMaterial({color:0xFFDF22});
                sunToonMat.gradientMap = fiveTone;
                sunToonMat.emissive = new THREE.Color(0xFFDF22);
                sunToonMat.emissiveIntensity = 0;
                // @ts-ignore
                child.material = sunToonMat
                for (let i = 0; i < child.children.length; i++) {
                    let randToonMat = monumentMats[randObeliskArr[i]].clone();
                    randToonMat.emissive = randToonMat.color;
                    randToonMat.emissiveIntensity = 0;
                    // @ts-ignore
                    child.children[i].material = randToonMat;
                    monumentRings[randObeliskArr[i]] = child.children[i];
                }
            }
        });
    });

    animate();
}
