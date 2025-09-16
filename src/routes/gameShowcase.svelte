<script>
    import { onMount } from "svelte";
    import { createScene, resizeScene, interact, rotateCamera} from "../scene/scene.js"
    import DialogBox from "./dialogBox.svelte";
	import InteractBox from "./interactOBBox.svelte";
	import { progress } from "../stores/loadingProgress.js";

    /** @type {HTMLCanvasElement} */
    let el;

    /** @type {number | undefined} */
    let interactTimer;
    let prevInteractX = $state(0);
    let prevInteractY = $state(0);

    let isInteractDown = $state(false);
    let isInteractMoving = $state(false);
    let isInteractRotating = $state(false);

    /**
	 * @type {HTMLElement | null}
	 */
    let sceneWrapper;
    let sceneTop = 0;
    let sceneLeft = 0;
    let sceneWidth = $state(0);
    let sceneHeight = $state(0);

    onMount(() => {
        createScene(el);

        sceneWrapper = document.getElementById("scene-wrapper");

        window.addEventListener("resize", () => {
            if (sceneWrapper) {
                const bcr = sceneWrapper.getBoundingClientRect();
                sceneWidth = bcr.width;
                sceneHeight = bcr.height;
                resizeScene(sceneWidth, sceneHeight);
            }
        })

        if(sceneWrapper) {
            const bcr = sceneWrapper.getBoundingClientRect();
            sceneTop = bcr.top;
            sceneLeft = bcr.left;
            sceneWidth = bcr.width;
            sceneHeight = bcr.height;
            resizeScene(sceneWidth, sceneHeight);

            sceneWrapper.addEventListener("mousedown", (e) => startMouseInteract(e));
            sceneWrapper.addEventListener("mousemove", (e) => moveMouseInteract(e));
            sceneWrapper.addEventListener("mouseup", (e) => endMouseInteract(e));
            sceneWrapper.addEventListener("mouseout", (e) => endMouseInteract(e));

            sceneWrapper.addEventListener("touchstart", (e) => startTouchInteract(e));
            sceneWrapper.addEventListener("touchmove", (e) => moveTouchInteract(e));
            sceneWrapper.addEventListener("touchend", (e) => endTouchInteract(e));
        }
        
        
    });

    const startMouseInteract = (/** @type {MouseEvent} */ e) => {
        if(!isInteractDown) {
            isInteractDown = true;
            interactTimer = setTimeout(() => {
                prevInteractX = e.offsetX;
                prevInteractY = e.offsetY;
                isInteractMoving = true;
            }, 100)
        } 
    }

    const startTouchInteract = (/** @type {TouchEvent} */ e) => {
        if(!isInteractDown) {
            isInteractDown = true;
            const firstTouch = e.touches[0]
            interactTimer = setTimeout(() => {
                prevInteractX = firstTouch.clientX - sceneTop;
                prevInteractY = firstTouch.clientY - sceneLeft;
                isInteractMoving = true;
            }, 100)
        } 
    }

    const moveMouseInteract = (/** @type {MouseEvent} */ e) => {
        if(isInteractMoving) {
            if (!isInteractRotating) {
                isInteractRotating = true;
                rotateCamera(e.offsetX - prevInteractX, e.offsetY - prevInteractY);
                prevInteractX = e.offsetX;
                prevInteractY = e.offsetY;
                setTimeout(() => {
                    isInteractRotating = false;
                }, 5)
            }
        }
    }

    const moveTouchInteract = (/** @type {TouchEvent} */ e) => {
        if(isInteractMoving) {
            if (!isInteractRotating) {
                isInteractRotating = true;
                const firstTouch = e.touches[0];
                const touchX = firstTouch.clientX - sceneTop;
                const touchY = firstTouch.clientY - sceneLeft;
                rotateCamera(touchX - prevInteractX, touchY - prevInteractY);
                prevInteractX = touchX;
                prevInteractY = touchY;
                setTimeout(() => {
                    isInteractRotating = false;
                }, 5)
            }
        }
    }

    const endMouseInteract = (/** @type {MouseEvent} */ e) => {
        if (isInteractDown) {
            clearTimeout(interactTimer);
            if (!isInteractMoving) {
                let x = (e.offsetX / sceneWidth) * 2 - 1;
                let y = - (e.offsetY / sceneHeight) * 2 + 1;
                interact(x,y);
            } else {
                isInteractMoving = false;
            }
            isInteractDown = false;
        }
    }

    const endTouchInteract = (/** @type {TouchEvent} */ e) => {
        if (isInteractDown) {
            clearTimeout(interactTimer);
            if (!isInteractMoving) {
                // const firstTouch = e.touches[0];
                // const touchX = firstTouch.clientX - sceneTop;
                // const touchY = firstTouch.clientY - sceneLeft;

                // let x = (touchX / sceneWidth) * 2 - 1;
                // let y = - (touchY / sceneHeight) * 2 + 1;
                // interact(x,y);
            } else {
                isInteractMoving = false;
            }
            isInteractDown = false;
        }
    }
</script>

<div id="scene-wrapper">
    <canvas bind:this={el} width={sceneWidth} height={sceneHeight}></canvas>
    <DialogBox></DialogBox>
    <InteractBox></InteractBox>
    <div class="loading-screen" style="display: {$progress == 1?"none":"block"}">
        <div class="loading-container">
            <div class="loading-bar" style="width: {$progress * 100}%;"></div>
        </div>
    </div>
</div>



<style lang="scss">
    #scene-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        canvas{
            width: 100%;
            height: 100%;
        }
        .loading-screen {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: black;
            top: 0;
            z-index: 999;
            .loading-container{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200px;
                height: 30px;
                background-color: white;
                border: 2px solid white;
                .loading-bar {
                    background: black;
                    height: 100%;
                }
            }
        }
    }
    
</style>