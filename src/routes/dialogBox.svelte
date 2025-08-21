<script>
    let { title, text, onAction } = $props();
</script>

<div class="dialog-box-container">
    <div class="dialog-box">
        <div class="dialog-title">{title}</div>
        <div class="dialog-text">{text}</div>
        <button aria-label="Close" class="dialog-exit" onclick={() => {onAction()}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
    </div>
</div>

<style lang="scss">
    .dialog-box-container{
        position: absolute;
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

        @media (width > 400px) {
            
        }
    }
</style>