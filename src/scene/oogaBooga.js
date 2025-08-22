import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { base } from '$app/paths';

//Ooga Booga Showcase
/** @type {THREE.AnimationMixer[]} */
let cavemanMixers = [];
/** @type {THREE.AnimationAction[]} */
let cavemanActions = [];
/** @type {THREE.AnimationAction[]} */
let mammothActions = [];
let cavemenStartPos = new THREE.Vector3(23, 0, 45);
let cavemanLoaded = false;
let isCavemanInteract = false;
// ["NW", "SHW", "Boulder", "Spear", "Club"]
/** @type {THREE.Object3D<THREE.Object3DEventMap>[]} */
let cavemanWeaponOrd = [];
let cavemanCurrIndex = 0;
let mammothCurrIndex = 0;
let mammothCamMov = [new THREE.Vector3(25, 2, 45), new THREE.Vector3(-17, 13, 10)];
let cavemanCamMov = [new THREE.Vector3(16, 1, 44), new THREE.Vector3(3, 5, 8)];

export const getMammothCamMov = () => {
    return mammothCamMov;
}

export const getCavemanCamMov = () => {
    return cavemanCamMov;
}


export const animateOB = (/** @type {number} */ delta) => {
    if (cavemanLoaded) {
        for (let i = 0; i < cavemanMixers.length; i++) {
            cavemanMixers[i].update( delta );
        }
    }
}

export const getOBInteract = () => {
    return isCavemanInteract;
}

export const updateOBInteract = (/** @type {boolean} */ value) => {
    isCavemanInteract = value;
}

export const switchCavemanAnim = () => {
    cavemanCurrIndex++;
    if (cavemanCurrIndex == cavemanActions.length) {
        cavemanCurrIndex = 0;
    }
}

export const switchMammothAnim = () => {
    mammothCurrIndex++;
    if (mammothCurrIndex == mammothActions.length) {
        mammothCurrIndex = 0;
    }
}

export const playCavemanAnim = () => {
    cavemanActions[cavemanCurrIndex].paused = false;
}

export const pauseCavemanAnim = () => {
    cavemanActions[cavemanCurrIndex].reset();
    cavemanActions[cavemanCurrIndex].paused = true;
}

export const playMammothAnim = () => {
    mammothActions[mammothCurrIndex].paused = false;
}

export const pauseMammothAnim = () => {
    mammothActions[mammothCurrIndex].reset();
    mammothActions[mammothCurrIndex].paused = true;
}

export const loadOogaBooga = (/** @type {GLTFLoader} */ loader, /** @type {THREE.Scene} */ scene) => {

    loader.load(`${base}/models/OogaBooga.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.position.add(cavemenStartPos);

        model.traverse((child) => {
            // @ts-ignore
            if (child.name == "Axe") {
                cavemanWeaponOrd[0] = child
                child.visible = false;
            } else if (child.name == "Boulder"){
                cavemanWeaponOrd[1] = child
                child.visible = false;
            } else if (child.name == "Spear") {
                cavemanWeaponOrd[2] = child
                child.visible = false;
            } else if (child.name == "Club") {
                cavemanWeaponOrd[3] = child
                child.visible = false;
            }
        })

        for (let i = 0; i < gltf.animations.length; i++) {
            cavemanMixers[i] = new THREE.AnimationMixer( model );
            let animAction;

            // if (gltf.animations[i].name.includes("Caveman_Idle")) {
            //     animAction = cavemanMixers[i].clipAction( gltf.animations[i] );
            //     animAction.setLoop(THREE.LoopRepeat, Infinity);
            //     animAction.clampWhenFinished = true;
            //     animAction.paused = true;

            //     // @ts-ignore
            //     if (animAction._clip.name == "Caveman_Idle_NW") {
            //         animAction.play();
            //         cavemanCurrAnim = animAction;
            //     }

            //     cavemanActions.push(animAction);
            // }
            if (gltf.animations[i].name.includes("Caveman_Attack")){
                animAction = cavemanMixers[i].clipAction( gltf.animations[i] );
                animAction.setLoop(THREE.LoopRepeat, Infinity);
                animAction.clampWhenFinished = true;
                animAction.paused = true;

                // @ts-ignore
                if (animAction._clip.name == "Caveman_Attack_NW") {
                    animAction.play();
                }

                cavemanActions.push(animAction);
            } else if (gltf.animations[i].name.includes("Mammoth") && !gltf.animations[i].name.includes("Walking")){
                animAction = cavemanMixers[i].clipAction( gltf.animations[i] );
                animAction.setLoop(THREE.LoopOnce, 1);
                animAction.clampWhenFinished = true;
                animAction.paused = true;

                // @ts-ignore
                if (animAction._clip.name == "MammothIdle") {
                    animAction.play();
                }

                mammothActions.push(animAction);
            } else {
                continue;
            }
        }
        cavemanLoaded = true;

        // obeliskActions[num].reset();
        // obeliskActions[num].paused = true;
    });
}