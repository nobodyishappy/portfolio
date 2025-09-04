<script>
    import { base } from '$app/paths';
    import { innerWidth } from 'svelte/reactivity/window';
	import Body from './Body.svelte';

    let { data } = $props();
</script>

<div class="banner-image">
    {#if innerWidth.current && innerWidth.current < 500}
        <img src="{base}/NM4259/{data.post?.coverImage}_Mobile.jpg" alt="Cover">
    {:else}
        <img src="{base}/NM4259/{data.post?.coverImage}.jpg" alt="Cover">
    {/if}
</div>

<div class="article-text">
    <h1>{data.post?.title}</h1>
    {#each data.post?.contents as content}
        <Body {...content} />
    {/each}
</div>

<style lang="scss">
    .banner-image {
        width: 100%;
        padding-bottom: 15px;
        filter: drop-shadow(0px 5px 5px gray);
        img{
            width: 100%;
        }
    }
    .article-text {
        margin: 0px 20px;
    }
</style>