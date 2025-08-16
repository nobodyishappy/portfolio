<script>
	import { base } from '$app/paths';
	let { children } = $props();
</script>

<nav>
	<a href="{base}/blog">Homepage</a>
</nav>

<div class="layout">
	<main>
		{@render children()}
	</main>
</div>

<style lang="scss">
	nav {
		background-color: white;
		padding: 10px 20px;
		filter: drop-shadow(0px 5px 5px lightgray);
		margin-bottom: 20px;
		a {
			font-size: large;
			font-weight: bold;
		}
	}

	.layout {
		main {
			width: 100%;
			justify-items: center;
		}
	}
</style>