<script>
    import { base } from '$app/paths';
    import { innerWidth } from 'svelte/reactivity/window';

    let { data } = $props();
</script>

{#each data.summaries as { slug, title, coverImage }}
    <a href="{base}/blog/{slug}">
        {#if innerWidth.current && innerWidth.current < 800}
            <img src="{base}/NM4259/{coverImage}_Mobile.png" alt="Cover">
        {:else}
            <img src="{base}/NM4259/{coverImage}.png" alt="Cover">
        {/if}
        <p>{title}</p>
    </a>
{/each}

<style lang="scss">
    img {
        width: 100%;
    }
</style>