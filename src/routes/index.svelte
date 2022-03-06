<script>
	import { onMount } from 'svelte';

	async function getCurrentTab() {
		let queryOptions = { active: true, currentWindow: true };
		let [tab] = await chrome.tabs.query(queryOptions);
		return tab;
	}

	function injectedFunction() {
		document.body.style.backgroundColor = 'teal';
		chrome.runtime.sendMessage({ greeting: 'injected function was executed' }, function (response) {
			console.log(response);
		});
	}

	let details = 'waiting for response';

	const handleClick = async (e) => {
		const { id: tabId } = await getCurrentTab();
		const browserPolyfill = chrome || browser;
		browserPolyfill.scripting.executeScript({
			target: { tabId },
			function: injectedFunction
		});
	};

	onMount(() => {
		chrome.runtime.onMessage.addListener(async function (message, sendResponse) {
			details = message.greeting;
			if (message.greeting === 'hello') {
				return await sendResponse('goodbye');
			}
			return await sendResponse('not a greeting');
		});
	});
</script>

<button on:click={handleClick}>Exectue script</button>
<p>
	{details}
</p>
<a href="/about">go to about</a>
