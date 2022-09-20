<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import IconClose from 'svelte-material-icons/Close.svelte';
	import SearchBar from '$components/SearchBar.svelte';

	export let label;
	export let selectedItems;
	export let items;
	export let showError = true;
	export let isDisabled = false;

	const dispatch = createEventDispatcher();

	let itemListVisible = false;
	let filteredItems = [];

	function removeItem(value) {
		selectedItems = selectedItems.filter((item) => item.value !== value);
		items = [...items];
		dispatch('selected');
	}

	function updateItem(item) {
		const exists = selectedItems.find((i) => i.value === item.value);
		if (exists) {
			selectedItems = selectedItems.filter((i) => i.value !== item.value);
			items = [...items];
			dispatch('selected');
			return;
		}

		selectedItems.push(item);

		// Svelte requires reassign to be reactive
		selectedItems = [...selectedItems];
		items = [...items];
		dispatch('selected');
	}

	function isSelected(value) {
		return selectedItems.find((i) => i.value === value);
	}

	function clickOutside(node) {
		const handleClick = (event) => {
			if (node && !node.contains(event.target) && !event.defaultPrevented) {
				node.dispatchEvent(new CustomEvent('click_outside', node));
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	/**
	 * Search data list
	 */
	const onSearch = (searchTerm) => {
		if (!searchTerm) {
			return (filteredItems = items);
		}

		filteredItems = items.filter((item) =>
			item.label.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	const showItemList = () => {
		filteredItems = items;
		itemListVisible = true;
	};
</script>

<p class="font-bold block mb-1.5">{label}</p>
{#if !isDisabled}
	<div use:clickOutside on:click_outside={() => (itemListVisible = false)}>
		<div class="w-full relative" on:click|stopPropagation>
			<div
				class="cursor-text p-1 flex flex-auto flex-wrap border bg-white rounded {showError
					? 'border-rose-600'
					: 'border-gray-200'}"
				class:h-9={!selectedItems.length}
				on:click={showItemList}
			>
				{#each selectedItems as item}
					<div
						class="flex justify-center items-center font-medium px-2 rounded bg-gray-300 border h-7"
					>
						<p class="text-xs font-normal leading-none max-w-full flex-initial">{item.label}</p>
						<div
							on:click={() => removeItem(item.value)}
							class="flex flex-auto flex-row-reverse ml-1 cursor-pointer"
						>
							<IconClose />
						</div>
					</div>
				{/each}
			</div>

			{#if itemListVisible}
				<div class="absolute z-40 top-full left-0 w-full bg-white shadow rounded">
					<div class="p-2">
						<SearchBar on:search={({ detail }) => onSearch(detail)} />
					</div>
					<div class="flex flex-col w-full max-h-select overflow-y-auto m2-1">
						{#each filteredItems as item}
							<div
								on:click={() => updateItem(item)}
								class="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-gray-100"
							>
								<div
									class="flex w-full items-center p-2 pl-2 border-transparent hover:border-gray-600 border-l-2 relative"
									class:border-gray-600={isSelected(item.value)}
								>
									<p class="leading-6 mx-2">{item.label}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div>
		<div class="w-full relative">
			<div class="p-1 flex flex-auto flex-wrap rounded border border-gray-200 disabled">
				{#each selectedItems as item}
					<div
						class="flex justify-center items-center font-medium px-2 rounded bg-gray-300 border h-7"
					>
						<p class="text-xs font-normal leading-none max-w-full flex-initial">{item.label}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.max-h-select {
		max-height: 300px;
	}

	.disabled {
		background: rgba(239, 239, 239, 0.3);
	}
</style>
