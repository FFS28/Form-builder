<script>
  import { invalidate } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
  import Delete from 'svelte-material-icons/Delete.svelte';
	import Table from '$components/Table.svelte';
	import IconPlus from 'svelte-material-icons/Plus.svelte';
	import IconDelete from 'svelte-material-icons/Delete.svelte';
	import SearchBar from '$components/SearchBar.svelte';
  import { deleteUserOrgById } from '$services/userService';

	export let orgs;

	const dispatch = createEventDispatcher();

	function showOrgForm(orgId = null) {
		dispatch('showModalForm', orgId);
	}

	function handleRowClick(row) {
		showOrgForm(row.userOrgId);
	}

	const tableParams = {
		regNr: 'Reģistrācijas numurs',
		title: 'Uzņēmumuma nosaukums',
    dateFrom: 'Datums no',
    dateTo: 'Datums līdz'
	};

	const rowActions = [
    { actionParam: 'userOrgId', actionMethod: deleteUserOrg, icon: Delete, iconColor: '#870515' }
  ];

	async function deleteUserOrg(roleId) {
	  if (!confirm('Vai tiešām vēlaties dzēst uzņēmumu?')) {
      return;
    }

		const { success } = await deleteUserOrgById(roleId);

    if (!success) {
      return alert('Uzņēmuma dzēšana neizdevās!');
    }

    dispatch('orgsUpdated');
	}

  let isLoading = false;

</script>

<div class="flex items-center mb-4">
	<button class="btn btn-secondary flex items-center" on:click={() => showOrgForm()}>
		<span class="mr-2"><IconPlus /></span> Pievienot
	</button>
</div>

<Table data={orgs} rowClickAction={handleRowClick} {tableParams} {rowActions} />

<style>
</style>
