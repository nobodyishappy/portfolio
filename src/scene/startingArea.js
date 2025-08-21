import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { base } from '$app/paths';

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

export const interactStartArea = (/** @type {THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>} */ intersect) => {
    // @ts-ignore
    const num = parseInt(intersect.object.name.at(-1), 10) - 1;
    if (!obeliskInteracted[num]) {
        let obelisk = intersect.object;
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
        
        obeliskActions[num].paused = false;
        obeliskInteracted[num] = true;
        return;
    }
}

export const getStartAreaComplete = () => {
    return monumentComplete;
}

export const animateSA = (/** @type {number} */ delta) => {
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
}

export const loadStartingArea = (/** @type {GLTFLoader} */ loader, /** @type {THREE.Scene} */ scene) => {
    const fiveTone = new THREE.TextureLoader().load(`${base}/gradientMaps/fiveTone.jpg`);
    fiveTone.minFilter = THREE.NearestFilter;
    fiveTone.magFilter = THREE.NearestFilter;

    for (let i = 0; i < 6; i++) {
            let randColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            let randToonMat = new THREE.MeshToonMaterial({ color: randColor});
            randToonMat.gradientMap = fiveTone;
            monumentMats[i] = randToonMat;
        }
    
    randObeliskArr = shuffleArray(randObeliskArr);

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
            obeliskActions[i].paused = true;
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
}