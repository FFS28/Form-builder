<script>
	export let name;
	export let label;
	export let value;
	// need to set default value so prop is not required when initializing component
	export let maxlength = 1000000;
	// export let prefix;
	export let isDisabled = false;
	export let showError = false;
	let classes = '';
	export { classes as class };
</script>

<div>
	<label for={name} class="font-bold block mb-1.5">
		{label}
	</label>

	<input
		type="text"
		disabled={isDisabled}
		{name}
		id={name}
		bind:value
		{maxlength}
		class="border block w-full rounded p-2 {classes} {showError ? 'border-rose-600' : ''}"
	/>
</div>
