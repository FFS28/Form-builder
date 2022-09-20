<script>
	import { goto, invalidate } from '$app/navigation';

	import Table from '$components/Table.svelte';
	import PageHeader from '$components/PageHeader.svelte';
	import IconPlus from 'svelte-material-icons/Plus.svelte';
	import { SearchFilters } from '$structures/searchFilters.js';
	import { getRoleList } from '$services/roleService.js';
	import Pagination from '$components/Pagination.svelte';
	import Drawer from '$components/Drawer.svelte';
	import RoleForm from '$components/roles/roleForm.svelte';
	import PaginationHeader from '$components/PaginationHeader.svelte';

	export let data;

	let isLoading = false;
	let isDrawerOpen = false;
	let selectedRole = null;
	let editMode = true;

	// PageHeader
	const pageHeader = {
		title: 'Lietotāju lomas'
	};

	// Table
	const tableParams = {
		nosaukums: 'Nosaukums',
		kods: 'Kods'
	};

	function handleRowClick(row) {
		isDrawerOpen = true;
		selectedRole = row;
		editMode = true;
	}

	const searchFilters = new SearchFilters();
	searchFilters.setTotalPages(data.totalCount);

	async function getPaginatedRoles({ page, perPage, searchTerm, sorting }) {
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
			searchFilters.sorting.fieldName = sorting.sortColumn;
			searchFilters.sorting.isAscending = sorting.isAscending;
		}

		searchFilters.searchTerm = searchTerm;

		isLoading = true;

		const { roles, totalCount } = await getRoleList(searchFilters.formatParams());

		isLoading = false;
		data.roles = roles;
		searchFilters.setTotalPages(totalCount);
	}

	const onColumnSort = async ({ sortColumn, isAscending }) => {
		await getPaginatedRoles({ sorting: { sortColumn, isAscending } });
	};

	async function closeModalForm() {
		isDrawerOpen = false;
		selectedRole = null;
		await invalidate(`/manager/roles/list`);
	}
</script>

<PageHeader {...pageHeader}>
	<button
		on:click={() => {
			selectedRole = {};
			editMode = false;
			isDrawerOpen = true;
		}}
		class="btn btn-secondary flex items-center"
	>
		<span class="mr-2"><IconPlus /></span>
		Pievienot
	</button>
</PageHeader>

<div class="m-4">
	<div class="mb-3 flex justify-between">
		<PaginationHeader
			bind:paginationParams={searchFilters.pagination}
			on:changePageSize={({ detail }) => getPaginatedRoles({ perPage: detail })}
		/>
	</div>
	{#if isLoading}
		<p>Ielādē lietotāju lomas...</p>
	{:else}
		<div class="overflow-x-auto">
			<Table
				data={data.roles}
				{tableParams}
				rowClickAction={handleRowClick}
				on:sortColumn={({ detail }) => onColumnSort(detail)}
			/>
		</div>

		{#if searchFilters.pagination.totalPages > 1}
			<div class="mt-3">
				<Pagination
					on:pageChanged={({ detail: { page } }) => getPaginatedRoles({ page })}
					bind:paginationParams={searchFilters.pagination}
				/>
			</div>
		{/if}
	{/if}
</div>

<Drawer navWidth={65} bind:show={isDrawerOpen} on:close={() => closeModalForm()}>
	<RoleForm {selectedRole} {editMode} on:closeDrawer={() => closeModalForm()} />
</Drawer>
