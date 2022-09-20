<script>
	import { onMount } from 'svelte';

	/** @type {string} */
	export let name;
	/** @type {string} */
	export let label;
	export let value;
	export let prefix = '';
	export let min = 0;
	/** @type {number} */
	export let max = 0;
	export let isDisabled = false;
	export let showError = false;
	let classes = '';
	export { classes as class };

	let currentValue = value;

	onMount(() => {
		currentValue ? validateInput() : (currentValue = '');
	});

	const validateInput = () => {
		if (!currentValue) {
			currentValue = Number(currentValue);
		}

		// Check for min
		if (min && currentValue < min) {
			currentValue = min;
		}

		// Check for max
		if (max && currentValue > max) {
			currentValue = max;
		}

		// Always 2 decimals
		currentValue = currentValue.toFixed(2);

		value = parseFloat(currentValue);
	};
</script>

<div>
	<label for={name} class="font-bold block mb-1.5">
		{label}
	</label>

	<div class:flex={!!prefix}>
		{#if prefix}
			<div class="bg-white p-2 border-y border-l rounded-l bg-gray-100">
				<span>{prefix}</span>
			</div>
		{/if}

		<input
			type="number"
			disabled={isDisabled}
			{name}
			id={name}
			on:change={() => validateInput()}
			bind:value={currentValue}
			step="0.01"
			{min}
			{max}
			class="border block w-full rounded p-2 text-left {classes} {showError
				? 'border-rose-600'
				: ''}"
			class:rounded={!prefix}
			class:rounded-r={!!prefix}
			placeholder="0.00"
		/>
	</div>
</div>

<style lang="scss">
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
