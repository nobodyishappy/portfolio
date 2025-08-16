<script>
    import { base } from '$app/paths';
    import { innerWidth } from 'svelte/reactivity/window';

    let { data } = $props();
</script>

{#if innerWidth.current && innerWidth.current < 800}
    <img src="{base}/NM4259/{data.post?.coverImage}_Mobile.png" alt="Cover">
{:else}
    <img src="{base}/NM4259/{data.post?.coverImage}.png" alt="Cover">
{/if}
<h1>{data.post?.title}</h1>
<div>{@html data.post?.content}</div>

<style lang="scss">
    img {
        width: 100%;
    }
</style>