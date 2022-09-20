<script>
	import { createEventDispatcher } from 'svelte';

	import { fly } from 'svelte/transition';

	export let show = false;
	export let navWidth = 0;

	let deviceWidth = 0;
	if (typeof window !== 'undefined') {
		// browser code
		deviceWidth = window.innerWidth > 0 ? window.innerWidth - 150 : screen.width;
	}

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('close');
	};
</script>

{#if show}
	<div class="drawer-wrapper" on:click={closeModal}>
		<nav
			transition:fly={{ x: deviceWidth, opacity: 1 }}
			on:click={(e) => {
				e.stopPropagation();
			}}
			style="width: {navWidth}vw"
		>
			<slot />
		</nav>
	</div>
{/if}

<style>
	.drawer-wrapper {
		@apply fixed inset-0 z-50;

		background-color: rgba(0, 0, 0, 0.4);
	}

	nav {
		@apply fixed top-0 right-0 h-full border-l bg-white overflow-y-auto;

		border-color: #aaa;
		z-index: 100;
		box-shadow: -10px 0px 10px 0px rgba(0, 0, 0, 0.25);
	}
</style>
