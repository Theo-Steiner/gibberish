export function manipulateInputs() {
	const inputs = document.querySelectorAll('input');
	const structuredInputs = [];
	let currentForm;
	inputs.forEach((input) => {
		if (input.form) {
			if (!currentForm) {
				currentForm = input.form;
				structuredInputs.push([input]);
			} else if (currentForm !== input.form) {
				currentForm = input.form;
				structuredInputs.push([input]);
			} else {
				structuredInputs[structuredInputs.length - 1].push(input);
			}
		} else {
			structuredInputs.push([input]);
		}
	});
	chrome.runtime.sendMessage({ greeting: 'injected function was executed' }, (response) => {
		console.log('receivedResponse', response);
	});
}
