<script>
	import Breadcrumbs from '$components/public/Breadcrumbs.svelte';
	import { formatDate } from '$lib/helpers';
	import { onMount } from 'svelte';
	import IconChevronLeft from 'svelte-material-icons/ChevronLeft.svelte';

	export let data;

	let contest = null;
	let breadcrumbs = null;

	let activeTab = 'description';
	let activeDescTab = 'target';
	let activeTabClasses = 'bg-white border-t border-r border-l -mb-px';

	let tabs = [];
	let descTabs = [];

	$: tabs;
	$: descTabs;

	onMount(async () => {
		contest = data.contestData;

		breadcrumbs = [
			{
				href: '/',
				label: 'Sākums'
			},
			{
				href: '/contests',
				label: 'Konkursi'
			},
			{ href: '/contests/' + contest.id, label: contest.nosaukums }
		];

		tabs = [
			{ name: 'description', title: 'Apraksts' },
			{ name: 'form', title: 'Pieteikuma forma' },
			{ name: 'budget', title: 'Budžets' },
			{ name: 'criteria', title: 'Kritēriji' },
			{ name: 'files', title: `Datnes (${contest.pielikumi?.length || 0})` }
		];

		descTabs = [
			{ name: 'target', title: 'Mērķis' },
			{ name: 'targetGroup', title: 'Mērķa grupa' },
			{ name: 'applicants', title: 'Pretendenti' },
			{ name: 'expenseAccounting', title: 'Izmaksu attiecināmība' },
			{ name: 'faq', title: 'BUJ' }
		];
	});
</script>

{#if contest && contest.id}
	<Breadcrumbs {breadcrumbs} title={contest.nosaukums} />

	<div class="mt-5 bg-white flex-1">
		<div class="container flex flex-col py-2  mx-auto">
			<button on:click={() => history.back()} class="flex items-center mt-3 pointer"
				><IconChevronLeft size="18" /> Atpakaļ</button
			>

			<div class="contest my-6">
				<div class="contest__details flex">
					<div class="contest__info w-2/3 pr-5">
						<div class="grid grid-cols-4 gap-3">
							<div class="contest__item">
								<strong class="block">Konkursa numurs</strong>
								<span>{contest.numurs ? contest.numurs : ''}</span>
							</div>
							<div class="contest__item">
								<strong class="block">Statuss</strong>
								<span class="item__tag filled">{contest.statuss}</span>
							</div>
						</div>
						<div class="grid grid-cols-4 gap-3 mt-3">
							<div class="contest__item">
								<strong class="block">Darbības periods</strong>
								<span>{formatDate(contest.sakuma_datums)} - {formatDate(contest.beigu_datums)}</span
								>
							</div>

							<div class="contest__item">
								<strong class="block">Izludināšana</strong>
								<span>{formatDate(contest.izsludinasanas_laiks, true)}</span>
							</div>

							<div class="contest__item">
								<strong class="block">Pieteikuma iesniegšana</strong>
								<span>{formatDate(contest.iesniegsanas_laiks, true)}</span>
							</div>
						</div>

						<h4 class="uppercase text-l font-bold my-3">Konkursa finansējums</h4>

						<div class="grid grid-cols-4 mt-3 gap-3">
							<div class="contest__item">
								<strong class="block">Kopējais</strong>
								<span>€ {contest.kopejais_finansejums ? contest.kopejais_finansejums : ''}</span>
							</div>
							<div class="contest__item">
								<strong class="block">Projektiem piešķirtais</strong>
								<span
									>€ {contest.pieskirtais_finansejums ? contest.pieskirtais_finansejums : ''}</span
								>
							</div>
							<div class="contest__item">
								<strong class="block">Projekta minimālais</strong>
								<span>€ {contest.min_finansejums ? contest.min_finansejums : ''}</span>
							</div>
							<div class="contest__item">
								<strong class="block">Projekta maksimālais</strong>
								<span>€ {contest.max_finansejums ? contest.max_finansejums : ''}</span>
							</div>
						</div>
					</div>

					<div class="contest__submission border-l w-1/3">
						<div class="pl-10">
							<a href="/login" class="btn">Pieteikties konkursam</a>
							<strong class="block mt-5">Atbildīgais darbinieks</strong>
							{#each contest.lietotaji as person}
								<span class="block mt-1">{person.vards_uzvards}</span>
								<span class="block mt-1"
									>{@html person.epasts
										? `<a href="mailto:${person.epasts}">${person.epasts}</a>`
										: ''}</span
								>
								<span class="block mt-1">{person.telefons ? person.telefons : ''}</span>
							{/each}
						</div>
					</div>
				</div>

				<div class="contest__item mt-3">
					<strong class="block">Programma</strong>
					<span
						><a href="/programs/{contest.programma_id}" class="text-gray-600 underline"
							>{contest.programmas_nosaukums}</a
						></span
					>
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
					{#if activeTab === 'description'}
						<ul class="inline-flex w-full">
							{#each descTabs as tab}
								<li
									class="px-4 text-black py-2 rounded-t cursor-pointer {activeDescTab === tab.name
										? activeTabClasses
										: ''}"
									on:click={() => (activeDescTab = tab.name)}
								>
									{tab.title}
								</li>
							{/each}
						</ul>
					{/if}

					<div class="mt-2 mx-4">
						{#if activeDescTab == 'target'}
							<div class="wysiwyg">{@html contest.merkis}</div>
						{/if}
						{#if activeDescTab == 'targetGroup'}
							<div class="wysiwyg">{@html contest.merka_grupa}</div>
						{/if}
						{#if activeDescTab == 'faq'}
							<div class="wysiwyg">{@html contest.biezak_uzdotie_jautajumi}</div>
						{/if}
						{#if activeDescTab == 'applicants'}
							<div class="wysiwyg">{@html contest.pretendenti}</div>
						{/if}
						{#if activeDescTab == 'expenseAccounting'}
							<div class="wysiwyg">{@html contest.izdevumu_attiecinamiba}</div>
						{/if}
					</div>

					{#if activeTab === 'form'}
						<div>Forma</div>
					{/if}

					{#if activeTab === 'budget'}
						<div>Budžets</div>
					{/if}

					{#if activeTab === 'criteria'}
						<div>Kritēriji</div>
					{/if}

					{#if activeTab === 'files'}
						<div>
							<ul>
								{#each contest.pielikumi as file}
									<li>
										<a href="/api/file/download?id={file.id}&hash={file.sha_256}" target="_blank"
											>{file.apraksts}</a
										>
									</li>{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="container flex mx-auto">
		<p class="py-4">Konkurss netika atrasts.</p>
	</div>
{/if}
