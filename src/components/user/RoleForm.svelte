<script>
  import DatePicker from '$components/global/form/DatePicker.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import FormDropdown from '$components/global/form/FormDropdown.svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import IconTrashCan from 'svelte-material-icons/TrashCan.svelte';
	import PopupBanner from '$components/PopupBanner.svelte';
	import { format } from 'date-fns';
	import { UserRole } from '$structures/user/user';
	import { getCodifierByCode } from '$services/codifierService';
  import { deepEqual, objectEquals } from '$lib/helpers';
	import { saveUserRole, deleteUserRoleById, getRoles, getUserRole } from '$services/userService';
	import { createEventDispatcher, onMount } from 'svelte';

	/** @type {UserRole} */
	let userRole = new UserRole();
  let originalUserRole = new UserRole();
  let userRoleLoaded = false;
  let userRoleDates = {
    dateFrom: null,
    dateTo: null
  };
  let originalUserRoleDates = userRoleDates;

  const dispatch = createEventDispatcher();

  export let user;
  export let modal = null;
  export let title;
  export let userRoleChanged = false;
	export let errors = [];
	export let countryItems = [];
  export let roleItems = [];


  onMount(async () => {
    await getInitialData();
    setTitle();
    userRoleLoaded = true;
  });

  async function getInitialData() {
    const { codifierData } = await getCodifierByCode('VALSTS');
    const { roles }  = await getRoles();

    countryItems = codifierData.map((item) => {
      return {
        name: item.nosaukums,
        value: item.nosaukums
      };
    });

    roleItems = roles.map((item) => {
      return {
        name: item.nosaukums,
        value: item.nosaukums
      };
    });

    if (!modal.selectedId) {
      if (modal.selectedIdx === 0 || !!modal.selectedIdx) {
        const userRoleData = user.userRoles[modal.selectedIdx];
        setPristine(userRoleData);
      } else {
        return;
      }
    } else {
      const { success, userRoleData } = await getUserRole(modal.selectedId);

      if (!success) {
        return console.error('Neizdevās atrast lomu!');
      }

      setPristine(userRoleData);
    }


  }

  const popup = {
    title: '',
    message: '',
    type: '',
    visible: false
  };

  $: showDeleteButton = () => {
    return userRole.userId !== undefined;
  };

  async function deleteUserRole() {
    if (userRole.userRoleId) {
      const { success, errorMessage } = await deleteUserRoleById(userRole.userRoleId);

      if (!success) {
        popup.type = 'error';
        popup.title = 'Neizdevās izdzēst lomu!';
        popup.message = errorMessage;
        popup.visible = true;

        return;
      }
    } else {
      user.userRoles.splice(modal.selectedIdx, 1);
    }

    hideDrawer();
  }

  const saveRole = async () => {
    popup.visible = false;
    formatDates();
    validateRole();

    userRole.userId = user.userId;

    if (errors.length) {
      popup.type = 'error';
      popup.title = 'Neizdevās pievienot lomu';
      popup.message = 'Lūdzu aizpildiet visus obligātos laukus!';
      popup.visible = true;
      return;
    }

    if (!userRole.userId) {
      if (modal.selectedIdx === null || modal.selectedIdx === undefined) {
        user.userRoles = [...user.userRoles, userRole];
        modal.selectedIdx = user.userRoles.length - 1;
      } else {
        user.userRoles[modal.selectedIdx] = userRole;
      }

      setPristine(userRole);
      setTitle();

      popup.type = 'success';
      popup.title = 'Veiksmīgi saglabāta loma';
      popup.message = '';
      popup.visible = true;

      return;
    }

    const { success, userRoleData, errorMessage } = await saveUserRole(userRole)

    if (success) {
      popup.type = 'success';
      popup.title = 'Veiksmīgi saglabāta loma';
      popup.message = '';

      if (modal.selectedIdx === null || modal.selectedIdx === undefined) {
        user.userRoles = [...user.userRoles, userRole];
        modal.selectedIdx = user.userRoles.length - 1;
      } else {
        user.userRoles[modal.selectedIdx] = userRole;
      }
    } else if (errorMessage) {
      popup.type = 'error';
      popup.title = 'Neizdevās pievienot lomu';
      popup.message = errorMessage;
    }
    popup.visible = true;

    setPristine(userRoleData);
    setTitle();
  };

  const validateRole = () => {
    errors = UserRole.getRequiredFields().filter((field) => !userRole[field]);
  };

  const parseDates = () => {
    userRoleDates = {
      dateFrom: userRole.dateFrom ? new Date(userRole.dateFrom) : null,
      dateTo: userRole.dateTo ? new Date(userRole.dateTo) : null
    };
  }

  const formatDates = () => {
    if (userRoleDates.dateFrom) {
      userRole.dateFrom = format(userRoleDates.dateFrom, 'yyyy-MM-dd');
    }
    if (userRoleDates.dateTo) {
      userRole.dateTo = format(userRoleDates.dateTo, 'yyyy-MM-dd');
    }
  };

  const setTitle = () => {
    title = 'Lomas rediģēšana';
    if (userRole.userId === undefined) {
      title = 'Jaunas lomas pievienošana';
    }
  }

  const setPristine = (userRoleData) => {
    userRole = userRoleData;
    parseDates();
    originalUserRole = JSON.parse(JSON.stringify(userRoleData));
    originalUserRoleDates = { ...userRoleDates };
  }

  $: hasInputError = (field) => {
    return errors.includes(field);
  };

  $: userRoleChanged =
    !(deepEqual(userRole, originalUserRole) && objectEquals(userRoleDates, originalUserRoleDates));

  function hideDrawer() {
    user.userRoles = user.userRoles;
    dispatch('closeDrawer');
  }

  function confirmHideDrawer() {
    if (userRoleChanged) {
      if (confirm(modal.confirmText)) {
        hideDrawer();
      } else {
        return;
      }
    } else {
      hideDrawer();
    }
  }

</script>

{#if userRoleLoaded}
  <!-- Header -->
  <div class="sticky top-0 py-3 px-5 bg-white border-b-2 border-gray-200 z-10">
    <div class="flex items-center">
      <h3 class="text-xl text-black font-bold mr-2">{title}</h3>

      <div class="ml-auto flex items-center">
        <button class="btn btn-primary flex items-center mx-4" on:click={saveRole}>
          <span class="mr-2"><IconCheckBold /></span>
          Piešķirt
        </button>

        {#if showDeleteButton()}
          <button class="btn btn-danger flex items-center mr-4" on:click={deleteUserRole}>
            <IconTrashCan />
            <span class="ml-2">Dzēst</span>
          </button>
        {/if}

        <button class="btn" on:click={confirmHideDrawer}>Aizvērt</button>
      </div>
    </div>
  </div>

  <div class="my-3 mx-4">
    <PopupBanner
      background={true}
      title={popup.title}
      message={popup.message}
      popupType={popup.type}
      showPopup={popup.visible}
    />
  </div>
  <div class="m-4">
    <div class="bg-white p-3 mb-3" id="user-form">
      <div class="grid">
        <FormDropdown
          label="Loma"
          name="role"
          items={roleItems}
          bind:value={userRole.role}
          placeholder="Izvēlies"
          showError={hasInputError('role')}
        />
      </div>
      <div class="grid mt-3">
        <h4 class="font-bold mb-1.5">Darbības periods</h4>
        <div class="flex">
          <div class="flex items-center mr-2">
            <span class="mr-2">No: </span>
            <DatePicker
              bind:max={userRoleDates.dateTo}
              bind:value={userRoleDates.dateFrom}
              showError={hasInputError('dateFrom')}
            />
          </div>
          <div class="flex items-center">
            <span class="mr-2">Līdz: </span>
            <DatePicker
              bind:min={userRoleDates.dateFrom}
              bind:value={userRoleDates.dateTo}
              showError={hasInputError('dateTo')}
            />
          </div>
        </div>
      </div>
      <div class="grid mt-3">
        <FormDropdown
          label="Valsts"
          name="countryName"
          items={countryItems}
          bind:value={userRole.country}
          placeholder="Izvēlies"
          showError={hasInputError('country')}
        />
      </div>
      <div class="grid mt-3">
        <FormInput
          label="Uzņēmuma reģistrācijas Nr."
          name="orgNr"
          bind:value={userRole.orgNr}
          showError={hasInputError('orgNr')}
        />
      </div>
    </div>
  </div>
{/if}
