<script>
    import { currInteractText, isInteractOpen } from "../stores/interactStores.js";
    import { enableInteract, panToChar } from "../scene/scene.js"
    import { playCavemanAnim, switchCavemanAnim } from "../scene/caveman.js";
	import { playMammothAnim, switchMammothAnim } from "../scene/mammoth.js";

    let interactTitle = [
        "Caveman",
        "Mammoth"
    ]

    let interactText = [
        "The player character of a pre-historic hack and slash game. Explore a map to collect materials to craft different weapons to slay the mammoth.",
        "The boss monster that is roaming the land. This is the monster that every caveman has to slay to get recognise by their tribe."
    ]

    let playCommand = [
        playCavemanAnim,
        playMammothAnim,
    ]

    let switchCommand = [
        switchCavemanAnim,
        switchMammothAnim,
    ]

    const closeInteract = () => {
        $isInteractOpen = false;
        setTimeout(() => {
            enableInteract();
            panToChar();
        }, 1)
    }
</script>

{#if $isInteractOpen}
    <div class="interact-box-container">
        <div class="interact-box">
            <div class="interact-title">{interactTitle[$currInteractText]}</div>

            <div class="interact-text-box">
                <div class="interact-text">{interactText[$currInteractText]}</div>
                <div class="interact-button-box">
                    <button aria-label="Switch" class="interact-switch" onclick={() => {switchCommand[$currInteractText]()}}>Switch</button>
                    <button aria-label="Play" class="interact-switch" onclick={() => {playCommand[$currInteractText]()}}>Play</button>
                </div>
            </div>

            <button aria-label="Close" class="interact-exit" onclick={() => {closeInteract()}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    </div>
{/if}

<style lang="scss">
    .interact-box-container{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        align-content: end;
        justify-items: center;
        .interact-box {
            display: flex;
            flex-direction: column;
            margin: 15px;
            position: relative;
            max-width: 400px;
            background-color: rgba(0, 0, 0, 0.6);
            padding: 15px;
            color: white;
            border: 5px solid rgba(0, 0, 0, 0.8);
            border-radius: 10px;

            .interact-title {
                font-weight: 600;
                font-size: 20px;
                padding-bottom: 15px;
            }

            .interact-text-box {
                display: flex;
                gap: 10px;
                align-items: center;
                .interact-button-box {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    button {
                        background-color: rgba(255, 255, 255, 0.6);
                        width: 100%;
                        justify-content: center;
                        padding: 5px;
                        border: 2px solid rgba(255, 255, 255, 0.8);
                        border-radius: 5px;
                    }
                }
            }
            
            

            .interact-exit {
                position: absolute;
                top: 10px;
                right: 10px;
            }
        }
    }
</style>