<script>
	import PageHeader from '$components/PageHeader.svelte';
	import ProgramForm from '$components/program/Form.svelte';
	import Breadcrumbs from '$components/global/Breadcrumbs.svelte';
	import { Program } from '$structures/program/program';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import { saveProgram } from '$services/programService';
	import { goto } from '$app/navigation';
	import PopupBanner from '$components/PopupBanner.svelte';
	import { format } from 'date-fns';

	let program = new Program();
	let programDates = {
		periodFrom: null,
		periodTo: null
	};

	const pageHeader = {
		title: 'Jaunas programmas pievienošana'
	};

	let popup = {
		visible: false,
		type: '',
		title: '',
		message: ''
	};

	let errors = [];

	const addNewProgram = async () => {
		popup.visible = false;
		validateProgram();

		if (errors.length) {
			popup.type = 'warning';
			popup.title = 'Lūdzu aizpildiet visus obligātos laukus!';

			return setTimeout(() => (popup.visible = true), 500);
		}

		formatDates();

		const { success, programId, errorMessage } = await saveProgram(program);

		if (!success) {
			popup.title = 'Neizdevās pievienot jaunu programmu!';
			popup.message = errorMessage
			popup.type = 'error';

			return setTimeout(() => (popup.visible = true), 500);
		}

		if (programId > 0) {
			await goto(`/manager/program/${programId}`);
		}
	};

	const validateProgram = () => {
		errors = Program.getRequiredFields().filter((field) => !program[field]);
	};

	const formatDates = () => {
		if (programDates.periodFrom) {
			program.periodFrom = format(programDates.periodFrom, 'yyyy-MM-dd');
		}
		if (programDates.periodTo) {
			program.periodTo = format(programDates.periodTo, 'yyyy-MM-dd');
		}
	};
</script>

<PageHeader {...pageHeader}>
	<a href="/manager/program/list" class="btn">Aizvērt</a>
	<button class="btn btn-primary flex items-center mx-4" on:click={addNewProgram}>
		<span class="mr-2"><IconCheckBold /></span>
		Saglabāt
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

<ProgramForm {program} {errors} {programDates} />
