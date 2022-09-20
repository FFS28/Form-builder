<script>
	import { goto, invalidate } from '$app/navigation';

	import Table from '$components/Table.svelte';
	import PageHeader from '$components/PageHeader.svelte';
	import IconPlus from 'svelte-material-icons/Plus.svelte';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import Pagination from '$components/Pagination.svelte';
	import PaginationHeader from '$components/PaginationHeader.svelte';
	import { deleteUserById, getUsers } from '$services/userService';
	import { SearchFilters } from '$structures/searchFilters';
	import { User } from '$structures/user/user';
	import {onMount} from "svelte";

	export let data;

	// PageHeader
	const pageHeader = {
		title: 'Lietotāji'
	};

	// Table
	const tableParams = {
		name: 'Vārds',
		surname: 'Uzvārds',
		email: 'E-pasts',
		phoneNr: 'Tālrunis',
		isActive: 'Ir aktīvs'
	};

	function handleRowClick(row) {
		goto('/manager/users/' + row.userId);
	}

	const deleteUser = async (userId) => {
		if (!confirm('Vai tiešām vēlaties dzēst lietotāju?')) {
			return;
		}

		const { success } = await deleteUserById(userId);

		if (!success) {
			return alert('Neizdevās izdzēst lietotāju!');
		}

		await invalidate('/manager/users/list');
	};

	let isLoading = false;

	onMount(() => {
		data.users = data.users.map((u) => User.fromArray(u))
	});

	const rowActions = [
		{ actionParam: 'userId', actionMethod: deleteUser, icon: Delete, iconColor: '#870515' }
	];

	const searchFilters = new SearchFilters();
	searchFilters.setTotalPages(data.totalCount);

	async function getPaginatedUsers({ page, perPage, searchTerm, sorting }) {
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

		const { users, totalCount } = await getUsers(searchFilters.formatParams());

		isLoading = false;

		data.users = users.map((u) => User.fromArray(u));
		searchFilters.setTotalPages(totalCount);
	}

	const onColumnSort = async ({ sortColumn, isAscending }) => {
		const fieldName = User.getFieldNameFromKey(sortColumn);

		await getPaginatedUsers({ sorting: { fieldName, isAscending } });
	};
</script>

<PageHeader {...pageHeader}>
	<a href="/manager/users/add" class="btn btn-secondary flex items-center">
		<span class="mr-2"><IconPlus /></span>
		Pievienot
	</a>
</PageHeader>

<div class="m-4">
	<div class="mb-3 flex justify-between">
		<SearchBar width={230} on:search={({ detail }) => getPaginatedUsers({ searchTerm: detail })} />
		<PaginationHeader
		  bind:paginationParams={searchFilters.pagination}
		  on:changePageSize={({ detail }) => getPaginatedUsers({ perPage: detail })}
		/>
	</div>

	{#if isLoading}
		<p>Ielādē Lietotājus...</p>
	{:else}
		<div class="overflow-x-auto">
			<Table
				data={data.users}
				{tableParams}
				rowClickAction={handleRowClick}
				{rowActions}
				on:sortColumn={({ detail }) => onColumnSort(detail)}
			/>
			<!--
				// Table can have parameter cellColoring that specifies how cells should be colored, for example:

				cellColoring={[
				{
					cell: 'userId',
					value: 3421141,
					classes: 'text-red-900'
				},
				{
					cell: 'name',
					value: 'Baiba',
					classes: 'text-green-900 bg-red-100'
				}
			]} -->
		</div>

		{#if searchFilters.pagination.totalPages > 1}
			<div class="mt-3">
				<Pagination
					on:pageChanged={({ detail: { page } }) => getPaginatedUsers({ page })}
					bind:paginationParams={searchFilters.pagination}
				/>
			</div>
		{/if}
	{/if}
</div>
