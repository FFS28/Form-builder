<script>
	import { goto } from '$app/navigation';

	import Table from '$components/Table.svelte';
	import PageHeader from '$components/PageHeader.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import Pagination from '$components/Pagination.svelte';
	import PaginationHeader from '$components/PaginationHeader.svelte';
	import { getContests } from '$services/contestService';
	import { SearchFilters } from '$structures/searchFilters';
	import { Program } from '$structures/program/program';
	import { readableDate } from '$lib/helpers';
	import { onMount } from 'svelte';
	import {Contest} from "$structures/contest/contest.js";

	export let data;

	// PageHeader
	const pageHeader = {
		title: 'MAP konkursi'
	};

	// Table
	const tableParams = {
		name: 'Nosaukums',
		number: 'Konkursa numurs',
		totalFinancing: 'Finansējums',
		maxFinancing: 'Maksimālais finansējums',
		programName: 'Programma',
		publishingTime: 'Izsludināšana',
		submissionTime: 'Pieteikuma iesniegšana',
		statusName: 'Statuss'
	};

	let isLoading = false;

	const searchFilters = new SearchFilters();
	searchFilters.setTotalPages(data.totalCount);

	async function getPaginatedContest({ page, perPage, searchTerm, sorting }) {
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

		const { success, contests, totalCount } = await getContests(
			searchFilters.formatParams()
		);

		if (!success) {
			return alert('Neizdevās atlasīt programmu konkursus!');
		}

		isLoading = false;

		data.contests = contests.map((contest) => {
			contest.publishingTime = readableDate(contest.publishingTime, true);
			contest.submissionTime = readableDate(contest.submissionTime, true);
			return contest
		});

		searchFilters.setTotalPages(totalCount);
	}

	const onColumnSort = async ({ sortColumn, isAscending }) => {
		const fieldName = Program.getFieldNameFromKey(sortColumn);

		await getPaginatedContest({ sorting: { fieldName, isAscending } });
	};

	function handleRowClick(row) {
		goto('/manager/contest/' + row.contestId);
	}

	onMount(() => {
		data.contests = data.contests.map((c) => Contest.fromArray(c)).map((contest) => {
			contest.publishingTime = readableDate(contest.publishingTime, true);
			contest.submissionTime = readableDate(contest.submissionTime, true);
			return contest
		});
	});
</script>

<PageHeader {...pageHeader} />

<div class="m-4">
	<div class="mb-3 flex justify-between">
		<SearchBar
			width={230}
			on:search={({ detail }) => getPaginatedContest({ searchTerm: detail })}
		/>
		<PaginationHeader
      bind:paginationParams={searchFilters.pagination}
      on:changePageSize={({ detail }) => getPaginatedContest({ perPage: detail })}
    />
	</div>

	{#if isLoading}
		<p>Ielādē konkursus...</p>
	{:else if data.contests.length}
		<div class="overflow-x-auto">
			<Table
				data={data.contests}
				{tableParams}
				on:sortColumn={({ detail }) => onColumnSort(detail)}
				rowClickAction={handleRowClick}
			/>
		</div>

		{#if searchFilters.pagination.totalPages > 1}
			<div class="mt-3">
				<Pagination
					on:pageChanged={({ detail: { page } }) => getPaginatedContest({ page })}
					bind:paginationParams={searchFilters.pagination}
				/>
			</div>
		{/if}
	{:else}
		<p>Netika atrasts neviens konkurss</p>
	{/if}
</div>
