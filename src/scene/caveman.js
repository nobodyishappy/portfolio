import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { base } from '$app/paths';
import { currInteractText, isInteractOpen } from "../stores/interactStores.js";

//Ooga Booga Showcase
/** @type {THREE.AnimationMixer[]} */
let cavemanMixers = [];
/** @type {THREE.AnimationAction[]} */
let cavemanActions = [];
let cavemanStartPos = new THREE.Vector3(8.5, 0, 37);
let cavemanStartRot = 290;
let cavemanLoaded = false;
// ["NW", "SHW", "Boulder", "Spear", "Club"]
/** @type {THREE.Object3D<THREE.Object3DEventMap>[]} */
let cavemanWeaponOrd = [];
let cavemanCurrIndex = 0;
let cavemanCamMov = [new THREE.Vector3(8.5, 1, 37), new THREE.Vector3(0, 5, 8)];

export const getCavemanCamMov = () => {
    return cavemanCamMov;
}


export const animateCaveman = (/** @type {number} */ delta) => {
    if (cavemanLoaded) {
        for (let i = 0; i < cavemanMixers.length; i++) {
            cavemanMixers[i].update( delta );
        }
    }
}

export const cavemanInteract = () => {
    currInteractText.set(0);
    isInteractOpen.set(true);
}

export const switchCavemanAnim = () => {
    let prevAction = cavemanCurrIndex;
    cavemanCurrIndex++;
    if (cavemanCurrIndex == cavemanActions.length) {
        cavemanCurrIndex = 0;
    }
    if (cavemanCurrIndex != 0 && prevAction != 0) {
        cavemanWeaponOrd[prevAction - 1].visible = false;
        cavemanWeaponOrd[cavemanCurrIndex - 1].visible = true;
    } else if (prevAction == 0){
        cavemanWeaponOrd[prevAction].visible = true;
    } else {
        cavemanWeaponOrd[prevAction - 1].visible = false;
    }
    cavemanActions[prevAction].setEffectiveTimeScale(0).setEffectiveWeight(0).fadeOut(0.5);
    cavemanActions[cavemanCurrIndex].reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.5).play();
    cavemanActions[cavemanCurrIndex].paused = true;
}

export const playCavemanAnim = () => {
    cavemanActions[cavemanCurrIndex].reset();
    cavemanActions[cavemanCurrIndex].paused = false;
    cavemanActions[cavemanCurrIndex].play();
}

export const loadCaveman = (/** @type {GLTFLoader} */ loader, /** @type {THREE.Scene} */ scene) => {

    loader.load(`${base}/models/Caveman.glb`, (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.position.add(cavemanStartPos);
        model.rotation.y = THREE.MathUtils.degToRad(cavemanStartRot);

        model.traverse((child) => {
            // @ts-ignore
            if (child.name == "Axe") {
                cavemanWeaponOrd[0] = child;
                child.visible = false;
            } else if (child.name == "Boulder"){
                cavemanWeaponOrd[1] = child;
                child.visible = false;
            } else if (child.name == "Spear") {
                cavemanWeaponOrd[2] = child;
                child.visible = false;
            } else if (child.name == "Club") {
                cavemanWeaponOrd[3] = child;
                child.visible = false;
            }
        })

        for (let i = 0; i < gltf.animations.length; i++) {
            cavemanMixers[i] = new THREE.AnimationMixer( model );
            let animAction;

            if (gltf.animations[i].name.includes("Caveman_Attack")){
                animAction = cavemanMixers[i].clipAction( gltf.animations[i] );
                animAction.setLoop(THREE.LoopOnce, 1);
                animAction.clampWhenFinished = true;
                animAction.paused = true;

                // @ts-ignore
                if (animAction._clip.name == "Caveman_Attack_NW") {
                    animAction.play();
                }

                cavemanActions.push(animAction);
            } 
        }
        cavemanLoaded = true;
    });
}