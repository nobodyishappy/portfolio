<script>
    import { base } from '$app/paths';
    let { data } = $props();
</script>

{#each data.summaries as { slug, title, coverImage }}
    <a href="{base}/blog/{slug}">
        <img src="{base}/NM4259/{coverImage}" alt="Cover">
        <p>{title}</p>
    </a>
{/each}

<style lang="scss">
</style>