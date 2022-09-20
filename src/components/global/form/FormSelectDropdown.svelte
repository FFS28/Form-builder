<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import IconClose from 'svelte-material-icons/Close.svelte';
	import IconArrowDown from 'svelte-material-icons/ChevronDown.svelte';
	import IconArrowUp from 'svelte-material-icons/ChevronUp.svelte';

	export let label;
	export let selectedItem;
	export let items;
	export let itemsAreObjects = false;

	const dispatch = createEventDispatcher();

	let itemListVisible = false;

	function removeItem(value) {
		selectedItem = undefined;
		dispatch('selected');
	}

	function updateItem(item) {
		selectedItem = item;
		itemListVisible = false;
		dispatch('selected');
	}

	function isSelected(value) {
		if (itemsAreObjects) {
			return selectedItem && selectedItem.value === value;
		} else {
			return selectedItem === value;
		}
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

	const showItemList = () => {
		itemListVisible = true;
	};
</script>

<p class="font-bold block mb-1.5">{label}</p>
<div use:clickOutside on:click_outside={() => (itemListVisible = false)} class="min-w-[200px]">
	<div class="w-full relative" on:click|stopPropagation>
		<div
			class="cursor-pointer p-1 flex flex-auto flex-wrap border bg-white rounded border-gray-300 h-[38px]"
			on:click={showItemList}
		>
			{#if selectedItem}
				<div class="flex justify-center items-center font-medium pl-2 rounded h-7 flex-1 w-full">
					<p class="font-normal text-left leading-none max-w-full flex-initial">
						{itemsAreObjects ? selectedItem.label : selectedItem}
					</p>
					<div
						on:click={() => removeItem()}
						class="flex ml-auto flex-row-reverse cursor-pointer items-center justify-center h-[32px]"
					>
						<IconClose size="18" />
					</div>
				</div>
			{/if}
			{#if !selectedItem}
				<div class="flex ml-auto flex-row-reverse cursor-pointer items-center justify-center">
					{#if itemListVisible}
						<IconArrowUp size="18" />
					{:else}
						<IconArrowDown size="18" />
					{/if}
				</div>
			{/if}
		</div>

		{#if itemListVisible}
			<div class="absolute z-40 top-full left-0 w-full bg-white shadow rounded">
				<div class="flex flex-col w-full max-h-select overflow-y-auto m2-1">
					{#each items as item}
						<div
							on:click={() => updateItem(item)}
							class="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-gray-100"
						>
							<div
								class="flex w-full items-center text-left p-2 pl-2 border-transparent hover:border-gray-600 border-l-2 relative"
								class:border-gray-600={isSelected(item)}
							>
								<p class="leading-6 mx-2">{itemsAreObjects ? item.label : item}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.max-h-select {
		max-height: 300px;
	}
</style>
