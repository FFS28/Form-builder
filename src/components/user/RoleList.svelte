<script>
  import { invalidate } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
  import Delete from 'svelte-material-icons/Delete.svelte';
	import Table from '$components/Table.svelte';
	import IconPlus from 'svelte-material-icons/Plus.svelte';
	import IconDelete from 'svelte-material-icons/Delete.svelte';
	import SearchBar from '$components/SearchBar.svelte';

  import { deleteUserRoleById } from '$services/userService';

	export let roles;

	const dispatch = createEventDispatcher();

	function showRoleForm(roleId = null, idx) {
		dispatch('showModalForm', { roleId: roleId, idx: idx });
	}

	function handleRowClick(row, idx) {
		showRoleForm(row.userRoleId, idx);
	}

	const tableParams = {
		role: 'Loma',
		orgNr: 'Uzņēmumuma reģistrācijas numurs',
		country: 'Valsts',
    dateFrom: 'Datums no',
    dateTo: 'Datums līdz'
	};

	const rowActions = [
    { actionParam: 'userRoleId', actionMethod: deleteUserRole, icon: Delete, iconColor: '#870515' }
  ];

	async function deleteUserRole(roleId, _, idx) {
	  if (!confirm('Vai tiešām vēlaties dzēst lomu?')) {
      return;
    }

    if (!roleId) {
      roles.splice(idx, 1);
    } else {
      const { success } = await deleteUserRoleById(roleId);

      if (!success) {
        return alert('Lomas dzēšana neizdevās!');
      }
    }


    dispatch('rolesUpdated');
	}

  let isLoading = false;

</script>

<div class="flex items-center mb-4">
	<button class="btn btn-secondary flex items-center" on:click={() => showRoleForm()}>
		<span class="mr-2"><IconPlus /></span> Pievienot
	</button>
</div>

<Table data={roles} rowClickAction={handleRowClick} {tableParams} {rowActions} />

<style>
</style>
