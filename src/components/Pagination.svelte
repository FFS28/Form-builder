<script>
	/** @type {Object} */
	export let paginationParams;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let midSize = 2;
	let pageItems = [];

	/** @param {int} page */
	function changePage(page) {
		if (page === paginationParams.currentPage) {
			return;
		}

		paginationParams.currentPage = page;
		dispatch('pageChanged', { page });
	}

	// paginationParams.totalPages = 10;

	// Min
	if (paginationParams.currentPage > 1) {
		// First page
		pageItems.push({
			type: 'page',
			page: 1
		});
		if (paginationParams.currentPage > midSize + 2) {
			// Sep
			pageItems.push({
				type: 'sep'
			});
		}
	}

	// Middle
	for (let i = midSize; i >= 1; i--) {
		if (paginationParams.currentPage - i > 1) {
			pageItems.push({
				type: 'page',
				page: paginationParams.currentPage - i
			});
		}
	}

	pageItems.push({
		type: 'page',
		page: paginationParams.currentPage
	});

	for (let i = 1; i <= midSize; i++) {
		if (paginationParams.currentPage + i < paginationParams.totalPages) {
			pageItems.push({
				type: 'page',
				page: paginationParams.currentPage + i
			});
		}
	}

	// Max
	if (paginationParams.currentPage < paginationParams.totalPages) {
		if (paginationParams.currentPage < paginationParams.totalPages - (midSize + 1)) {
			// Sep
			pageItems.push({
				type: 'sep'
			});
		}
		// Last page
		pageItems.push({
			type: 'page',
			page: paginationParams.totalPages
		});
	}
</script>

<div class="flex">
	{#each pageItems as item}
		{#if item.type == 'sep'}
			<span class="page-item bg-white text-sky-700">...</span>
		{:else}
			<span
				on:click={() => changePage(item.page)}
				class="cursor-pointer page-item {paginationParams.currentPage === item.page
					? 'current-page'
					: 'bg-white text-sky-700'}">{item.page}</span
			>
		{/if}
	{/each}
</div>

<style lang="scss">
	.page-item {
		@apply border py-1 px-3;
	}

	.current-page {
		background-color: var(--green);
		color: white;
	}
</style>
