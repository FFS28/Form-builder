<script>
	import PageHeader from '$components/PageHeader.svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import IconCheckAll from 'svelte-material-icons/CheckAll.svelte';
	import IconTrashCan from 'svelte-material-icons/TrashCan.svelte';
	import { Contest } from '$structures/contest/contest';
	import ContestForm from '$components/contest/Form.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {onMount} from "svelte";

	const returnURL = $page.url.searchParams.get('returnURL')
		? $page.url.searchParams.get('returnURL')
		: '/manager/contest/list';

	export let data;

	let contest = new Contest()
	let statusFormVisible = false;
	let pageHeader;

	onMount(() => {
		contest = Contest.fromArray(data.contestData);
	})

	$: pageHeader = {
		title: contest.name,
		titleSuffix: `(${contest.statusName})`
	};

	let saveContest;
	let deleteContest;
	let publishContest;
	let contestChanged;

	function closeForm() {
		if (contestChanged && confirm('Vai tiešām vēlaties aizvērt konkursu bez saglabāšanas?')) {
			goto(returnURL);
		} else if (!contestChanged) {
			goto(returnURL);
		}
	}

	$: showDeleteButton = () => {
		return contest && contest.contestId && contest.isDraft();
	};

	$: showChangeStatusButton = () => {
		return (
			contest.contestId &&
			(contest.statusName === 'Izsludināts' ||
				contest.statusName === 'Pārtraukts' ||
				contest.statusName === 'Atcelts' ||
				contest.statusName === 'Vērtēšanā')
		);
	};
</script>

<PageHeader {...pageHeader}>
	<button class="btn" on:click={closeForm}>Aizvērt</button>
	<button class="btn btn-primary flex items-center mx-4" on:click={saveContest}>
		<IconCheckBold />
		<span class="ml-2">Saglabāt</span>
	</button>
	{#if contest.isDraft()}
		<button class="btn btn-primary flex items-center mr-4" on:click={publishContest(true)}>
			<IconCheckAll />
			<span class="ml-2">Publicēt</span>
		</button>
	{/if}
	{#if showChangeStatusButton()}
		<button
			class="btn btn-primary flex items-center mr-4"
			on:click={() => (statusFormVisible = true)}
		>
			Mainīt statusu
		</button>
	{/if}

	{#if showDeleteButton()}
		<button class="btn btn-danger flex items-center mr-4" on:click={deleteContest}>
			<IconTrashCan />
			<span class="ml-2">Dzēst</span>
		</button>
	{/if}
</PageHeader>

<div class="m-4">
	<ContestForm
		selectedContestId={contest.contestId}
		programId={contest.programId}
		openAsDrawer={false}
		bind:contest
		bind:saveProgramContest={saveContest}
		bind:publishProgramContest={publishContest}
		bind:deleteProgramContest={deleteContest}
		bind:contestChanged
		bind:statusFormVisible
	/>
</div>
