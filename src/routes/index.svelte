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
		const newInteraction = { data: message.data };
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
			if (interaction) {
				interaction.abortExecution('Aborted execution');
			}
			chrome.runtime.onMessage.removeListener(handleContentScriptMessage);
		};
	});
</script>

{#if interaction}
	<p>
		{#each interaction.data as form}
			<form>
				{#each form as { type, name, value, labelText, pattern, min, max }}
					<label>
						<span>{labelText}</span>
						<input {name} {type} {value} {pattern} {min} {max} />
					</label>
				{/each}
			</form>
		{:else}
			<p>No inputs found</p>
		{/each}
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
