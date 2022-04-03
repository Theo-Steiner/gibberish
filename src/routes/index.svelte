<script>
	import { onMount } from 'svelte';
	import { manipulateInputs } from '$lib/contentScript';
	import { getCurrentTab } from '$lib/utils';

	let interaction;

	const injectContentScript = async (_) => {
		const { id: tabId } = await getCurrentTab();
		chrome.scripting.executeScript({
			target: { tabId },
			function: manipulateInputs
		});
	};

	const handleContentScriptMessage = (message, _sender, sendResponse) => {
		waitForUserInteraction(message).then(sendResponse);
		return true;
	};

	async function waitForUserInteraction(message) {
		const newInteraction = { data: message.greeting };
		try {
			return await new Promise((resolve, reject) => {
				newInteraction.resumeExecution = resolve;
				newInteraction.abortExecution = reject;
				interaction = newInteraction;
			});
		} catch (abortMessage) {
			return abortMessage;
		}
	}

	// Add listener for messages sent from the content script
	onMount(() => {
		chrome.runtime.onMessage.addListener(handleContentScriptMessage);
		// cleanup on destroy
		return () => {
			chrome.runtime.onMessage.removeListener(handleContentScriptMessage);
		};
	});
</script>

{#if interaction}
	<p>
		{interaction.data}
	</p>
	<button
		on:click={() => {
			interaction.resumeExecution(`Resumed execution`);
			interaction = null;
		}}>go ahead</button
	>
	<button
		on:click={() => {
			interaction.abortExecution(`Aborted execution`);
			interaction = null;
		}}>abort</button
	>
{:else}
	<p>Ready when you are!</p>
	<button on:click={injectContentScript}>Execute script</button>
{/if}
