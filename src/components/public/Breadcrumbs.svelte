<script>
	export let breadcrumbs = null;
	export let title = null;
</script>

<div class="container mx-auto">
	<div class="pt-6">
		{#if breadcrumbs}
			<nav class="flex items-center text-sm font-medium text-gray-500 breadcrumbs">
				{#each breadcrumbs as breadcrumb}
					<a href={breadcrumb.href} class="hover:text-gray-700">
						{breadcrumb.label}
					</a>
					<span class="mx-2 text-gray-400" aria-hidden="true">&gt;</span>
				{/each}
			</nav>
		{/if}
		<h1 class="mt-4 text-xl text-bold">{title}</h1>
	</div>
</div>

<style>
	.breadcrumbs span:last-child {
		display: none;
	}
</style>
