<script>
	import IconChevronRight from 'svelte-material-icons/ChevronRight.svelte';
	export let items;
</script>

<div class="flex items-center text-gray-500 text-sm">
	{#each items as item, index}
		<span class="text-gray-500 underline">{item.title}</span>
		{#if items.length - 1 > index}
			<div class="mx-1">
				<IconChevronRight />
			</div>
		{/if}
	{/each}
</div>
