<script>
	let { children } = $props();
</script>

<div class="article">
	{@render children()}
</div>

<style lang="scss">
	.article {
		max-width: 800px;
	}
</style>