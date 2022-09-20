<script>
	export let buttonTitle = 'Izvēlies datni';
	export let label;
	export let fileName;
	export let showError = false;
	export { classes as class };

	let classes = '';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function onFileSelected() {
		fileName = files[0].name;
		dispatch('fileSelected', { file: files[0] });
	}

	let files;
	let fileInput;
</script>

<div class={classes}>
	<input type="file" bind:files hidden bind:this={fileInput} on:change={onFileSelected} />
	<div>
		<p class="font-bold block mb-1.5">
			{label}
		</p>

		<div class="flex">
			<span
				class="border p-2 rounded-l block w-full {showError ? 'border-rose-600' : ''}"
				style="height: 39px;">{fileName}</span
			>
			<button on:click={fileInput.click()} class="file-btn rounded-r">{buttonTitle}</button>
		</div>
	</div>
</div>

<style>
	.file-btn {
		@apply bg-gray-300;
		width: 130px;
	}
</style>
