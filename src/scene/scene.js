import * as THREE from 'three';

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
/**
 * @type {THREE.PerspectiveCamera}
 */
let camera;
/**
 * @type {THREE.WebGLRenderer}
 */
let renderer;
scene.add(cube);

const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

export const resizeScene = (/** @type {number} */ newWidth, /** @type {number} */ newHeight) => {
    renderer.setSize(newWidth, newHeight, false);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
}

export const createScene = (/** @type {HTMLCanvasElement} */ el) => {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el});
    camera = new THREE.PerspectiveCamera(75, el.width / el.height, 0.2, 1000);
    camera.position.z = 5;
    resizeScene(el.width, el.height);
    animate();
}
