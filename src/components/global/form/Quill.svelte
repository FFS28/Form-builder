<script>
	import { onMount } from 'svelte';

	export let value;
	export let placeholder;
	let editor;

	onMount(async () => {
		const { default: Quill } = await import('quill');

		editor = new Quill(editor, {
			theme: 'snow',
			placeholder
		});

		// Set initial value
		const delta = editor.clipboard.convert(value);
		editor.setContents(delta, 'silent');

		// Watch changes
		editor.on('text-change', () => (value = editor.root.innerHTML));
	});
</script>

<div class="editor-wrapper">
	<div bind:this={editor} />
</div>

<style>
	@import 'quill/dist/quill.bubble.css';
	@import 'quill/dist/quill.core.css';
	@import 'quill/dist/quill.snow.css';
</style>
