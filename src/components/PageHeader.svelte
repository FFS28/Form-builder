<script>
	import Breadcrumbs from './global/Breadcrumbs.svelte';
	import { programBreadcrumbs } from '$repositories/breadcrumbsRepository';

	export let title;
	export let titleSuffix;
</script>

<div class="sticky-element flex flex-wrap">
	<div>
		<Breadcrumbs items={programBreadcrumbs} />
		<div class="flex mt-4">
			<h3 class="text-xl font-bold mr-2">{title}</h3>
			{#if titleSuffix}
				<h3 class="text-xl text-gray-500">{titleSuffix}</h3>
			{/if}
		</div>
	</div>
	<div class="flex items-center">
		<slot />
	</div>
</div>
