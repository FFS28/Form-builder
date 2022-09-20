<script>
	import { createEventDispatcher } from 'svelte';
	import Table from '$components/Table.svelte';
	import IconPlus from 'svelte-material-icons/Plus.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import { goto } from '$app/navigation';
	import PopupBanner from '$components/PopupBanner.svelte';

	export let contests;
	export let showSearchbar = false;
	export let programId = null;
	export let canAddContest = true;

	// Popup
	const popup = {
		title: '',
		message: '',
		type: '',
		visible: false
	};

	const dispatch = createEventDispatcher();

	function showContestForm() {
		if (canAddContest) {
			goto(`/manager/contest/new?program=${programId}&returnURL=/manager/program/${programId}`);
		} else {
			popup.visible = true;
			popup.title = 'Konkursu nav iespējams pievienot';
			popup.message = 'Programmas finansējums ir izsmelts/izlietots';
			popup.type = 'error';
		}
	}

	function handleRowClick(row) {
		goto(`/manager/contest/${row.id}?returnURL=/manager/program/${programId}`);
	}

	const tableParams = {
		nosaukums: 'Nosaukums',
		numurs: 'Konkursa numurs',
		kopejais_finansejums: 'Finansējums',
		max_finansejums: 'Maksimālais finansējums',
		izsludinasanas_laiks: 'Izsludināšana',
		iesniegsanas_laiks: 'Pieteikuma iesniegšana',
		statuss_nosaukums: 'Statuss'
	};

	const rowActions = [];
</script>

<div>
	<PopupBanner
		background={true}
		title={popup.title}
		message={popup.message}
		popupType={popup.type}
		showPopup={popup.visible}
	/>
</div>
<div class="flex items-center mb-4">
	<p class="font-bold">Programmas konkursi</p>
	<button class="btn btn-secondary ml-4 flex items-center" on:click={() => showContestForm()}>
		<span class="mr-2"><IconPlus /></span> Pievienot
	</button>
</div>

{#if showSearchbar}
	<div class="mb-3 flex justify-between">
		<SearchBar />
		<div class="flex items-center mr-3">
			Rādīt
			<select id="per-page-limit" name="perPageLimit" class="mx-3 border rounded block w-full p-2">
				<option value={20}>20</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
			</select>
			ierakstus
		</div>
	</div>
{/if}

<Table data={contests} rowClickAction={handleRowClick} {tableParams} {rowActions} />

<style>
</style>
