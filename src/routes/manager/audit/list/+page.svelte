<script>
	import Table from '$components/Table.svelte';
	import PageHeader from '$components/PageHeader.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import Pagination from '$components/Pagination.svelte';
	import PaginationHeader from '$components/PaginationHeader.svelte';
	import { SearchFilters } from '$structures/searchFilters';
	import { getAudits } from '$services/auditService';
	import { Audit } from '$structures/audit';
	import {onMount} from "svelte";
	import {Codifier} from "$structures/codifier.js";

	export let data;

	// Page header
	const pageHeader = {
		title: 'Audits (Portāls)'
	};

	// Table cols
	let tableParams = {
		fullName: 'Pilns vārds',
		time: 'Pieprasījuma datums / laiks',
		action: 'Veiktā darbība',
		status: 'Darbības rezultāts',
		entity: 'Statijuma nosaukums',
		entityId: 'Skatijuma identifikators',
		ipAddress: 'IP adrese',
		userAgent: 'User agent',
		errorData: 'Kļūda'
	};

	// Loader
	let isLoading = false;

	onMount(() => {
		data.audits = data.audits.map((u) => Audit.fromArray(u))
	});

	// Search params
	let searchFilters = new SearchFilters();
	searchFilters.setTotalPages(data.totalCount);

	async function getPaginatedAudits({ page, perPage, searchTerm, sorting }) {
		if (page) {
			searchFilters.pagination.currentPage = page;
		}

		if (perPage) {
			searchFilters.pagination.currentPage = 1;
			searchFilters.pagination.perPage = perPage;
		}

		if (searchTerm) {
			searchFilters.pagination.currentPage = 1;
			searchFilters.searchTerm = searchTerm;
		}

		if (sorting) {
			searchFilters.sorting.fieldName = sorting.fieldName;
			searchFilters.sorting.isAscending = sorting.isAscending;
		}

		isLoading = true;

		const { audits, totalCount } = await getAudits(searchFilters.formatParams());

		isLoading = false;

		data.audits = audits.map((u) => Audit.fromArray(u))
		searchFilters.setTotalPages(totalCount);
	}

	const onColumnSort = async ({ sortColumn, isAscending }) => {
		const fieldName = Audit.getFieldNameFromKey(sortColumn);

		await getPaginatedAudits({ sorting: { fieldName, isAscending } });
	};
</script>

<PageHeader {...pageHeader} />

<div class="m-4">
	<div class="mb-3 flex justify-between">
		<SearchBar width={230} on:search={({ detail }) => getPaginatedAudits({ searchTerm: detail })} />
		<PaginationHeader
		  bind:paginationParams={searchFilters.pagination}
		  on:changePageSize={({ detail }) => getPaginatedAudits({ perPage: detail })}
		/>
	</div>

	{#if isLoading}
		<p>Ielādē auditus...</p>
	{:else}
		<div class="overflow-x-auto">
			<Table {tableParams} data={data.audits} on:sortColumn={({ detail }) => onColumnSort(detail)} />
		</div>

		{#if searchFilters.pagination.totalPages > 1}
			<div class="mt-3">
				<Pagination
					on:pageChanged={({ detail: { page } }) => getPaginatedAudits({ page })}
					bind:paginationParams={searchFilters.pagination}
				/>
			</div>
		{/if}
	{/if}
</div>
