<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { Contest } from '$structures/contest/contest';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import FormDropdown from '$components/global/form/FormDropdown.svelte';
	import { saveContest } from '$services/contestService';

	/** @type {Contest}*/
	export let contest;
	export let statusValue = null;

	let statuses = [
		{
			name: 'Pārtraukts',
			value: 3466841
		},
		{
			name: 'Atcelts',
			value: 3466842
		}
	];

	onMount(() => {
		if (contest.statusName === 'Vērtēšanā') {
			statuses.push({
				name: 'Projektu īstenošana',
				value: 3466840
			});
		}
	});

	const dispatch = createEventDispatcher();

	async function changeStatus() {
		if (confirm('Vai tiešām vēlaties mainīt konkursa statusu? Šī ir neatgriezeniska darbība.')) {
			contest.statusId = statusValue;
			contest.statusName = statuses.find((s) => s.value == statusValue).name;

			const { success } = await saveContest(contest);

			if (success) {
				dispatch('hideStatusChangeForm');
			}
		}
	}
</script>

<div>
	<!-- header -->
	<div class="py-3 px-5">
		<div class="flex items-center">
			<h3 class="text-xl text-black font-bold mr-2">Statusa maiņa</h3>

			<div class="ml-auto flex items-center">
				<button class="btn btn-primary flex items-center mx-4" on:click={changeStatus}>
					<span class="mr-2"><IconCheckBold /></span>
					Saglabāt
				</button>

				<button class="btn" on:click={() => dispatch('hideStatusChangeForm')}>Aizvērt</button>
			</div>
		</div>
	</div>
	<hr class="border-t-2" />
	<!-- main body -->
	<div class="my-4 mx-5">
		<div>
			<FormDropdown
				name="contest-status"
				label="Statuss"
				bind:items={statuses}
				bind:value={statusValue}
				placeholder="Norādiet statusu"
			/>
		</div>
	</div>
</div>
