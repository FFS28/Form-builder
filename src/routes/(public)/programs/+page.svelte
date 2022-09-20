<script>
	import DatePicker from '$components/global/form/DatePicker.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import Breadcrumbs from '$components/public/Breadcrumbs.svelte';
	import ItemCard from '$components/public/ItemCard.svelte';
	import { getPublicPrograms } from '$services/programService';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import FormSelectDropdown from '$components/global/form/FormSelectDropdown.svelte';

	let breadcrumbs = [
		{
			href: '/',
			label: 'Sākums'
		},
		{
			href: '/programs',
			label: 'Programmas'
		}
	];
	let title = 'Programmas';

	let statusItems = ['Publicēts', 'Pārtraukts', 'Atcelts', 'Vērtēšanā', 'Projektu īstenošana'];

	let status;
	let fromDate;
	let toDate;
	let searchTerm;
	let programs;
	let originalPrograms;
	let expandedSearch = false;
	let sortBy;

	$: programs;

	let sort = [
		'Alfabētiski (a-z)',
		'Alfabētiski (z-a)',
		'Datums (jaunākais-vecākais)',
		'Datums (vecākais-jaunākais)'
	];

	onMount(async () => {
		const { data } = await getPublicPrograms('');
		programs = data;
		originalPrograms = JSON.parse(JSON.stringify(data));
		sortPrograms();
		const url = new URL(window.location);
		if (
			url.searchParams.get('status') ||
			url.searchParams.get('fromDate') ||
			url.searchParams.get('toDate') ||
			url.searchParams.get('searchTerm')
		) {
			expandedSearch = true;
			status = url.searchParams.get('status');
			fromDate = url.searchParams.get('fromDate')
				? new Date(url.searchParams.get('fromDate'))
				: null;
			toDate = url.searchParams.get('toDate') ? new Date(url.searchParams.get('toDate')) : null;
			searchTerm = url.searchParams.get('searchTerm');
			filterPrograms();
		}
	});

	function filterPrograms(clear = false) {
		programs = JSON.parse(JSON.stringify(originalPrograms));

		const url = new URL(window.location);

		if (clear) {
			status = null;
			fromDate = null;
			toDate = null;
			searchTerm = null;
			url.searchParams.delete('status');
			url.searchParams.delete('fromDate');
			url.searchParams.delete('toDate');
			url.searchParams.delete('searchTerm');
			goto(url, { replaceState: true });
			return;
		}

		if (status) {
			programs = programs.filter((program) => program.statuss === status);
			url.searchParams.set('status', status);
		}
		if (searchTerm) {
			programs = programs.filter((program) =>
				program.nosaukums.toLowerCase().includes(searchTerm.toLowerCase())
			);
			url.searchParams.set('searchTerm', searchTerm);
		}
		if (fromDate) {
			programs = programs.filter((program) => new Date(program.sakuma_datums) >= fromDate);
			url.searchParams.set('fromDate', new Date(fromDate).toISOString().split('T')[0]);
		}
		if (toDate) {
			programs = programs.filter((program) => new Date(program.beigu_datums) <= toDate);
			url.searchParams.set('toDate', new Date(toDate).toISOString().split('T')[0]);
		}

		goto(url, { replaceState: true });

		if (!status && !searchTerm && !fromDate && !toDate) {
			programs = originalPrograms;
		}

		programs = [...programs];
	}

	let filtersActive;
	$: filtersActive = status || searchTerm || fromDate || toDate;

	function sortPrograms() {
		switch (sortBy) {
			case 'Alfabētiski (a-z)':
				programs.sort((a, b) => a.nosaukums.localeCompare(b.nosaukums));
				programs = [...programs];
				break;
			case 'Alfabētiski (z-a)':
				programs.sort((a, b) => b.nosaukums.localeCompare(a.nosaukums));
				programs = [...programs];
				break;
			case 'Datums (jaunākais-vecākais)':
				programs.sort((a, b) => new Date(b.sakuma_datums) - new Date(a.sakuma_datums));
				programs = [...programs];
				break;
			case 'Datums (vecākais-jaunākais)':
				programs.sort((a, b) => new Date(a.sakuma_datums) - new Date(b.sakuma_datums));
				programs = [...programs];
				break;
			default:
				programs.sort((a, b) => {
					if (a.ir_aktivie_konkursi && !b.ir_aktivie_konkursi) {
						return -1;
					}
					if (!a.ir_aktivie_konkursi && b.ir_aktivie_konkursi) {
						return 1;
					}
					if (new Date(b.sakuma_datums) - new Date(a.sakuma_datums)) {
						return -1;
					}
				});
				programs = [...programs];
				break;
		}
	}
</script>

<Breadcrumbs {breadcrumbs} {title} />

<div class="py-10 relative z-1">
	<form
		class="bg-white relative flex mx-auto container p-5 border-[1px] border-slate-200 border-solid rounded box-shadow items-center flex-wrap"
		on:submit|preventDefault={() => filterPrograms(false)}
	>
		{#if filtersActive}
			<div class="clear__filters">
				<button
					class="pointer absolute top-3 right-5"
					type="button"
					on:click={() => filterPrograms(true)}
				>
					&#x2715; Nodzēst filtrus
				</button>
			</div>
		{/if}
		<div class="flex-1 mr-3">
			<FormInput name="search" label="Atslēgas vārds(i)" bind:value={searchTerm} />
		</div>
		<div class="mt-7">
			<button class="btn btn-secondary" type="submit">Atlasīt</button>
		</div>
		<button class="mt-7 ml-2 pointer" on:click={() => (expandedSearch = !expandedSearch)}>
			Izvērstā meklēšana
		</button>

		{#if expandedSearch}
			<div class="search__expanded w-full flex mt-3">
				<div class="mr-3">
					<FormSelectDropdown label="Statuss" items={statusItems} bind:selectedItem={status} />
				</div>
				<div class="mr-3">
					<label for="dates" class="font-bold mb-1.5 block">Darbības periods</label>
					<div class="flex gap-3 items-stretch" id="dates">
						<DatePicker bind:value={fromDate} />
						<DatePicker bind:value={toDate} />
					</div>
				</div>
			</div>
		{/if}
	</form>
</div>

<div class="bg-white py-[100px] -mt-[90px] flex-1">
	<div class="container mx-auto">
		<div class="flex mb-5 text-right">
			<div class="w-[270px] ml-auto flex gap-3 align-center justify-center items-center">
				<label class="font-bold mt-1" for="sort">Kārtot</label>
				<FormSelectDropdown
					label=""
					items={sort}
					bind:selectedItem={sortBy}
					on:selected={sortPrograms}
				/>
			</div>
		</div>

		{#if programs && programs.length}
			{#each programs as program, index (program.id)}
				<ItemCard {program} />
			{/each}
		{:else}
			<p>Nekas netika atrasts.</p>
		{/if}
	</div>
</div>
