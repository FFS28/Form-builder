<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import IconTrashCan from 'svelte-material-icons/TrashCan.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import PopupBanner from '$components/PopupBanner.svelte';
	import { saveRole, deleteRole, getPermissionsList } from '$services/roleService';
	import FormMultiSelectDropdown from '$components/global/form/FormMultiSelectDropdown.svelte';

	export let selectedRole = {
		tiesibas: []
	};
	export let editMode = true;

	let selectedPermissions = [];
	let isLoaded = false;
	$: isLoaded;
	$: selectedPermissions;

	let errors = [];
	let permissions = [];

	$: permissions;

	const popup = {
		title: '',
		message: '',
		type: '',
		visible: false
	};

	const dispatch = createEventDispatcher();

	function hideDrawer() {
		dispatch('closeDrawer');
	}

	$: hasInputError = (field) => {
		return errors.includes(field);
	};

	async function save() {
		delete selectedRole.saturs;

		if (selectedPermissions) {
			selectedRole.tiesibas = [];

			selectedPermissions.forEach((permission) => {
				selectedRole.tiesibas.push({ adm_tiesibas_id: permission.value });
			});
		}

		const { success } = await saveRole(selectedRole);

		if (success) {
			hideDrawer();
		}
	}

	async function removeRole() {
		if (confirm('Vai tiešām vēlaties dzēst lomu?')) {
			const { success } = await deleteRole(selectedRole.id);
			if (success) {
				hideDrawer();
			}
		}
	}

	async function getPermissions() {
		const permissionsData = await getPermissionsList('');
		permissionsData.data.forEach((permission) => {
			permissions.push({
				value: permission.id,
				label: permission.kods
			});
		});
		permissions = [...permissions];
	}

	onMount(async () => {
		await getPermissions();

		if (selectedRole && selectedRole.saturs) {
			selectedRole.saturs.forEach((permission) => {
				const match = permissions.find((p) => p.label === permission.kods);
				selectedPermissions.push({
					value: match.value,
					label: match.label
				});
			});

			selectedPermissions = [...selectedPermissions];
		}

		isLoaded = true;
	});
</script>

{#if isLoaded}
	<div>
		<!-- header -->
		<div class="py-3 px-5">
			<div class="flex items-center">
				<h3 class="text-xl text-black font-bold mr-2">
					{editMode ? 'Lietotāju lomas rediģēšana' : 'Lietotāju lomas pievienošana'}
				</h3>

				<div class="ml-auto flex items-center">
					{#if !selectedRole.ir_sistemas}
						<button class="btn btn-primary flex items-center" on:click={save}>
							<span class="mr-2"><IconCheckBold /></span>
							Saglabāt
						</button>
					{/if}
					{#if !selectedRole.ir_sistemas}
						<button class="btn btn-danger flex items-center mx-4" on:click={removeRole}>
							<span class="mr-2"><IconTrashCan /></span>
							Dzēst
						</button>
					{/if}
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
				name="roleName"
				label="Lomas nosaukums"
				bind:value={selectedRole.nosaukums}
				maxlength={200}
				isDisabled={selectedRole.ir_sistemas}
				showError={hasInputError('nosaukums')}
			/>

			<div class="mt-3">
				<FormMultiSelectDropdown
					items={permissions}
					bind:selectedItems={selectedPermissions}
					label="Lomas piekļuves tiesības"
					showError={false}
					isDisabled={selectedRole.ir_sistemas}
				/>
			</div>
		</div>
	</div>
{/if}
