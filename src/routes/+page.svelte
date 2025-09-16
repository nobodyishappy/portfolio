<script>
    import GameShowcase from './gameShowcase.svelte';
</script>

<div class="scene-container">
    <GameShowcase></GameShowcase>
</div>

<style lang="scss">
    .scene-container{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100vw;
        height: 100vh;
    }
</style>