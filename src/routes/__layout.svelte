<script>
	import '../app.css';
	import { page } from '$app/stores';
	$: isAboutRoute = $page.url.pathname !== '/about';
</script>

<svelte:head>
	<title>gibberish</title>
</svelte:head>

<header>
	<a class:off-screen={isAboutRoute} href="/" aria-label="Go back to extension"><span>⭠</span></a>
	<h1>GIBBERISH</h1>
	<p>
		Fill out forms with valid gibberish!
		<a class:off-screen={!isAboutRoute} href="/about" aria-label="About this extension">?</a>
	</p>
</header>

<slot />

<style>
	a {
		transition: transform 0.5s ease-in-out, visibility 1s ease-in-out;
		visibility: visible;
		transform: translate(0px);
	}

	header > a {
		position: absolute;
		left: 2.4rem;
		top: 0.8rem;
		font-size: 3rem;
		width: auto;
		height: 1.75rem;
		border: none;
		transform: translateY(0.7rem);
	}

	span {
		display: block;
		margin: 0 0.4rem;
		transform: translateY(-0.65rem);
	}

	header > .off-screen {
		visibility: hidden;
		transform: translateX(-200px);
	}

	p > .off-screen {
		visibility: hidden;
		transform: translateX(200px);
	}

	h1,
	p > a {
		text-align: center;
	}

	header {
		border-bottom: 1px solid var(--text-color);
		margin-bottom: 1rem;
		width: 30rem;
		position: relative;
	}
</style>
