<script>
	import { createEventDispatcher } from 'svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import FormFileInput from '$components/global/form/FormFileInput.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import { Contest, ContestFile } from '$structures/contest/contest';
	import { uploadFile } from '$services/fileService';
	import {saveContestFile} from '$services/contestService';
	import PopupBanner from '$components/PopupBanner.svelte';
	import FormCheckbox from '$components/global/form/FormCheckbox.svelte';
	import { page } from '$app/stores';
	import IconDownload from 'svelte-material-icons/Download.svelte';

	/** @type {Contest}*/
	export let contest;

	export let file = new ContestFile();

	export let fileEditMode = false;

	let errors = [];

	const popup = {
		title: '',
		message: '',
		type: '',
		visible: false
	};

	setFileAuthor();

	const dispatch = createEventDispatcher();

	function hideDrawer() {
		dispatch('closeDrawer');
	}

	async function onFileSelected(data) {
		const { success, fileId, fileName, hash } = await uploadFile(data);

		if (!success) {
			return alert('Faila augšupielāde neizdevās!');
		}

		file.hash = hash;
		file.fileInfoId = fileId;
		file.fileName = fileName;
	}

	const onSuccessfulSubmit = () => {
		hideDrawer();
	};

	async function saveFile() {
		popup.visible = false;
		validateContestFiles();

		if (errors.length) {
			popup.type = 'error';
			popup.title = 'Neizdevās pievienot datni';
			popup.message = 'Lūdzu aizpildiet visus obligātos laukus!';
			popup.visible = true;
			return;
		}

		// Temporary solution to get current current date
		let today = new Date();
		const offset = today.getTimezoneOffset();
		today = new Date(today.getTime() - offset * 60 * 1000);
		file.createdDate = today.toISOString().split('T')[0];

		if (!contest.contestId) {
			contest.contestFiles = [...contest.contestFiles, file];
			return onSuccessfulSubmit();
		}

		file.contestId = contest.contestId;

		const { success, id } = await saveContestFile(file);

		if (!success) {
			return alert('Neizdevās saglabāt konkursa datni!');
		}

		file.id = id;

		if (!fileEditMode) {
			contest.contestFiles = [...contest.contestFiles, file];
		}

		onSuccessfulSubmit();
	}

	function setFileAuthor() {
		const { user } = $page.data
		file.fileAuthorId = user.userId;
		file.fileAuthorName = user.firstName + ' ' + user.lastName;
	}

	const validateContestFiles = () => {
		const fileRequiredFields = ['fileDescription', 'fileName'];

		errors = fileRequiredFields.filter((field) => !file[field] || !file[field].length);
	};

	$: hasInputError = (field) => {
		return errors.includes(field);
	};

	function downloadFile() {
		window.open(`/download/${file.fileInfoId}/${file.hash}`, '_blank');
	}
</script>

<div>
	<!-- header -->
	<div class="py-3 px-5">
		<div class="flex items-center">
			<h3 class="text-xl text-black font-bold mr-2">Datnes pievienošana</h3>

			<div class="ml-auto flex items-center">
				<button class="btn btn-primary flex items-center mx-4" on:click={saveFile}>
					<span class="mr-2"><IconCheckBold /></span>
					Saglabāt
				</button>

				<button class="btn" on:click={hideDrawer}>Aizvērt</button>
			</div>
		</div>
	</div>
	<hr class="border-t-2" />
	<!-- main body -->
	<div class="my-4 mx-5">
		<div>
			<PopupBanner
				background={true}
				title={popup.title}
				message={popup.message}
				popupType={popup.type}
				showPopup={popup.visible}
			/>
		</div>
		<FormInput
			name="file-description"
			label="Datnes apraksts"
			bind:value={file.fileDescription}
			maxlength={1000}
			showError={hasInputError('fileDescription')}
		/>
		<div class="mt-3">
			<div class="flex items-center">
				<FormFileInput
					class="flex-1"
					label="Datne"
					bind:fileName={file.fileName}
					on:fileSelected={({ detail: { file } }) => onFileSelected(file)}
					showError={hasInputError('fileName')}
				/>
				{#if fileEditMode}
					<div class="ml-2 mt-5 pt-1 cursor-pointer" on:click={downloadFile}>
						<IconDownload color="#0369a1" width="25px" height="25px" />
					</div>
				{/if}
			</div>
		</div>
		<div class="mt-3">
			<FormCheckbox label="Ir publicējams?" name="isPublishable" bind:value={file.isPublishable} />
		</div>
	</div>
</div>
