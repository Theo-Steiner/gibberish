<script>
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';

	async function getCurrentTab() {
		let queryOptions = { active: true, currentWindow: true };
		let [tab] = await chrome.tabs.query(queryOptions);
		return tab;
	}

	function injectedFunction() {
		document.body.style.backgroundColor = 'teal';
		chrome.runtime.sendMessage({ greeting: 'injected function was executed' }, (response) => {
			console.log('receivedResponse', response);
		});
	}

	let details;
	let resumeExecution;
	let abortExecution;

	const handleClick = async (_) => {
		const { id: tabId } = await getCurrentTab();
		chrome.scripting.executeScript({
			target: { tabId },
			function: injectedFunction
		});
	};

	const handleMessage = (message, _sender, sendResponse) => {
		waitForUserInteraction(message).then(sendResponse);
		return true;
	};

	async function waitForUserInteraction(message) {
		details = message.greeting;
		try {
			return await new Promise((resolve, reject) => {
				resumeExecution = resolve;
				abortExecution = reject;
			});
		} catch (abortMessage) {
			return abortMessage;
		}
	}

	onMount(() => {
		chrome.runtime.onMessage.addListener(handleMessage);
	});
	onDestroy(() => {
		if (browser) {
			chrome.runtime.onMessage.removeListener(handleMessage);
		}
	});
</script>

{#if details && resumeExecution && abortExecution}
	<p>
		{details}
	</p>
	<button on:click={() => resumeExecution(`Resumed execution`)}>go ahead</button>
	<button on:click={() => abortExecution(`Aborted execution`)}>abort</button>
{:else}
	<p>Ready when you are!</p>
	<button on:click={handleClick}>Execute script</button>
{/if}
