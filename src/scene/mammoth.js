import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { currInteractText, isInteractOpen } from '../stores/interactStores';

//Ooga Booga Showcase
/** @type {THREE.AnimationMixer[]} */
let mammothMixers = [];
/** @type {THREE.AnimationAction[]} */
let mammothActions = [];
let mammothStartPos = new THREE.Vector3(18.5, 0, 44.5);
let mammothStartRot = 10;
let mammothLoaded = false;
let mammothCurrIndex = 0;
let mammothCamMov = [new THREE.Vector3(18.5, 0, 44.5), new THREE.Vector3(-10 , 12, 15)];

export const getMammothCamMov = () => {
    return mammothCamMov;
}

export const animateMammoth = (/** @type {number} */ delta) => {
    if (mammothLoaded) {
        for (let i = 0; i < mammothMixers.length; i++) {
            mammothMixers[i].update( delta );
        }
    }
}

export const mammothInteract = () => {
    currInteractText.set(1);
    isInteractOpen.set(true);
}

export const switchMammothAnim = () => {
    let prevAction = mammothCurrIndex;
    mammothCurrIndex++;
    if (mammothCurrIndex == mammothActions.length) {
        mammothCurrIndex = 0;
    }
    mammothActions[prevAction].setEffectiveTimeScale(0).setEffectiveWeight(0).fadeOut(0.5);
    mammothActions[mammothCurrIndex].reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.5).play();
    mammothActions[mammothCurrIndex].paused = true;
}

export const playMammothAnim = () => {
    mammothActions[mammothCurrIndex].reset();
    mammothActions[mammothCurrIndex].paused = false;
    mammothActions[mammothCurrIndex].play();
}

export const loadMammoth = (/** @type {GLTFLoader} */ loader, /** @type {THREE.Scene} */ scene, /** @type {string} */ modelFile) => {

    loader.load(modelFile, (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.position.add(mammothStartPos);
        model.rotation.y = THREE.MathUtils.degToRad(mammothStartRot);

        for (let i = 0; i < gltf.animations.length; i++) {
            mammothMixers[i] = new THREE.AnimationMixer( model );
            let animAction;

            if (gltf.animations[i].name.includes("Mammoth") && !gltf.animations[i].name.includes("Walking")){
                animAction = mammothMixers[i].clipAction( gltf.animations[i] );
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
        mammothLoaded = true;
    });
}