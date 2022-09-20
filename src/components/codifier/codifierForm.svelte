<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import {
		saveCodifierEntry,
		deleteCodifierEntry
	} from '$services/codifierService';
	import IconTrashCan from 'svelte-material-icons/TrashCan.svelte';
	import DatePicker from '$components/global/form/DatePicker.svelte';
	import { format } from 'date-fns';
	import FormSelectDropdown from '$components/global/form/FormSelectDropdown.svelte';

	export let codifier;
	export let codifiers;

	let dateFrom;
	let dateTo;
	let codifierParent;

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (codifiers) {
			codifiers = codifiers.filter((c) => {
				return c.id !== codifier.id;
			});
			codifiers = codifiers.map((c) => {
				return {
					value: c.id,
					label: c.nosaukums
				};
			});
		}

		if (codifier.parent_id && codifier.parent_nosaukums) {
			codifierParent = {
				value: codifier.parent_id,
				label: codifier.parent_nosaukums
			};
		}
		parseDates();
	});

	async function saveEntry() {
		formatDates();

		const { success } = await saveCodifierEntry(codifier);
		if (success) {
			dispatch('hideCodifierForm');
		}
	}

	function showDeleteButton() {
		return codifier.id;
	}

	async function deleteEntry() {
		if (confirm('Vai tiešām vēlaties dzēst klasifikatora ierakstu?')) {
			const { success } = await deleteCodifierEntry(codifier.id);
			if (success) {
				dispatch('hideCodifierForm');
			}
		}
	}

	$: getHeaderTitle = () => {
		return codifier.id
			? 'Kodifikatora ieraksta rediģēšana'
			: `Jauns ${codifier.codifierTitle} ieraksts`;
	};

	const formatDates = () => {
		if (dateFrom) {
			codifier.datums_no = format(dateFrom, 'yyyy-MM-dd');
		}
		if (dateTo) {
			codifier.datums_lidz = format(dateTo, 'yyyy-MM-dd');
		}
	};

	const parseDates = () => {
		dateFrom = codifier.datums_no ? new Date(codifier.datums_no) : null;
		dateTo = codifier.datums_lidz ? new Date(codifier.datums_lidz) : null;
	};
</script>

<div>
	<!-- header -->
	<div class="py-3 px-5">
		<div class="flex items-center">
			<h3 class="text-xl text-black font-bold mr-2">{getHeaderTitle()}</h3>

			<div class="ml-auto flex items-center">
				<button class="btn btn-primary flex items-center mx-4" on:click={saveEntry}>
					<span class="mr-2"><IconCheckBold /></span>
					Saglabāt
				</button>

				{#if showDeleteButton()}
					<button class="btn btn-danger flex items-center mr-4" on:click={deleteEntry}>
						<IconTrashCan />
						<span class="ml-2">Dzēst</span>
					</button>
				{/if}

				<button class="btn" on:click={() => dispatch('hideCodifierForm')}>Aizvērt</button>
			</div>
		</div>
	</div>
	<hr class="border-t-2" />
	<!-- main body -->
	<div class="my-4 mx-5">
		<div class="">
			<div class="row flex">
				<div class="w-1/2 mr-2">
					<FormInput bind:value={codifier.kods} name="codifier-code" label="Kods" />
				</div>
				<div class="w-1/2">
					<FormInput
						bind:value={codifier.kods_sort}
						name="codifier-sortcode"
						label="Kārtošanas kods"
					/>
				</div>
			</div>
			<div class="row mt-3">
				<FormInput bind:value={codifier.nosaukums} name="codifier-name" label="Nosaukums" />
			</div>
			<div class="row mt-3">
				<FormInput
					bind:value={codifier.longname}
					name="codifier-longname"
					label="Izvērstais nosaukums"
				/>
			</div>

			<div class="row mt-3">
				<FormInput bind:value={codifier.piezimes} name="codifier-notes" label="Piezīmes" />
			</div>

			<div class="row mt-3">
				<FormSelectDropdown
					bind:selectedItem={codifierParent}
					items={codifiers}
					label="Virskodifikators"
					itemsAreObjects={true}
				/>
			</div>

			<div class="row mt-3">
				<div class="row flex">
					<div class="w-1/4 mr-2">
						<h4 class="font-bold mb-1.5">Datums no</h4>
						<div class="flex items-center mr-2">
							<DatePicker bind:value={dateFrom} />
						</div>
					</div>
					<div class="w-1/4">
						<h4 class="font-bold mb-1.5">Datums līdz</h4>
						<div class="flex items-center">
							<DatePicker bind:value={dateTo} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
