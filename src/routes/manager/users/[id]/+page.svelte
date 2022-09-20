<script>
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';

	import PageHeader from '$components/PageHeader.svelte';
	import UserForm from '$components/user/Form.svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import IconTrashCan from 'svelte-material-icons/TrashCan.svelte';
	import { editUser, deleteUserById } from '$services/userService';
	import { User } from '$structures/user/user';
	import PopupBanner from '$components/PopupBanner.svelte';

	export let data;

	let popup = {
		visible: false,
		type: '',
		title: '',
		message: ''
	};

	let user = User.fromArray(data.userData);

	const pageHeader = {
		title: user.name + ' ' + user.surname
	};

	let errors = [];

	const updateUser = async () => {
		popup.visible = false;
		validateUser();

		if (errors.length) {
			popup.type = 'warning';
			popup.title = 'Lūdzu aizpildiet visus obligātos laukus!';

			return setTimeout(() => (popup.visible = true), 500);
		}

		await editUser(user);

		popup.type = 'success';
		popup.title = 'Veiksmīgi saglabāts lietotājs';

		await updatePage();

		return setTimeout(() => (popup.visible = true), 500);
	};

	const deleteUser = async () => {
		if (!confirm('Vai tiešām vēlaties dzēst lietotāju?')) {
			return;
		}

		const { success } = await deleteUserById(user.userId);

		if (!success) {
			return alert('Neizdevās izdzēst leitotāju!');
		}

		await goto('/manager/users/list');
	};

	const updatePage = async () => {
		await invalidateAll();

		user = User.fromArray(data.userData);
	};

	const validateUser = () => {
		errors = User.getRequiredFields().filter((field) => !user[field]);
	};
</script>

<PageHeader {...pageHeader}>
	<a href="/manager/users/list" class="btn">Aizvērt</a>
	<button class="btn btn-primary flex items-center mx-4" on:click={() => updateUser()}>
		<IconCheckBold />
		<span class="ml-2">Saglabāt</span>
	</button>
	<button class="btn btn-danger flex items-center" on:click={deleteUser}>
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

<UserForm {user} on:shouldUpdate={updatePage} {errors} />
