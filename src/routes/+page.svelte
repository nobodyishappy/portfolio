<script>
    import { onMount } from "svelte";
    import { createScene, resizeScene, interact } from "../scene/scene.js"
    
    let innerWidth = $state(0)
    let innerHeight = $state(0)

    /**
	 * @type {HTMLCanvasElement}
	 */
    let el;

    onMount(() => {
        createScene(el)

        window.addEventListener("resize", () => {
            resizeScene(innerWidth, innerHeight)
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

<style lang="scss">
    canvas{
        width: 100vw;
        height: 100vh;
    }
</style>