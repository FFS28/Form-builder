<script>
	export let name;
	export let label;
	export let value;
	export let isDisabled = false;
</script>

<div>
	<input type="checkbox" {name} id={name} disabled={isDisabled} bind:checked={value} {value} />

	<label for={name}>
		{label}
	</label>
</div>
