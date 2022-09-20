<script>
	export let name;
	export let label = '';
	export let value;
</script>

<div>
	{#if label}
		<label for={name} class="font-bold block mb-1.5">
			{label}
		</label>
	{/if}

	<textarea {name} id={name} bind:value class="border block w-full rounded p-2" rows="8" />
</div>
