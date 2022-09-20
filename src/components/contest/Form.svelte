<script>
	import { getEmployees } from '$services/employeeService';
	import FormInput from '$components/global/form/FormInput.svelte';
	import {
		saveContest,
		getContest,
		deleteContest,
		deleteContestFileById,
		publishContest
	} from '$services/contestService';
	import { format } from 'date-fns';
	import { Contest, ContestFile, Users } from '$structures/contest/contest';
	import IconPlus from 'svelte-material-icons/Plus.svelte';
	import IconTrashCan from 'svelte-material-icons/TrashCan.svelte';
	import Drawer from '$components/Drawer.svelte';
	// Forms
	import FormCheckbox from '$components/global/form/FormCheckbox.svelte';
	import FormDecimalInput from '$components/global/form/FormDecimalInput.svelte';
	import DatePicker from '$components/global/form/DatePicker.svelte';
	//Header
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import IconCheckAll from 'svelte-material-icons/CheckAll.svelte';
	// Table
	import Table from '$components/Table.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import IconDelete from 'svelte-material-icons/Delete.svelte';
	import IconDownload from 'svelte-material-icons/Download.svelte';
	import AddDateForm from './addDateForm.svelte';
	import PopupBanner from '$components/PopupBanner.svelte';
	import FormMultiSelectDropdown from '$components/global/form/FormMultiSelectDropdown.svelte';
	import Quill from '$components/global/form/Quill.svelte';
	import { onMount } from 'svelte';
	import { deepEqual, objectEquals } from '$lib/helpers';
	import { goto } from '$app/navigation';
	import { getProgram } from '$services/programService';
	import ChangeStatus from './changeStatus.svelte';
	import { page } from '$app/stores';

	export let programId = null;
	export let selectedContestId = null;
	export let contestChanged = false;
	export let openAsDrawer = true;
	export let contest;
	export let returnURL = '/manager/contest/list';
	export let statusFormVisible = false;

	let contestLoaded = false;
	let originalContest = new Contest();
	let program = null;

	let users = [];

	let contestDates = {
		startDate: null,
		endDate: null,
		submissionTime: null,
		publishingTime: null
	};

	let originalContestDates = contestDates;

	let employees = [];

	let file = new ContestFile();
	let fileEditMode = false;

	onMount(async () => {
		await getInitialData();
		contestLoaded = true;
	});

	async function getInitialData() {
		const { data } = await getEmployees('');

		employees = data.map((item) => {
			return {
				label: item.vards + ' ' + item.uzvards,
				value: item.id
			};
		});

		await getProgramData(programId);

		if (!selectedContestId) {
			return;
		}
		originalContest = JSON.parse(JSON.stringify(contest));
		contestDates = {
			startDate: contest.startDate ? new Date(contest.startDate) : null,
			endDate: contest.endDate ? new Date(contest.endDate) : null,
			submissionTime: contest.submissionTime ? new Date(contest.submissionTime) : null,
			publishingTime: contest.publishingTime ? new Date(contest.publishingTime) : null
		};

		originalContestDates = { ...contestDates };

		users = contest.users.map((user) => ({ label: user.userName, value: user.userId }));
	}

	async function getProgramData(programId) {
		program = await getProgram(programId);
		setInitialDataFromProgram();
	}

	function setInitialDataFromProgram() {
		if (program.data) {
			if (!contest.totalFinancing && program.data.faktiskais_finansejuma_atlikums) {
				contest.totalFinancing = program.data.faktiskais_finansejuma_atlikums;
			}
			if (!contest.allocatedFinancing && program.data.finansejums) {
				contest.allocatedFinancing = program.data.finansejums;
			}
			if (!contest.minFinancing && program.data.projekta_finansejums_min) {
				contest.minFinancing = program.data.projekta_finansejums_min;
			}
			if (!contest.maxFinancing && program.data.projekta_finansejums_max) {
				contest.maxFinancing = program.data.projekta_finansejums_max;
			}
			if (!contestDates.startDate && program.data.sakuma_datums) {
				if (new Date(program.data.sakuma_datums) > new Date()) {
					contestDates.startDate = new Date(program.data.sakuma_datums);
				} else {
					contestDates.startDate = new Date();
				}
				startDateSelect(contestDates.startDate);
			}
			if (!contestDates.endDate && program.data.beigu_datums) {
				contestDates.endDate = new Date(program.data.beigu_datums);
				endDateSelect(contestDates.endDate);
			}
		}
	}

	const showSearchbar = true;

	function hideDrawer() {
		goto(returnURL);
	}

	function confirmHideDrawer() {
		if (contestChanged && confirm('Vai tiešām vēlaties aizvērt konkursu bez saglabāšanas?')) {
			hideDrawer();
		} else {
			hideDrawer();
		}
	}

	$: addFormVisible = false;
	$: statusFormVisible = false;
	$: contestChanged =
		!deepEqual(contest, originalContest) || !objectEquals(contestDates, originalContestDates);

	let errors = [];

	// Popup
	const popup = {
		title: '',
		message: '',
		type: '',
		visible: false
	};

	const tableParams = {
		fileDescription: 'Datnes apraksts',
		permissions: 'Tiesības',
		createdDate: 'Pievienošanas datums',
		fileName: 'Datnes nosaukums'
	};

	function handleRowClick(row) {
		file = row;
		fileEditMode = true;
		addFormVisible = true;
	}

	let title = 'Jauna konkursa pievienošana';
	if (contest) {
		title = 'Konkursa rediģēšana';
	}

	const rowActions = [
		{
			actionParam: 'fileInfoId',
			secondActionParam: 'hash',
			actionMethod: downloadContestFile,
			icon: IconDownload,
			iconColor: '#0369a1'
		},
		{
			actionParam: 'id',
			actionMethod: deleteContestFile,
			icon: IconDelete,
			iconColor: '#870515'
		}
	];

	let activeTab = 'desc';
	let activeTabClasses = 'bg-white border-t border-r border-l -mb-px';

	$: tabs = [
		{ name: 'desc', title: 'Apraksts' },
		{ name: 'Pieteikuma forma', title: 'Pieteikuma forma' },
		{ name: 'Budžets', title: 'Budžets' },
		{ name: 'Riski', title: 'Riski (0)' },
		{ name: 'Kritēriji', title: 'Kritēriji' },
		{ name: 'Datnes', title: `Datnes (${contest.contestFiles?.length || 0})` },
		{ name: 'Pārbaudes', title: 'Pārbaudes (0)' },
		{ name: 'Atskaites', title: 'Atskaites (0)' }
	];

	let activeDescTab = 'target';

	const descTabs = [
		{ name: 'target', title: 'Mērķis' },
		{ name: 'targetGroup', title: 'Mērķa grupa' },
		{ name: 'faq', title: 'Biežāk uzdotie jautājumi' },
		{ name: 'applicants', title: 'Pretendenti' },
		{ name: 'expenseAccounting', title: 'Izmaksu attiecināmība' }
	];

	export const deleteProgramContest = async () => {
		if (confirm('Vai tiešām vēlaties dzēst konkursu?')) {
			const { success, errorMessage } = await deleteContest(contest.contestId);

			if (!success) {
				popup.type = 'error';
				popup.title = 'Neizdevās izdzēst konkursu!';
				popup.message = errorMessage;
				popup.visible = true;

				return;
			}

			returnURL ? goto(returnURL) : goto('/manager/contest/list');
		}
	};

	export const saveProgramContest = async () => {
		popup.visible = false;
		validateContest();

		contest.programId = Number(programId);

		if (errors.length) {
			popup.type = 'error';
			popup.title = 'Neizdevās pievienot konkursu';
			popup.message = 'Lūdzu aizpildiet visus obligātos laukus!';
			popup.visible = true;
			return;
		}

		formatDates();

		const { success, errorMessage, data } = await saveContest(contest);

		if (success) {
			popup.type = 'success';
			popup.title = 'Veiksmīgi saglabāts konkurss';
			popup.message = '';
		} else if (errorMessage) {
			popup.type = 'error';
			popup.title = 'Neizdevās pievienot konkursu';
			popup.message = errorMessage;
		}

		contest.contestId = data.id;

		popup.visible = true;

		originalContest = JSON.parse(JSON.stringify(contest));
	};

	const validateContest = () => {
		const contestRequiredFields = ['name', 'number', 'users'];

		errors = contestRequiredFields.filter((field) => !contest[field] || !contest[field].length);
	};

	async function deleteContestFile(fileId) {
		if (confirm('Vai tiešām vēlaties dzēst datni?')) {
			if (contest.contestId) {
				const { success, errorMessage } = await deleteContestFileById(fileId);

				if (!success) {
					popup.type = 'error';
					popup.title = 'Neizdevās izdzēst konkursa failu!';
					popup.message = errorMessage;
					popup.visible = true;

					return;
				}
			}
			contest.contestFiles = contest.contestFiles.filter((file) => file.id !== fileId);
		}
	}

	async function downloadContestFile(fileId, hash) {
		window.open(`/api/file/download?id=${fileId}&hash=${hash}`, '_blank');
	}

	$: hasInputError = (field) => {
		return errors.includes(field);
	};

	$: showDeleteButton = () => {
		return contest.contestId && contest.isDraft();
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

	export const publishProgramContest = async (isNew = true) => {
		// Should we save before publishing?
		// await saveProgramContest();
		popup.visible = false;

		if (!contest.contestId) {
			popup.type = 'error';
			popup.title = 'Neizdevās publicēt konkursu';
			popup.message = 'Lūdzu saglabājiet konkursu pirms publicēšanas';
			popup.visible = true;
			return;
		}

		const { success, errorMessage, data } = await publishContest(contest.contestId);

		if (success) {
			popup.type = 'success';
			popup.title = 'Veiksmīgi publicēts konkurss';
			popup.visible = true;

			contest.statusName = data.statuss_nosaukums;

			if (isNew) {
				const returnURL = $page.url.searchParams.get('returnURL')
					? $page.url.searchParams.get('returnURL')
					: '';
				goto(`/manager/contest/${contest.contestId}${returnURL ? `?returnURL=${returnURL}` : ''}`);
			} else {
				await getInitialData();
			}
		} else if (errorMessage) {
			popup.type = 'error';
			popup.title = 'Neizdevās publicēt konkursu';
			popup.message = errorMessage;
			popup.visible = true;
		}
	};

	const formatDates = () => {
		if (contestDates.startDate) {
			contest.startDate = format(contestDates.startDate, 'yyyy-MM-dd');
		}
		if (contestDates.endDate) {
			contest.endDate = format(contestDates.endDate, 'yyyy-MM-dd');
		}
		if (contestDates.publishingTime) {
			contest.publishingTime = format(contestDates.publishingTime, 'yyyy-MM-dd HH:mm:ss');
		}
		if (contestDates.submissionTime) {
			contest.submissionTime = format(contestDates.submissionTime, 'yyyy-MM-dd HH:mm:ss');
		}
	};

	/**
	 * Add users to contest
	 */
	function handleContestUsers() {
		let contestUsers = [];

		users.forEach((user) => {
			let contestUser = new Users();

			contestUser.userId = user.value;
			contestUser.userName = user.label;

			contestUsers.push(contestUser);
		});

		contest.users = contestUsers;
	}

	function updateContestFiles() {
		contest.contestFiles = [...contest.contestFiles];
	}

	function startDateSelect(date) {
		// set value for "Izsludināšana"
		if (!contestDates.publishingTime) {
			contestDates.publishingTime = new Date(
				format(date.setHours(0, 0, 0, 0), 'yyyy-MM-dd HH:mm:ss')
			);
		}
	}

	function endDateSelect(date) {
		// set value for "Pieteikuma iesniegšana"
		if (!contestDates.submissionTime) {
			contestDates.submissionTime = new Date(
				format(date.setHours(23, 59, 0, 0), 'yyyy-MM-dd HH:mm:ss')
			);
		}
	}
</script>

{#if contestLoaded}
	<div>
		<!-- Header -->
		{#if openAsDrawer}
			<div class="sticky top-0 py-3 px-5 bg-white border-b-2 border-gray-200 z-10">
				<div class="flex items-center">
					<h3 class="text-xl text-black font-bold mr-2">
						{title}
					</h3>

					<div class="ml-auto flex items-center">
						<button class="btn btn-primary flex items-center mx-4" on:click={saveProgramContest}>
							<span class="mr-2"><IconCheckBold /></span>
							Saglabāt
						</button>

						{#if contest.isDraft()}
							<button
								class="btn btn-primary flex items-center mr-4"
								on:click={() => publishProgramContest(true)}
							>
								<span class="mr-2"><IconCheckAll /></span>
								Publicēt
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
							<button class="btn btn-danger flex items-center mr-4" on:click={deleteProgramContest}>
								<IconTrashCan />
								<span class="ml-2">Dzēst</span>
							</button>
						{/if}

						<button class="btn" on:click={confirmHideDrawer}>Aizvērt</button>
					</div>
				</div>
			</div>
		{/if}

		<div class={openAsDrawer ? 'my-3 mx-4' : ''}>
			<PopupBanner
				background={true}
				title={popup.title}
				message={popup.message}
				popupType={popup.type}
				showPopup={popup.visible}
			/>
		</div>

		<div class="bg-white py-3 px-5 mb-3">
			<div class="grid grid-cols-3 gap-4">
				<div class="col-span-2">
					<FormInput
						label="Konkursa nosaukums"
						name="contest-name"
						bind:value={contest.name}
						showError={hasInputError('name')}
					/>
				</div>

				<div class="">
					<h3 class="font-bold">Programma</h3>
					{#if program} <p class="mt-3">{program.data.nosaukums}</p> {/if}
				</div>
			</div>

			<div class="grid grid-cols-3 gap-4 mt-3">
				<div class="col-span-2">
					<div class="grid grid-cols-4 gap-4 items-center">
						<FormInput
							label="Konkursa numurs"
							name="contest-id"
							bind:value={contest.number}
							showError={hasInputError('number')}
						/>
						<FormInput
							isDisabled
							label="Statuss"
							name="contest-status"
							bind:value={contest.statusName}
						/>
						<div class="mt-5 col-span-2">
							<FormCheckbox
								label="Ierobežota projektu atlase"
								name="closed-contest"
								bind:value={contest.closedContest}
							/>
						</div>
					</div>
					<div class="flex flex-wrap">
						<div>
							<h4 class="font-bold mb-1.5 mt-3">Darbības periods</h4>
							<div class="flex">
								<div class="flex items-center mr-2">
									<span class="mr-2">No: </span>
									<DatePicker
										bind:value={contestDates.startDate}
										selectFunction={startDateSelect}
									/>
								</div>
								<div class="flex items-center mr-4">
									<span class="mr-2">Līdz: </span>
									<DatePicker bind:value={contestDates.endDate} selectFunction={endDateSelect} />
								</div>
							</div>
						</div>
						<div>
							<h4 class="font-bold mb-1.5 mt-3">Izsludināšana</h4>
							<div class="flex items-center mr-2">
								<DatePicker bind:value={contestDates.publishingTime} timePicker />
							</div>
						</div>
						<div>
							<h4 class="font-bold mb-1.5 mt-3">Pieteikuma iesniegšana</h4>
							<div class="flex items-center">
								<DatePicker bind:value={contestDates.submissionTime} timePicker />
							</div>
						</div>
					</div>

					<hr class="my-3" />
				</div>

				<div class="col-span-1">
					<div>
						<h3 class="font-bold mb-1.5">Programmas numurs</h3>
						{#if program} <p class="mt-3">{program.data.id}</p> {/if}
					</div>
					<div class="mt-4">
						<h3 class="font-bold mb-1.5">EK piešķirtais programmas numurs</h3>
						{#if program} <p class="mt-3">{program.data.ek_numurs}</p> {/if}
					</div>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-4">
				<div class="col-span-2">
					<h3 class="font-bold text-black mb-2 uppercase">finansējums</h3>

					<div class="grid grid-cols-4 gap-4 items-center">
						<FormDecimalInput
							label="Kopējais"
							name="Kopējais"
							bind:value={contest.totalFinancing}
							prefix="€"
						/>
						<FormDecimalInput
							label="Faktiskais"
							name="Faktiskais"
							bind:value={contest.actualFinancing}
							prefix="€"
						/>
						<FormDecimalInput
							label="Piešķirtais"
							name="Piešķirtais"
							bind:value={contest.allocatedFinancing}
							prefix="€"
						/>
					</div>
					<div class="grid grid-cols-4 gap-4 mt-4 items-center">
						<FormDecimalInput
							label="Minimālais"
							name="Minimālais"
							bind:value={contest.minFinancing}
							prefix="€"
						/>
						<FormDecimalInput
							label="Maksimālais"
							name="Maksimālais"
							bind:value={contest.maxFinancing}
							prefix="€"
						/>
						<div class="mt-5">
							<FormCheckbox
								label="Nav sākotnējās tāmes"
								name="Nav-sākotnējās-tāmes"
								bind:value={contest.withoutInitialEstimate}
							/>
						</div>
					</div>
				</div>
				<div class="col-span-1">
					<div>
						<div class="">
							<FormMultiSelectDropdown
								label="ATBILDĪGAIS DARBINIEKS"
								bind:selectedItems={users}
								items={employees}
								showError={hasInputError('users')}
								on:selected={handleContestUsers}
							/>
						</div>
					</div>
					<div class="mt-4">
						<h3 class="font-bold mb-2 uppercase">Nepieciešamās ārējās kontroles</h3>
						{#if program}
							{#if program.data.ir_ur_monitorings}
								<p class="mt-3">UR datu monitorings</p>
							{/if}
							{#if program.data.ir_vid_monitorings}
								<p class="mt-3">VID datu monitorings</p>
							{/if}
							{#if program.data.ir_fpris_monitorings}
								<p class="mt-3">IR datu monitorings</p>
							{/if}
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="border-b">
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
			{#if activeTab === 'desc'}
				<div class="border-b">
					<ul class="inline-flex mx-4">
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
				</div>
				<div class="mt-2 mx-4">
					{#if activeDescTab == 'target'}
						<Quill bind:value={contest.target} />
					{/if}
					{#if activeDescTab == 'targetGroup'}
						<Quill bind:value={contest.targetGroup} />
					{/if}
					{#if activeDescTab == 'faq'}
						<Quill bind:value={contest.faq} />
					{/if}
					{#if activeDescTab == 'applicants'}
						<Quill bind:value={contest.applicants} />
					{/if}
					{#if activeDescTab == 'expenseAccounting'}
						<Quill bind:value={contest.expenseAccounting} />
					{/if}
				</div>
			{/if}
			{#if activeTab === 'Datnes'}
				<div class="mx-4">
					<div class="flex items-center mb-4">
						<p class="font-bold">Datnes</p>
						<button
							class="btn btn-secondary ml-4 flex items-center"
							on:click={() => {
								file = new ContestFile();
								fileEditMode = false;
								addFormVisible = true;
							}}
						>
							<span class="mr-2"><IconPlus /></span> Pievienot
						</button>
					</div>

					<div class="mb-4 flex justify-between">
						<SearchBar width={250} />
						<div class="flex items-center">
							Rādīt
							<select
								id="per-page-limit"
								name="perPageLimit"
								class="mx-3 border rounded block w-full p-2"
							>
								<option value={20}>20</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
							ierakstus
						</div>
					</div>

					<Table
						bind:data={contest.contestFiles}
						{tableParams}
						rowClickAction={handleRowClick}
						{rowActions}
					/>
				</div>
			{/if}
		</div>
	</div>

	<Drawer
		navWidth={50}
		bind:show={addFormVisible}
		on:close={() => {
			updateContestFiles();
			addFormVisible = false;
		}}
	>
		<AddDateForm
			{contest}
			bind:file
			bind:fileEditMode
			on:closeDrawer={() => {
				updateContestFiles();
				addFormVisible = false;
			}}
		/>
	</Drawer>

	<Drawer
		navWidth={50}
		bind:show={statusFormVisible}
		on:close={() => {
			statusFormVisible = false;
		}}
	>
		<ChangeStatus
			{contest}
			on:hideStatusChangeForm={async () => {
				statusFormVisible = false;
				await getInitialData();
			}}
		/>
	</Drawer>
{/if}

<style>
</style>
