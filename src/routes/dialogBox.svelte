<script>
    import { currDialogText, isDialogOpen } from "../stores/dialogStores.js";
    import { enableInteract, disableInteract } from "../scene/scene.js"

    let dialogTitle = [
        "Welcome to my portfolio",
    ]

    let dialogText = [
        "Feel free to explore around the map following the stone and dirt paths. There are a few objects on the scene that can be interacted upon. To start off, you can try tapping the broken obelisks around the starting area.",
    ]

    const closeDialog = () => {
        $isDialogOpen = false;
        setTimeout(() => {enableInteract();}, 1)
    }
</script>

{#if $isDialogOpen}
    <div class="dialog-box-container">
        <div class="dialog-box">
            <div class="dialog-title">{dialogTitle[$currDialogText]}</div>
            <div class="dialog-text">{dialogText[$currDialogText]}</div>
            <button aria-label="Close" class="dialog-exit" onclick={() => {closeDialog()}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    </div>
{/if}

<style lang="scss">
    .dialog-box-container{
        position: absolute;
        z-index: 100;
        top: 0;
        width: 100%;
        height: 100%;
        align-content: center;
        justify-items: center;
        .dialog-box {
            margin: 15px;
            position: relative;
            max-width: 400px;
            background-color: rgba(0, 0, 0, 0.6);
            padding: 15px;
            color: white;
            border: 5px solid rgba(0, 0, 0, 0.8);
            border-radius: 10px;

            .dialog-title {
                font-weight: 600;
                font-size: 20px;
                padding-bottom: 15px;
            }
            .dialog-exit {
                position: absolute;
                top: 10px;
                right: 10px;
            }
        }
    }
</style>