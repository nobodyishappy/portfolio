<script>
	import '../app.css';
	import { base } from '$app/paths';

	let { children } = $props();
</script>

<nav>
	<a href="{base}/blog">Homepage</a>
</nav>

{@render children()}
