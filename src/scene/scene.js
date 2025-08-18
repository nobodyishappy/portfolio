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


// Pathfinding 
const clock = new THREE.Clock();
const pathfinding = new Pathfinding();
const pathfindinghelper = new PathfindingHelper();
scene.add(pathfindinghelper)
const ZONE = 'level1';
/** @type {THREE.Vector3[]} */
let path;

//Movement Values
const startPos = new THREE.Vector3(0,0,0);
/** @type {THREE.Vector3} */
let currentPos = startPos;
/** @type {THREE.Vector3} */
let endPos;
let currentIndex = 0;
let speed = 5;
let isMoving = false;
const direction = new THREE.Vector3();
const temp = new THREE.Vector3();

let playerOffset = new THREE.Vector3(0,0.8,0);
let dirLightOffset = new THREE.Vector3(100,100,100);
let cameraOffset = new THREE.Vector3(0,10,10);

/** @type {THREE.Mesh<THREE.CapsuleGeometry>} */
let capsule;
/**
 * @type {THREE.Object3D<THREE.Object3DEventMap>}
 */
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
let obeliskLoaded = false;
let glowSpeed = 0.1;


export const interact = (/** @type {number} */ x, /** @type {number} */ y) => {
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for(let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name.includes("Obelisk_")) {
            let obelisk = intersects[i].object;
            while (!obelisk.name.includes("Obelisk_Arm_") && obelisk != null) {
                // @ts-ignore
                obelisk = obelisk.parent;
            }

            // @ts-ignore
            const num = parseInt(obelisk.name.at(-1), 10) - 1;

            obelisk.traverse((child) => {
                // @ts-ignore
                if(child.name.includes("Obelisk_Glow_")) {
                    // @ts-ignore
                    morphTarget(child);
                }
            });

            if (!obeliskInteracted[num]) {
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
                indicator.visible = false;
            }
        } else {
            direction.normalize();
            temp.copy(direction).multiplyScalar(distanceThisFrame);
            currentPos.add(temp);
        }

        capsule.position.copy(currentPos).add(playerOffset);
        camera.position.copy(currentPos).add(cameraOffset);
        camera.lookAt(currentPos);
    }
}

const morphTarget = (/** @type {THREE.SkinnedMesh} */obeliskGlow) => {
    // @ts-ignore
    obeliskGlow.morphTargetInfluences[0] = THREE.MathUtils.lerp(obeliskGlow.morphTargetInfluences[0], 1, glowSpeed);

    if (obeliskGlow.morphTargetInfluences?.[0] != 1) {
        setTimeout(() => {morphTarget(obeliskGlow)}, 50);
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

    const capsuleGeometry = new THREE.CapsuleGeometry( 0.5, 0.8, 10, 20);
    const capsuleMaterial = new THREE.MeshToonMaterial({ color: 0x00ffff });
    capsuleMaterial.gradientMap = fiveTone
    capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
    scene.add(capsule)
    capsule.position.set(startPos.x, startPos.y, startPos.z).add(playerOffset);
    capsule.castShadow = true;

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera = new THREE.PerspectiveCamera(45, el.width / el.height, 0.2, 1000);
    camera.position.add(cameraOffset);
    camera.lookAt(currentPos);

    ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    dirLight.position.copy(dirLightOffset);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.target = capsule;
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
    })

    loader.load(`${base}/models/Indicator.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        indicator = model;
        indicator.visible = false;
    })

    loader.load(`${base}/models/Obelisk.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        
        model.traverse((child) => {
            // @ts-ignore
            if(child.isMesh) {
                child.receiveShadow = true;
                if (child.name.includes("Obelisk_Model_") || child.name.includes("Obelisk_Glow_")) {
                    child.frustumCulled = false;
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
    })

    animate();
}
