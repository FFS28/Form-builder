<script>
	import { goto } from '$app/navigation';
	import DatePicker from '$components/global/form/DatePicker.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import FormSelectDropdown from '$components/global/form/FormSelectDropdown.svelte';
	import Pagination from '$components/Pagination.svelte';
	import Breadcrumbs from '$components/public/Breadcrumbs.svelte';
	import ItemCard from '$components/public/ItemCard.svelte';
	import { getPublicContests } from '$services/contestService';
	import { SearchFilters } from '$structures/searchFilters';
	import { onMount } from 'svelte';

	let breadcrumbs = [
		{
			href: '/',
			label: 'Sākums'
		},
		{
			href: '/contests',
			label: 'Konkursi'
		}
	];
	let title = 'Konkursi';

	let query;

	const searchFilters = new SearchFilters();

	let statusItems = [
		'Izsludināts'
		// { value: 'consideration', name: 'Vērtēšanā' }
		// Not sure what statuses are there
		// { value: 'Neaktīvs', name: 'Neaktīvs'},
		// { value: 'Bloķēts', name: 'Bloķēts'},
	];

	let status;
	let publicationDate;
	let submissionDate;
	let searchTerm;
	let contests;
	let originalContests;
	let programs = [];
	let program;
	let expandedSearch = false;
	let sortBy;
	let applicantType = '';

	$: contests;
	$: programs;

	let sort = [
		'Alfabētiski (a-z)',
		'Alfabētiski (z-a)',
		'Datums (jaunākais-vecākais)',
		'Datums (vecākais-jaunākais)'
	];

	let applicantItems = [];

	onMount(async () => {
		const { data } = await getPublicContests('?limit=20');
		contests = data;
		originalContests = JSON.parse(JSON.stringify(data));

		if (contests && contests.length) {
			sortContests();
			contests.forEach((contest) => {
				programs.push([contest.programmas_nosaukums]);
			});
		}

		programs = [...programs];

		const url = new URL(window.location);
		if (
			url.searchParams.get('program') ||
			url.searchParams.get('status') ||
			url.searchParams.get('publicationDate') ||
			url.searchParams.get('submissionDate') ||
			url.searchParams.get('searchTerm')
		) {
			expandedSearch = true;
			program = url.searchParams.get('program');
			status = url.searchParams.get('status');
			publicationDate = url.searchParams.get('publicationDate')
				? new Date(url.searchParams.get('publicationDate'))
				: null;
			submissionDate = url.searchParams.get('submissionDate')
				? new Date(url.searchParams.get('submissionDate'))
				: null;
			searchTerm = url.searchParams.get('searchTerm');
			filterContests(false);
		}
	});

	let filtersActive;
	$: filtersActive = program || status || searchTerm || publicationDate || submissionDate;

	async function filterContests(clear = false) {
		contests = JSON.parse(JSON.stringify(originalContests));

		const url = new URL(window.location);

		if (clear) {
			program = null;
			status = null;
			publicationDate = null;
			submissionDate = null;
			searchTerm = null;
			url.searchParams.delete('program');
			url.searchParams.delete('status');
			url.searchParams.delete('publicationDate');
			url.searchParams.delete('submissionDate');
			url.searchParams.delete('searchTerm');
			goto(url, { replaceState: true });
			return;
		}

		query = new URLSearchParams();

		if (program) {
			contests = contests.filter((contest) => contest.programmas_nosaukums == program);
			url.searchParams.set('program', program);
		}
		if (status) {
			// contests = contests.filter((contest) => contest.statuss === status);
			query.append('q', status);
			url.searchParams.set('status', status);
		}
		if (searchTerm) {
			// contests = contests.filter((contest) =>
			// 	contest.nosaukums.toLowerCase().includes(searchTerm.toLowerCase())
			// );
			query.append('q', searchTerm);
			url.searchParams.set('searchTerm', searchTerm);
		}
		if (publicationDate) {
			contests = contests.filter(
				(contest) => new Date(contest.izsludinasanas_laiks) >= publicationDate
			);
			url.searchParams.set(
				'publicationDate',
				new Date(publicationDate).toISOString().split('T')[0]
			);
		}
		if (submissionDate) {
			contests = contests.filter(
				(contest) => new Date(contest.iesniegsanas_laiks) >= submissionDate
			);
			url.searchParams.set('submissionDate', new Date(submissionDate).toISOString().split('T')[0]);
		}

		goto(url, { replaceState: true });

		if (!program && !status && !searchTerm && !publicationDate && !submissionDate) {
			contests = await getSearchResults();
		}

		// contests = [...contests];

		await getSearchResults();
	}

	async function getSearchResults() {
		const response = await getPublicContests(`?` + query);
		contests = response.data;
	}

	function sortContests() {
		switch (sortBy) {
			case 'Alfabētiski (a-z)':
				contests.sort((a, b) => a.nosaukums.localeCompare(b.nosaukums));
				contests = [...contests];
				break;
			case 'Alfabētiski (z-a)':
				contests.sort((a, b) => b.nosaukums.localeCompare(a.nosaukums));
				contests = [...contests];
				break;
			case 'Datums (jaunākais-vecākais)':
				contests.sort(
					(a, b) => new Date(b.izsludinasanas_laiks) - new Date(a.izsludinasanas_laiks)
				);
				contests = [...contests];
				break;
			case 'Datums (vecākais-jaunākais)':
				contests.sort(
					(a, b) => new Date(a.izsludinasanas_laiks) - new Date(b.izsludinasanas_laiks)
				);
				contests = [...contests];
				break;
			default:
				break;
		}
	}
</script>

<Breadcrumbs {breadcrumbs} {title} />

<div class="py-10 relative z-1">
	<form
		class="bg-white flex mx-auto container p-5 border-[1px] border-slate-200 border-solid rounded box-shadow flex-wrap items-center relative"
		on:submit|preventDefault={() => filterContests(false)}
	>
		{#if filtersActive}
			<div class="clear__filters">
				<button
					class="pointer absolute top-3 right-5"
					type="button"
					on:click={() => filterContests(true)}
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
				<div class="mr-3 w-full">
					<FormSelectDropdown label="Programma" items={programs} bind:selectedItem={program} />
				</div>
				<div class="mr-3 w-full">
					<FormSelectDropdown
						label="Pieteicēja veids"
						items={applicantItems}
						bind:selectedItem={applicantType}
					/>
				</div>
				<div class="mr-3 w-full">
					<FormSelectDropdown label="Statuss" items={statusItems} bind:selectedItem={status} />
				</div>
				<div class="mr-3">
					<label for="publication" class="font-bold mb-1.5 block">Izsludināšana</label>
					<div class="flex gap-3 items-stretch" id="publication">
						<DatePicker bind:value={publicationDate} />
					</div>
				</div>
				<div class="mr-3">
					<label for="submission" class="font-bold mb-1.5 block">Iesniegšana</label>
					<div class="flex gap-3 items-stretch" id="submission">
						<DatePicker bind:value={submissionDate} />
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
					on:selected={sortContests}
				/>
			</div>
		</div>

		{#if contests && contests.length}
			{#each contests as contest, index (contest.id)}
				<ItemCard {contest} />
			{/each}

			<!-- @TODO: only if total count > items per page -->
			<!-- <div class="mt-3">
				<Pagination
					on:pageChanged={({ detail: { page } }) => searchFilters({ page })}
					bind:paginationParams={searchFilters.pagination}
				/>
			</div> -->
		{:else}
			<p>Nekas netika atrasts.</p>
		{/if}
	</div>
</div>
