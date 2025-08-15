<script>
    import { base } from '$app/paths';
    let { data } = $props();
</script>

<img src="{base}/NM4259/{data.post?.coverImage}" alt="cover">
<h1>{data.post?.title}</h1>
<div>{@html data.post?.content}</div>