import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { base } from '$app/paths';

//Ooga Booga Showcase
/** @type {THREE.AnimationMixer[]} */
let cavemanMixers = [];
/** @type {THREE.AnimationAction[]} */
let cavemanActions = [];
let mammothActions = [];
let cavemenStartPos = new THREE.Vector3(23, 0, 45);
let cavemanLoaded = false;
let isCavemanInteract = false;
let cavemanWeaponOrd = ["NW", "SH", "Boulder", "Spear", "Club"];
/** @type {THREE.AnimationAction} */
let cavemanCurrAnim;
/** @type {THREE.AnimationAction} */
let mammothCurrAnim;
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

export const loadOogaBooga = (/** @type {GLTFLoader} */ loader, /** @type {THREE.Scene} */ scene) => {

    loader.load(`${base}/models/OogaBooga.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.position.add(cavemenStartPos);

        model.traverse((child) => {
            // @ts-ignore
            if (child.name == "Spear" || child.name == "Axe" || child.name == "Boulder" || child.name == "Club") {
                child.visible = false;
            }
        })

        for (let i = 0; i < gltf.animations.length; i++) {
            cavemanMixers[i] = new THREE.AnimationMixer( model );
            let animAction;

            if (gltf.animations[i].name.includes("Caveman_Idle")) {
                animAction = cavemanMixers[i].clipAction( gltf.animations[i] );
                animAction.setLoop(THREE.LoopRepeat, Infinity);
                animAction.clampWhenFinished = true;
                animAction.paused = true;

                // @ts-ignore
                if (animAction._clip.name == "Caveman_Idle_NW") {
                    animAction.play();
                    cavemanCurrAnim = animAction;
                }

                cavemanActions.push(animAction);
            } else if (gltf.animations[i].name.includes("Caveman_Attack")){
                animAction = cavemanMixers[i].clipAction( gltf.animations[i] );
                animAction.setLoop(THREE.LoopOnce, 1);
                animAction.clampWhenFinished = true;
                animAction.paused = true;

                cavemanActions.push(animAction);
            } else if (gltf.animations[i].name.includes("Mammoth")){
                animAction = cavemanMixers[i].clipAction( gltf.animations[i] );
                animAction.setLoop(THREE.LoopOnce, 1);
                animAction.clampWhenFinished = true;
                animAction.paused = true;

                // @ts-ignore
                if (animAction._clip.name == "MammothIdle") {
                    animAction.play();
                    mammothCurrAnim = animAction;
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