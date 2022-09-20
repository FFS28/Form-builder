<script>
	export let name;
	export let label;
	export let value;
	export let items;
	export let placeholder;
	export let showError = false;
	export let selectFunction = null;

	const selectAction = () => {
		if (selectFunction) {
			selectFunction(value);
		}
	};
</script>

<div>
	<label for={name} class="font-bold block mb-1.5">
		{label}
	</label>
	<select
		id={name}
		{name}
		bind:value
		class="border rounded block w-full p-2 {showError ? 'border-rose-600' : ''}"
		on:change={() => selectAction()}
	>
		<option value="" selected disabled>{placeholder}</option>
		{#if items}
			{#each items as { name, value }}
				<option {value}>
					{name}
				</option>
			{/each}
		{/if}
	</select>
</div>

<style>
	select {
		height: 38px;
	}
</style>
