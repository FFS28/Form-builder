<script>
	import Breadcrumbs from '$components/public/Breadcrumbs.svelte';
	import { formatDate } from '$lib/helpers';
	import { onMount } from 'svelte';
	import IconChevronLeft from 'svelte-material-icons/ChevronLeft.svelte';
	import ItemCard from '$components/public/ItemCard.svelte';

	export let data;

	let program = null;
	let breadcrumbs = null;

	let activeTab = 'target';
	let activeTabClasses = 'bg-white border-t border-r border-l -mb-px';

	let tabs = [];

	$: tabs;

	onMount(async () => {
		program = data.programData;

		// if (program.konkursi) {
		// 	program.konkursi.map((contest) => {
		// 		contest.programmas_nosaukums = program.nosaukums;
		// 	});
		// }

		breadcrumbs = [
			{
				href: '/',
				label: 'Sākums'
			},
			{
				href: '/programs',
				label: 'Programmas'
			},
			{ href: '/programs/' + program.id, label: program.nosaukums }
		];

		tabs = [
			{ name: 'target', title: 'Programmas mērķis' },
			{ name: 'targetGroup', title: 'Programmas mērķa grupa' },
			{ name: 'files', title: `Datnes (${program.pielikumi?.length || 0})` },
			{ name: 'contests', title: `Konkursi (${program.konkursi?.length || 0})` }
		];
	});
</script>

{#if program && program.id}
	<Breadcrumbs {breadcrumbs} title={program.nosaukums} />

	<div class="mt-5 bg-white flex-1">
		<div class="container flex flex-col py-2  mx-auto">
			<button on:click={() => history.back()} class="flex items-center mt-3 pointer"
				><IconChevronLeft size="18" /> Atpakaļ</button
			>

			<div class="program my-6">
				<div class="grid grid-cols-4 gap-3">
					<div class="program__item">
						<strong class="block">Programmas numurs</strong>
						<span>{program.numurs ? program.numurs : ''}</span>
					</div>
					<div class="program__item">
						<strong class="block">EK piešķirtais programmas numurs</strong>
						<span>{program.ek_numurs ? program.ek_numurs : ''}</span>
					</div>
					<div class="program__item">
						<strong class="block">Darbības periods</strong>
						<span>{formatDate(program.sakuma_datums)} līdz {formatDate(program.beigu_datums)}</span>
					</div>

					<div class="program__item">
						<strong class="block">Statuss</strong>
						<span class="item__tag">{program.statuss == 'Publicēts' ? 'Aktīvs' : ''}</span>
					</div>
				</div>

				<h4 class="uppercase text-l font-bold my-3">Programmas finansējums</h4>

				<div class="program__item">
					<strong class="block">Avots</strong>
					<span>{program.kla_finansejuma_avots_nosaukums}</span>
				</div>

				<div class="grid grid-cols-3 mt-3 gap-3">
					<div class="program__item">
						<strong class="block">Kopējais</strong>
						<span>€ {program.finansejums}</span>
					</div>
					<div class="program__item">
						<strong class="block">Atlicis</strong>
						<span>€ {program.faktiskais_finansejuma_atlikums}</span>
					</div>
				</div>

				<div class="border-b mt-10">
					<ul class="inline-flex w-full">
						{#each tabs as tab}
							<li
								class="px-4 text-black py-2 rounded-t cursor-pointer {activeTab === tab.name
									? activeTabClasses
									: ''}"
								on:click={() => (activeTab = tab.name)}
							>
								{tab.title}
							</li>
						{/each}
					</ul>
				</div>

				<div class="mb-4 pt-4 bg-white">
					{#if activeTab === 'target'}
						<div class="wysiwyg">{@html program.merkis}</div>
					{/if}
					{#if activeTab === 'targetGroup'}
						<div class="wysiwyg">{@html program.merka_grupa}</div>
					{/if}
					{#if activeTab === 'files'}
						<div>
							<ul>
								{#each program.pielikumi as file}
									<li>
										<a href="/api/file/download?id={file.id}&hash={file.sha_256}" target="_blank"
											>{file.apraksts}</a
										>
									</li>{/each}
							</ul>
						</div>
					{/if}
					{#if activeTab === 'contests'}
						<div>
							{#each program.konkursi as contest, index (contest.id)}
								<ItemCard {contest} />
							{/each}
							<!-- <ul>
								{#each program.konkursi as contest}
									<li>
										<a href="/contests/{contest.id}">{contest.nosaukums}</a>
									</li>{/each}
							</ul> -->
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="container flex mx-auto">
		<p class="py-4">Programma netika atrasta.</p>
	</div>
{/if}
