<script>
	import { formatDate } from '$lib/helpers';

	import { onMount } from 'svelte';
	import IconChevronRight from 'svelte-material-icons/ChevronRight.svelte';

	export let program = null;
	export let contest = null;

	let item;

	onMount(() => {
		program ? parseProgram(program) : parseContest(contest);
	});

	function parseProgram(data) {
		item = {
			tags: [],
			details: []
		};

		item.id = data.id;
		item.title = data.nosaukums;

		if (data.statuss == 'Publicēts') {
			item.tags.push({
				title: 'Aktīvs'
			});
		}

		if (data.ir_aktivie_konkursi) {
			item.tags.push({
				title: `Ir aktīvi konkursi`,
				type: 'filled'
			});
		}

		item.details.push({
			title: 'Programmas finansējums',
			value: `€ ${data.finansejums}`
		});

		item.details.push({
			title: 'Projekta finansējums',
			value: `MIN: € ${data.projekta_finansejums_min} &nbsp; MAX: € ${data.projekta_finansejums_max}`
		});

		item.details.push({
			title: 'Darbības periods',
			value: `${formatDate(data.sakuma_datums)} līdz ${formatDate(data.beigu_datums)}`
		});
	}

	function parseContest(data) {
		item = {
			tags: [],
			details: []
		};

		item.id = data.id;
		item.title = data.nosaukums;

		if (data.statuss) {
			item.tags.push({
				title: data.statuss
			});
		}

		if (data.kopejais_finansejums) {
			item.details.push({
				title: 'Finansējums',
				value: `€ ${data.kopejais_finansejums}`
			});
		}

		item.details.push({
			title: 'Izludināšana',
			value: `${formatDate(data.izsludinasanas_laiks, true)}`
		});

		item.details.push({
			title: 'Iesniegšana',
			value: `${formatDate(data.iesniegsanas_laiks, true)}`
		});

		if (data.programmas_nosaukums) {
			item.details.push({
				title: 'Programma',
				value: `${data.programmas_nosaukums}`
			});
		}
	}
</script>

{#if item}
	<a href="/{program ? 'programs' : 'contests'}/{item.id}">
		<div class="mb-8 flex items-center border-b pb-2 w-100">
			<div class="item flex flex-col w-full justify-items-stretch">
				<div class="item__header flex items-center">
					<h2 class="item__title text-xl font-bold mr-3">{item.title}</h2>
					{#each item.tags as tag}
						<div class="item__tag mr-3 {tag.type}">{tag.title}</div>
					{/each}
				</div>
				<div class="item__details w-100 mt-2 grid grid-cols-3 gap-3 justify-between">
					{#each item.details as detail}
						<div class="item__detail">
							<span class="text-gray-500">{detail.title}:</span>
							<strong>{@html detail.value}</strong>
						</div>
					{/each}
				</div>
			</div>

			<div class="ml-10"><IconChevronRight size="36px" /></div>
		</div>
	</a>
{/if}
