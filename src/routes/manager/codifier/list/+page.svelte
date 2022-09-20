<script>
	import PageHeader from '$components/PageHeader.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import Table from '$components/Table.svelte';
	import { SearchFilters } from '$structures/searchFilters';
	import { Codifier } from '$structures/codifier';
	import { getCodifier, getCodifiers } from '$services/codifierService.js';
	import CodifierForm from '$components/codifier/codifierForm.svelte';
	import Drawer from '$components/Drawer.svelte';
	import {onMount} from "svelte";

	export let data;
	$: selectedCodifier = null;
	$: codifierFormVisible = false;
	$: selectedCodifierEntry = null;
	$: selectedCodifierId = null;
	$: selectedCodifierTitle = null;
	$: originalCodifierEntries = null;
	$: codifierEntries = null;

	const pageHeader = {
		title: 'Kodifikatori'
	};

	const tableParams = {
		title: 'Nosaukums'
	};

	const codifierEntryTableParams = {
		kods: 'Kods',
		parent_nosaukums: 'Virskodifikators',
		nosaukums: 'Nosaukums'
	};

	// Loader
	let isLoading = false;

	// Search params
	let searchFilters = new SearchFilters();

	onMount(() => {
		data.codifiers = data.codifiers.map((u) => Codifier.fromArray(u))
	});

	async function getFilteredCodifiers({ searchTerm }) {
		searchFilters.searchTerm = searchTerm;

		isLoading = true;

		const { success, filteredCodifiers } = await getCodifiers(searchFilters.formatParams());

		if (!success) {
			return alert('Neizdevās atlasīt auditus!');
		}

		isLoading = false;

		data.codifiers = filteredCodifiers;
	}

	async function getFilteredCodifierEntries({ searchTerm }) {
		if (searchTerm) {
			const results = selectedCodifier['ieraksti'].filter((object) =>
				Object.values(object).some((i) => {
					return String(i).toLowerCase().includes(String(searchTerm).toLowerCase());
				})
			);
			selectedCodifier['ieraksti'] = results;
		} else {
			selectedCodifier['ieraksti'] = originalCodifierEntries;
		}
	}

	async function handleCodifierClick(row) {
		selectedCodifierTitle = row.title;
		selectedCodifierId = row.id;
		const codifier = await getCodifier(row.id);
		selectedCodifier = codifier.data;
		originalCodifierEntries = selectedCodifier['ieraksti'];
	}

	async function refreshCodifierEntries() {
		const codifier = await getCodifier(selectedCodifierId);
		selectedCodifier = codifier.data;
		originalCodifierEntries = selectedCodifier['ieraksti'];
	}

	async function handleCodifierEntryClick(row) {
		selectedCodifierEntry = row;
		codifierEntries = selectedCodifier['ieraksti'];
		codifierFormVisible = true;
	}

	function addCodifierEntry(codifier) {
		selectedCodifierEntry = {};
		selectedCodifierEntry.kla_kodifikators_id = codifier.id;
		selectedCodifierEntry.codifierTitle = codifier.nosaukums;
		codifierEntries = selectedCodifier['ieraksti'];
		codifierFormVisible = true;
	}
</script>

<PageHeader {...pageHeader} />

<div class="m-4">
	{#if isLoading}
		<p>Ielādē kodifikatorus...</p>
	{:else}
		<div class="flex gap-x-4">
			<div class="w-1/2">
				<div class="mb-3 flex justify-between">
					<SearchBar on:search={({ detail }) => getFilteredCodifiers({ searchTerm: detail })} />
				</div>
				<Table {tableParams} data={data.codifiers} rowClickAction={handleCodifierClick} />
			</div>
			{#if selectedCodifier}
				<div class="w-1/2">
					<div class="mb-3 flex justify-between">
						<SearchBar
							on:search={({ detail }) => getFilteredCodifierEntries({ searchTerm: detail })}
						/>
					</div>

					<div class="flex items-center">
						<h1 class="text-xl font-bold ">{selectedCodifierTitle}</h1>
						<button
							class="btn btn-primary flex items-center mb-3 ml-auto"
							on:click={() => addCodifierEntry(selectedCodifier)}
						>
							Pievienot
						</button>
					</div>

					<Table
						tableParams={codifierEntryTableParams}
						bind:data={selectedCodifier.ieraksti}
						rowClickAction={handleCodifierEntryClick}
					/>
				</div>
			{/if}
		</div>
	{/if}

	<Drawer
		navWidth={60}
		bind:show={codifierFormVisible}
		on:close={() => {
			codifierFormVisible = false;
		}}
	>
		<CodifierForm
			codifier={selectedCodifierEntry}
			codifiers={codifierEntries}
			on:hideCodifierForm={async () => {
				await refreshCodifierEntries();
				codifierFormVisible = false;
			}}
		/>
	</Drawer>
</div>
