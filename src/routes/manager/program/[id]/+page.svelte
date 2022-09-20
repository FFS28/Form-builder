<script>
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';

	import PageHeader from '$components/PageHeader.svelte';
	import ProgramForm from '$components/program/Form.svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import IconCheckAll from 'svelte-material-icons/CheckAll.svelte';
	import IconTrashCan from 'svelte-material-icons/TrashCan.svelte';
	import { saveProgram, deleteProgramById, publishProgram } from '$services/programService';
	import { Program } from '$structures/program/program';
	import PopupBanner from '$components/PopupBanner.svelte';
	import { format } from 'date-fns';

	export let data;

	let programDates = {
		periodFrom: null,
		periodTo: null
	};

	let popup = {
		visible: false,
		type: '',
		title: '',
		message: ''
	};

	let program = Program.fromArray(data.programData);

	$: pageHeader = {
		title: program.name,
		titleSuffix: `(${program.status})`
	};

	$: errors = [];

	const formatDates = () => {
		if (programDates.periodFrom) {
			program.periodFrom = format(programDates.periodFrom, 'yyyy-MM-dd');
		}
		if (programDates.periodTo) {
			program.periodTo = format(programDates.periodTo, 'yyyy-MM-dd');
		}
	};

	const updateProgram = async (isPublish = false) => {
		popup.visible = false;
		validateProgram();

		if (errors.length) {
			popup.type = 'warning';
			popup.title = 'Lūdzu aizpildiet visus obligātos laukus!';

			return setTimeout(() => (popup.visible = true), 500);
		}

		formatDates();

		const { success } = await saveProgram(program);

		if (success) {
			popup.type = 'success';
			popup.title = 'Veiksmīgi saglabāta programma';
		} else {
			popup.type = 'error';
			popup.title = 'Programmas rediģēšana neizdevās!';
		}

		await updatePage();

		return setTimeout(() => (popup.visible = true), 500);
	};

	const publishProgramClick = async () => {
		popup.visible = false;
		formatDates();
		validateProgramPublish();

		if (errors.length) {
			popup.title = 'Lūdzu aizpildiet visus obligātos laukus!';
			popup.type = 'warning';

			return setTimeout(() => (popup.visible = true), 500);
		}

		// Save before publishing
		await updateProgram(program);

		const { success } = await publishProgram(program.programId);

		popup.visible = true;
		if (success) {
			popup.type = 'success';
			popup.title = 'Veiksmīgi publicēta programma';
			program.status = 'Publicēts';
		} else {
			popup.type = 'error';
			popup.title = 'Programmas publicēšana neizdevās!';
		}
	};

	const deleteProgram = async () => {
		if (!confirm('Vai tiešām vēlaties dzēst programmu?')) {
			return;
		}

		const { success } = await deleteProgramById(program.programId);

		if (!success) {
			return alert('Neizdevās izdzēst programmu!');
		}

		await goto('/manager/program/list');
	};

	const updatePage = async () => {
		await invalidateAll()

		data.program = Program.fromArray(data.programData);
	};

	const validateProgram = () => {
		errors = Program.getRequiredFields().filter((field) => !program[field]);
	};
	const validateProgramPublish = () => {
		errors = Program.getRequiredPublishFields().filter((field) => !program[field]);
	};
</script>

<PageHeader {...pageHeader}>
	<a href="/manager/program/list" class="btn">Aizvērt</a>
	<button class="btn btn-primary flex items-center mx-4" on:click={() => updateProgram()}>
		<IconCheckBold />
		<span class="ml-2">Saglabāt</span>
	</button>
	{#if !program.isPublished()}
		<button class="btn btn-primary flex items-center mr-4" on:click={publishProgramClick}>
			<IconCheckAll />
			<span class="ml-2">Publicēt</span>
		</button>
	{/if}
	<button class="btn btn-danger flex items-center" on:click={deleteProgram}>
		<IconTrashCan />
		<span class="ml-2">Dzēst</span>
	</button>
</PageHeader>

<div class="m-4">
	<PopupBanner
		title={popup.title}
		message={popup.message}
		popupType={popup.type}
		showPopup={popup.visible}
	/>
</div>

<ProgramForm {program} on:shouldUpdate={updatePage} {programDates} {errors} />
