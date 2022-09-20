<script>
	import { goto } from '$app/navigation';

	import Table from '$components/Table.svelte';
	import PageHeader from '$components/PageHeader.svelte';
	import IconPlus from 'svelte-material-icons/Plus.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import Pagination from '$components/Pagination.svelte';
	import PaginationHeader from '$components/PaginationHeader.svelte';
	import { getPrograms } from '$services/programService';
	import { SearchFilters } from '$structures/searchFilters';
	import { Program } from '$structures/program/program';
	import {onMount} from "svelte";

	export let data;

	// PageHeader
	const pageHeader = {
		title: 'Mērķa atbalsta programmas'
	};

	// Table
	const tableParams = {
		name: 'Nosaukums',
		status: 'Statuss',
		financingAmount: 'Programmas finansējums, EUR',
		remainingFinancing: 'Atlikušais programmas finansējums, EUR',
		maxFinancing: 'Maksimālais projekta finansējums, EUR',
		periodFrom: 'Darbības periods no',
		periodTo: 'Darbības periods līdz'
	};

	function handleRowClick(row) {
		goto('/manager/program/' + row.programId);
	}

	let isLoading = false;

	onMount(() => {
		data.programs = data.programs.map((p) => Program.fromArray(p));
	})

	const searchFilters = new SearchFilters();
	searchFilters.setTotalPages(data.totalCount);

	async function getPaginatedPrograms({ page, perPage, searchTerm, sorting }) {
		if (page) {
			searchFilters.pagination.currentPage = page;
		}

		if (perPage) {
			searchFilters.pagination.currentPage = 1;
			searchFilters.pagination.perPage = perPage;
		}

		if (searchTerm) {
			searchFilters.pagination.currentPage = 1;
		}

		if (sorting) {
			searchFilters.sorting.fieldName = sorting.fieldName;
			searchFilters.sorting.isAscending = sorting.isAscending;
		}

		searchFilters.searchTerm = searchTerm;

		isLoading = true;

		const { success, programs, totalCount } = await getPrograms(
			searchFilters.formatParams()
		);

		if (!success) {
			return alert('Neizdevās atlasīt programmas!');
		}

		isLoading = false;

		data.programs = programs.map((p) => Program.fromArray(p));
		searchFilters.setTotalPages(totalCount);
	}

	const onColumnSort = async ({ sortColumn, isAscending }) => {
		const fieldName = Program.getFieldNameFromKey(sortColumn);

		await getPaginatedPrograms({ sorting: { fieldName, isAscending } });
	};
</script>

<PageHeader {...pageHeader}>
	<a href="/manager/program/add" class="btn btn-secondary flex items-center">
		<span class="mr-2"><IconPlus /></span>
		Pievienot
	</a>
</PageHeader>

<div class="m-4">
	<div class="mb-3 flex justify-between">
		<SearchBar
			width={230}
			on:search={({ detail }) => getPaginatedPrograms({ searchTerm: detail })}
		/>
		<PaginationHeader
		  bind:paginationParams={searchFilters.pagination}
		  on:changePageSize={({ detail }) => getPaginatedPrograms({ perPage: detail })}
		/>
	</div>

	{#if isLoading}
		<p>Ielādē programmas...</p>
	{:else if !data.programs.length}
		<p>Netika atrasta neviena programa</p>
	{:else}
		<div class="overflow-x-auto">
			<Table
				data={data.programs}
				{tableParams}
				rowClickAction={handleRowClick}
				on:sortColumn={({ detail }) => onColumnSort(detail)}
			/>
		</div>

		{#if searchFilters.pagination.totalPages > 1}
			<div class="mt-3">
				<Pagination
					on:pageChanged={({ detail: { page } }) => getPaginatedPrograms({ page })}
					bind:paginationParams={searchFilters.pagination}
				/>
			</div>
		{/if}
	{/if}
</div>
