<script>
	import { getPublicPrograms } from '$services/programService';
	import { getPublicContests } from '$services/contestService';
	import { onMount } from 'svelte';

	let programs = null;
	let contests = null;
	let programsToDisplay = null;
	let contestsToDisplay = null;

	onMount(async () => {
		const programsData = await getPublicPrograms('');
		programs = programsData.data;
		if (programs && programs.length) {
			programsToDisplay = programsData.data.slice(0, 4);
		}

		const contestsData = await getPublicContests('');
		contests = contestsData.data;
		if (contests && contests.length) {
			contestsToDisplay = contestsData.data.slice(0, 4);
		}
	});
</script>

<div class="mt-16 w-2/3 mx-auto grid md:grid-cols-2 grid-cols-1 gap-6 z-1 mb-16 cards">
	<div class="card w-50">
		<h2 class="text-xl mb-4">Jaunākās programmas</h2>
		{#if programs && programs.length}
			<ul class="list-disc ml-3">
				{#each programsToDisplay as program}
					<li><a href="/programs/{program.id}">{program.nosaukums}</a></li>
				{/each}
			</ul>
			<a href="/programs" class="btn btn-secondary mt-5">Skatīt visus ({programs.length})</a>
		{/if}
	</div>

	<div class="card w-50">
		<h2 class="text-xl mb-4">Jaunākie konkursi</h2>
		{#if contests && contests.length}
			<ul class="list-disc ml-3">
				{#each contestsToDisplay as contest}
					<li><a href="/contests/{contest.id}">{contest.nosaukums}</a></li>
				{/each}
			</ul>
			<a href="/contests" class="btn btn-secondary mt-5">Skatīt visus ({contests.length})</a>
		{/if}
	</div>
</div>

<style>
	.card {
		padding: 1rem;
		border: 1px solid lightgray;
		border-radius: 0.25rem;
		background: white;
		min-height: 200px;
	}

	.cards::before {
		background-color: var(--red);
		height: 200px;
		width: 100%;
		left: 0;
		margin-top: 100px;
		position: absolute;
		z-index: -1;
		content: '';
	}
</style>
