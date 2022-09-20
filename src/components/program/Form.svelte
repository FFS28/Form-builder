<script>
	import { createEventDispatcher, onMount } from 'svelte';

	import Drawer from '$components/Drawer.svelte';
	import FormFiles from '$components/program/FormFiles.svelte';
	import ContestList from '$components/program/ContestList.svelte';
	import ContestForm from '$components/contest/Form.svelte';
	import FormDropdown from '$components/global/form/FormDropdown.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import FormDecimalInput from '$components/global/form/FormDecimalInput.svelte';
	import FormCheckbox from '$components/global/form/FormCheckbox.svelte';
	import DatePicker from '$components/global/form/DatePicker.svelte';
	import Quill from '$components/global/form/Quill.svelte';
	import EmployeeDropdown from '$components/global/form/EmployeeDropdown.svelte';
	import {getCodifierByCode} from "$services/codifierService.js";

	/** @type {Program} */
	export let program;

	export let errors;

	export let programDates = null;

	let contestChanged = false;

	const dispatch = createEventDispatcher();

	const TAB_GOAL = 'goal';
	const TAB_GOAL_TARGET_AUDIENCE = 'goalTargetAudience';
	const TAB_FILES = 'files';
	const TAB_CONTESTS = 'contests';

	$: tabs = [
		{ name: TAB_GOAL, title: 'Programmas mērķis' },
		{ name: TAB_GOAL_TARGET_AUDIENCE, title: 'Programmas mērķa grupa' },
		{ name: TAB_FILES, title: `Datnes (${program.programFiles?.length || 0})` },
		{
			name: TAB_CONTESTS,
			title: `Konkursi ${
				program.isPublished() ? '(' + program.programContests?.length + ')' || '(0)' : ''
			}`
		}
	];

	let formattedFinancingSources = [];

	let activeTab = TAB_GOAL;
	let activeTabClasses = 'bg-white border-t border-r border-l -mb-px';

	let selectedContestId = null;

	$: contestFormVisible = false;

	onMount(async () => {
		await setFinancingSources();
		if (program.periodFrom) {
			programDates.periodFrom = new Date(program.periodFrom);
		}
		if (program.periodTo) {
			programDates.periodTo = new Date(program.periodTo);
		}
	});

	const onFilesUpdated = () => dispatch('shouldUpdate');

	const setProgramEmployee = (employeeId) => {
		program.responsibleEmployeeId = employeeId;
	};

	const setFinancingSources = async () => {
		const { codifierData } = await getCodifierByCode('FINANSEJUMA_AVOTS');

		formattedFinancingSources = codifierData.map((source) => ({
			value: source.id,
			name: source.nosaukums
		}));
	};

	const showContestForm = (contestId) => {
		selectedContestId = contestId;
		contestFormVisible = true;
	};

	const closeContestForm = (requireConfirmation) => {
		if (requireConfirmation) {
			if (confirm('Vai tiešām vēlaties aizvērt konkursu bez saglabāšanas?')) {
				contestFormVisible = false;
				selectedContestId = null;

				dispatch('shouldUpdate');
			}
		} else {
			contestFormVisible = false;
			selectedContestId = null;
			dispatch('shouldUpdate');
		}
	};

	$: hasInputError = (field) => {
		return errors.includes(field);
	};
</script>

<div class="m-4">
	<div class="bg-white p-3 mb-3" id="program-form">
		<div class="grid grid-cols-3 gap-4">
			<div class="col-span-2">
				<FormInput
					label="Programmas nosaukums"
					name="program-name"
					bind:value={program.name}
					showError={hasInputError('name')}
				/>
			</div>
			<EmployeeDropdown
				label="Atbildīgais darbinieks"
				employeeName={program.responsibleEmployeeName}
				showError={hasInputError('responsibleEmployeeId')}
				on:selected={({ detail: { employeeId } }) => setProgramEmployee(employeeId)}
			/>
		</div>

		<div class="grid grid-cols-3 gap-4 mt-3">
			<div class="col-span-2">
				<div class="grid grid-cols-2 gap-4">
					<FormInput
						isDisabled
						label="Programmas numurs"
						name="program-id"
						bind:value={program.programId}
					/>
					<FormInput
						label="EK piešķirtais programmas numurs"
						name="program-ek-id"
						bind:value={program.programEKNumber}
					/>
				</div>
				<div class="mt-3">
					<h4 class="font-bold mb-1.5">Darbības periods</h4>
					<div class="flex">
						<div class="flex items-center mr-2">
							<span class="mr-2">No: </span>
							<DatePicker
								bind:max={programDates.periodTo}
								bind:value={programDates.periodFrom}
								showError={hasInputError('periodFrom')}
							/>
						</div>
						<div class="flex items-center">
							<span class="mr-2">Līdz: </span>
							<DatePicker
								bind:min={programDates.periodFrom}
								bind:value={programDates.periodTo}
								showError={hasInputError('periodTo')}
							/>
						</div>
					</div>
				</div>
			</div>
			<div>
				<h3 class="font-bold mb-1.5">Nepieciešamās ārējās kontroles</h3>
				<div class="mb-2">
					<FormCheckbox
						label="UR datu monitorings"
						name="useURMonitoring"
						bind:value={program.useURMonitoring}
					/>
				</div>
				<div class="mb-2">
					<FormCheckbox
						label="VID datu monitorings"
						name="useVIDMonitoring"
						bind:value={program.useVIDMonitoring}
					/>
				</div>
				<FormCheckbox
					label="IR datu monitorings"
					name="useIRMonitoring"
					bind:value={program.useIRMonitoring}
				/>
			</div>
		</div>

		<hr class="my-3" />

		<div class="grid grid-cols-3 gap-4">
			<div class="col-span-2">
				<h3 class="font-bold mb-2 uppercase">Programmas finansējums</h3>
				<FormDropdown
					label="Avots"
					name="financing-source"
					items={formattedFinancingSources}
					bind:value={program.financingSourceId}
					placeholder="Izvēlies"
					showError={hasInputError('financingSourceId')}
				/>
			</div>
			<div>
				<h3 class="font-bold mb-2 uppercase">Projekta finansējums</h3>
				<div class="grid grid-cols-2 gap-4">
					<FormDecimalInput
						label="Minimālais"
						name="min-financing"
						prefix="€"
						bind:value={program.minFinancing}
						bind:max={program.maxFinancing}
					/>
					<FormDecimalInput
						label="Maksimālais"
						name="max-financing"
						prefix="€"
						bind:value={program.maxFinancing}
						bind:min={program.minFinancing}
						bind:max={program.financingAmount}
					/>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-3 gap-4 mt-3">
			<div class="col-span-2">
				<div class="grid grid-cols-4 gap-4">
					<FormDecimalInput
						label="Kopējais"
						name="financing-amount"
						bind:value={program.financingAmount}
						prefix="€"
						showError={hasInputError('financingAmount')}
					/>
					<div>
						<FormDecimalInput
							name="remaining-financing"
							label="Atlicis"
							value={program.remainingFinancing}
							isDisabled={true}
							prefix="€"
						/>
					</div>
					<div>
						<FormDecimalInput
							name="remaining-financing-sum"
							label="Rezervētais"
							value={program.remainingFinanceSum}
							isDisabled={true}
							prefix="€"
						/>
					</div>
					<div>
						<FormDecimalInput
							name="actual-financing-sum"
							label="Faktiskais"
							value={program.actualFinanceSum}
							isDisabled={true}
							prefix="€"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<ul id="tabs" class="inline-flex w-full border-b">
		{#each tabs as tab}
			<li
				class="px-4 text-gray-800 py-2 rounded-t cursor-pointer {activeTab === tab.name
					? activeTabClasses
					: ''}"
				on:click={() => (activeTab = tab.name)}
			>
				{tab.title}
			</li>
		{/each}
	</ul>

	<div class="bg-white p-3">
		{#if activeTab === TAB_GOAL}
			<Quill bind:value={program.goal} placeholder="Programmas mērķis" />
		{:else if activeTab === TAB_GOAL_TARGET_AUDIENCE}
			<Quill bind:value={program.goalTargetAudience} placeholder="Programmas mērķa grupa" />
		{:else if activeTab === TAB_FILES}
			<FormFiles {program} on:filesUpdated={onFilesUpdated} />
		{:else if activeTab === TAB_CONTESTS}
			{#if program.isPublished()}
				<ContestList
					programId={program.programId}
					contests={program.programContests}
					on:showContestForm={({ detail }) => showContestForm(detail)}
					canAddContest={program.remainingFinancing > 0}
				/>
			{:else}
				<p>Konkursus var pievienot tikai publicētai programmai.</p>
			{/if}
		{/if}
	</div>

	<Drawer
		navWidth={80}
		bind:show={contestFormVisible}
		on:close={() => closeContestForm(contestChanged)}
	>
		<ContestForm
			programId={program.programId}
			on:closeDrawer={() => closeContestForm(false)}
			{selectedContestId}
			bind:contestChanged
		/>
	</Drawer>
</div>
