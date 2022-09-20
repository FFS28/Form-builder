<script>
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	import Table from '$components/Table.svelte';
	import Drawer from '$components/Drawer.svelte';
	import IconPlus from 'svelte-material-icons/Plus.svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import IconDelete from 'svelte-material-icons/Delete.svelte';
	import IconDownload from 'svelte-material-icons/Download.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import { ProgramFile } from '$structures/program/program';
	import FormFileInput from '$components/global/form/FormFileInput.svelte';
	import FormCheckbox from '$components/global/form/FormCheckbox.svelte';
	import { uploadFile } from '$services/fileService';
	import {
		saveProgramFile,
		deleteProgramFileById,
	} from '$services/programFileService';

	export let program;

	let showFilesModal = false;
	let fileEditMode = false;
	const dispatch = createEventDispatcher();

	const tableParams = {
		fileDescription: 'Datnes apraksts',
		permissions: 'Tiesības',
		createdDate: 'Pievienošanas datums',
		fileName: 'Datnes nosaukums'
	};

	/** @param {int} fileId */
	async function deleteProgramFile(fileId) {
		if (confirm('Vai tiešām vēlaties dzēst datni?')) {
			const { success } = await deleteProgramFileById(fileId);

			if (!success) {
				return alert('Datnes dzēšana neizdevās!');
			}

			dispatch('filesUpdated');
		}
	}

	async function saveFile() {
		if (!formFile.fileInfoId) {
			return alert('Lūdzu augšuplādējiet failu!');
		}

		formFile.fileAuthorId = $page.data.user.userId;

		// If program is new (has not been saved yet),
		// save file together with program (add to the structure)
		if (!program.programId) {
			program.programFiles = [...program.programFiles, formFile];

			return onSuccessfulSubmit();
		}

		formFile.programId = program.programId;

		const { success } = await saveProgramFile(formFile);

		if (!success) {
			return alert('Neizdevās saglabāt programmas datni!');
		}

		dispatch('filesUpdated');

		onSuccessfulSubmit();
	}

	function handleRowClick(row) {
		formFile = row;
		fileEditMode = true;
		showFilesModal = true;
	}

	function downloadProgramFile(id, hash) {
		window.open(`/download/${id}/${hash}`, '_blank');
	}

	function downloadFile() {
		window.open(`/download/${formFile.fileInfoId}/${formFile.hash}`, '_blank');
	}

	const rowActions = [
		{
			actionParam: 'fileInfoId',
			secondActionParam: 'hash',
			actionMethod: downloadProgramFile,
			icon: IconDownload,
			iconColor: '#0369a1'
		},
		{
			actionParam: 'fileId',
			actionMethod: deleteProgramFile,
			icon: IconDelete,
			iconColor: '#870515'
		}
	];

	async function onFileSelected(file) {
		const { success, fileId } = await uploadFile(file);

		if (!success) {
			return alert('Faila augšuplāde neizdevās!');
		}

		formFile.fileInfoId = fileId;
	}

	const onSuccessfulSubmit = () => {
		showFilesModal = false;

		formFile = new ProgramFile();
	};

	let formFile = new ProgramFile();
</script>

<div class="flex items-center mb-4">
	<p class="font-bold">Programmas datnes</p>
	<button
		class="btn btn-secondary ml-4 flex items-center"
		on:click={() => {
			showFilesModal = true;
			fileEditMode = false;
		}}
	>
		<span class="mr-2"><IconPlus /></span> Pievienot
	</button>
</div>

<Drawer navWidth={50} show={showFilesModal}>
	<div>
		<div class="py-3 px-5">
			<div class="flex items-center">
				<h3 class="text-xl text-black font-bold mr-2">Datnes pievienošana</h3>

				<div class="ml-auto flex items-center">
					<button class="btn btn-primary flex items-center mx-4" on:click={saveFile}>
						<span class="mr-2"><IconCheckBold /></span>
						Saglabāt
					</button>

					<button
						class="btn"
						on:click={() => {
							showFilesModal = false;
						}}>Aizvērt</button
					>
				</div>
			</div>
		</div>

		<div class="border-t-2" />

		<div class="px-5">
			<div class="mt-3">
				<FormInput
					name="file-description"
					label="Datnes apraksts"
					bind:value={formFile.fileDescription}
				/>
			</div>
			<div class="mt-3 flex items-center">
				<FormFileInput
					label="Datne"
					class="flex-1"
					bind:fileName={formFile.fileName}
					on:fileSelected={({ detail: { file } }) => onFileSelected(file)}
				/>

				{#if fileEditMode}
					<div class="ml-2 mt-5 pt-1 cursor-pointer" on:click={downloadFile}>
						<IconDownload color="#0369a1" width="25px" height="25px" />
					</div>
				{/if}
			</div>
			<div class="mt-3">
				<FormCheckbox
					label="Ir publicējams?"
					name="isPublishable"
					bind:value={formFile.isPublishable}
				/>
			</div>
		</div>
	</div>
</Drawer>

<Table data={program.programFiles} rowClickAction={handleRowClick} {tableParams} {rowActions} />
