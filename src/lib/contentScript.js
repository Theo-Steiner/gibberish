export function manipulateInputs() {
	const inputs = document.querySelectorAll('input');
	const structuredInputs = [];
	const structuredRepresentation = [];
	let currentForm;
	const getInputRepresentation = (input) => {
		return {
			name: input.name,
			id: input.id,
			required: input.required,
			type: input.type,
			labelText:
				input.labels?.length > 0
					? input.labels[0].innerText
					: input.ariaLabel
					? input.ariaLabel
					: input.name,
			value: input.value,
			pattern: input.pattern,
			min: input.min,
			max: input.max
		};
	};
	inputs.forEach((input) => {
		if (
			![
				'text',
				'tel',
				'email',
				'password',
				'number',
				'date',
				'checkbox',
				'color',
				'month'
			].includes(input.type)
		)
			return;
		if (input.form) {
			if (!currentForm) {
				currentForm = input.form;
				structuredInputs.push([input]);
				structuredRepresentation.push([getInputRepresentation(input)]);
			} else if (currentForm !== input.form) {
				currentForm = input.form;
				structuredInputs.push([input]);
				structuredRepresentation.push([getInputRepresentation(input)]);
			} else {
				structuredInputs[structuredInputs.length - 1].push(input);
				structuredRepresentation[structuredRepresentation.length - 1].push(
					getInputRepresentation(input)
				);
			}
		} else {
			structuredInputs.push([input]);
			structuredRepresentation.push([getInputRepresentation(input)]);
		}
	});
	chrome.runtime.sendMessage({ data: structuredRepresentation }, (response) => {
		console.log('receivedResponse', response);
	});
}
