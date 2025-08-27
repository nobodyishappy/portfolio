<script>
    import { onMount } from "svelte";
    import { createScene, resizeScene, interact} from "../scene/scene.js"
    import DialogBox from "./dialogBox.svelte";
	import InteractBox from "./interactOBBox.svelte";
    
    let innerWidth = $state(0)
    let innerHeight = $state(0)

    /** @type {HTMLCanvasElement} */
    let el;

    onMount(() => {
        createScene(el, innerWidth < 800)

        window.addEventListener("resize", () => {
            resizeScene(innerWidth, innerHeight, innerWidth < 800)
        })

        window.addEventListener("click", (e) => {
            let x = (e.clientX / innerWidth) * 2 - 1
            let y = - (e.clientY / innerHeight) * 2 + 1
            interact(x,y)
        })
    });

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