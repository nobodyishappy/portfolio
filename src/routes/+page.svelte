<script>
    import { onMount } from "svelte";
    import { createScene, resizeScene, interact, enableInteract } from "../scene/scene.js"
    import DialogBox from "./dialogBox.svelte";
    
    let innerWidth = $state(0)
    let innerHeight = $state(0)

    let isDialogOpen = $state(true);

    /**
	 * @type {HTMLCanvasElement}
	 */
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

    let dialogTitle = [
        "Welcome to my portfolio",
    ]

    let dialogText = [
        "Feel free to explore around the map following the stone and dirt paths. There are a few objects on the scene that can be interacted upon. To start off, you can try tapping the broken obelisks around the starting area.",
    ]

    const closeWindow = () => {
        isDialogOpen = false;
        setTimeout(() => {enableInteract();}, 1)
    }
</script>

<svelte:window bind:innerWidth bind:innerHeight/>

<canvas bind:this={el} width={innerWidth} height={innerHeight}></canvas>

{#if isDialogOpen}
    <DialogBox title={dialogTitle[0]} text={dialogText[0]} onAction={closeWindow}></DialogBox>
{/if}

<style lang="scss">
    canvas{
        width: 100vw;
        height: 100vh;
    }
</style>