<script>
    import { onMount } from "svelte";
    import { createScene, resizeScene } from "../scene/scene.js"
    
    let innerWidth = $state(0)
    let innerHeight = $state(0)

    /**
	 * @type {HTMLCanvasElement}
	 */
    let el;

    onMount(() => {
        el.width = innerWidth
        el.height = innerHeight
        createScene(el)

        window.addEventListener("resize", () => {
            resizeScene(innerWidth, innerHeight)
        })
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight/>

<canvas bind:this={el}></canvas>

<style lang="scss">
    canvas{
        width: 100vw;
        height: 100vh;
    }
</style>