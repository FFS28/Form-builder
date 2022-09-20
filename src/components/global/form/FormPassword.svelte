<script>
	export let name;
	export let label;
	export let value;
	export let maxlength = 1000000;
	export let showError = false;
	let classes = '';
	export { classes as class };
</script>

<div>
	<label for={name} class="font-bold block mb-1.5">
		{label}
	</label>

	<input
		type="password"
		{name}
		id={name}
		bind:value
		{maxlength}
		class="border block w-full rounded p-2 {classes} {showError ? 'border-rose-600' : ''}"
	/>
</div>
