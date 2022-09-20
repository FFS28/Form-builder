<script>
	export let title = '';

	import { createEventDispatcher } from 'svelte';
	import IconClose from 'svelte-material-icons/Close.svelte';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			close();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal" on:click={close}>
	<div class="modal__content" on:click|stopPropagation>
		{#if title}
			<h3 class="p-3 text-xl font-semibold">{title}</h3>
			<hr />
		{/if}
		<div on:click={close} class="absolute top-3 right-3 text-2xl text-black cursor-pointer">
			<IconClose />
		</div>

		<div class="p-3">
			<slot />
		</div>

		{#if $$slots.footer}
			<hr />
			<div class="p-3">
				<slot name="footer" />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.modal {
		position: fixed;
		z-index: 1000;
		inset: 0;

		display: flex;
		flex-direction: column;
		justify-content: center;

		background-color: rgba(black, 0.5);

		&__content {
			position: relative;

			margin: 0 auto;
			width: 100%;
			max-width: 700px;

			color: var(--text-color);
			background-color: white;
		}
	}
</style>
