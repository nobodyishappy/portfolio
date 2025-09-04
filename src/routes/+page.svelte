<script>
    import { onMount } from "svelte";
    import { createScene, resizeScene, interact, rotateCamera} from "../scene/scene.js"
    import DialogBox from "./dialogBox.svelte";
	import InteractBox from "./interactOBBox.svelte";
    
    let innerWidth = $state(0);
    let innerHeight = $state(0);

    /** @type {HTMLCanvasElement} */
    let el;

    /** @type {number | undefined} */
    let interactTimer;
    let startInteractX = $state(0);
    let isInteractDown = $state(false)
    let isInteractMoving = $state(false)
    let isInteractRotating = $state(false);

    onMount(() => {
        createScene(el, innerWidth < 800);

        window.addEventListener("resize", () => {
            resizeScene(innerWidth, innerHeight, innerWidth < 800);
        })

        window.addEventListener("mousedown", (e) => startInteract(e));
        window.addEventListener("mousemove", (e) => {
            e.preventDefault();
            moveInteract(e);
        });
        window.addEventListener("mouseup", (e) => endInteract(e));

        window.addEventListener("touchstart", (e) => startInteract(e.touches[0]));
        window.addEventListener("touchmove", (e) => {
            e.preventDefault();
            moveInteract(e.touches[0])
        });
        window.addEventListener("touchend", (e) => endInteract(e.touches[0]));
    });

    const startInteract = (/** @type {MouseEvent | Touch} */ e) => {
        if(!isInteractDown) {
            isInteractDown = true;
            startInteractX = e.clientX;
            interactTimer = setTimeout(() => {
                isInteractMoving = true;
            }, 100)
        } 
    }

    const moveInteract = (/** @type {MouseEvent | Touch} */ e) => {
        if(isInteractMoving) {
            if (!isInteractRotating) {
                isInteractRotating = true;
                rotateCamera((startInteractX - e.clientX) < 0);
                setTimeout(() => {
                    isInteractRotating = false;
                }, 5)
            }
        }
    }

    const endInteract = (/** @type {MouseEvent | Touch} */ e) => {
        if (isInteractDown) {
            clearTimeout(interactTimer);
            if (!isInteractMoving) {
                let x = (e.clientX / innerWidth) * 2 - 1;
                let y = - (e.clientY / innerHeight) * 2 + 1;
                interact(x,y);
            } else {
                isInteractMoving = false;
            }
            isInteractDown = false;
        }
    }
</script>

<svelte:window bind:innerWidth bind:innerHeight/>

<canvas bind:this={el} width={innerWidth} height={innerHeight}></canvas>

<DialogBox></DialogBox>

<InteractBox></InteractBox>

<style lang="scss">
    canvas{
        width: 100vw;
        height: 100vh;
    }
</style>