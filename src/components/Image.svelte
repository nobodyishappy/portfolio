<script>
    import { base } from '$app/paths';

    let { src, alt } = $props();
</script>

<img src="{base}/{src}" alt="{alt}">

<style lang="scss">
    img {
        max-height: 500px;
        margin: 15px auto;
    }
</style>