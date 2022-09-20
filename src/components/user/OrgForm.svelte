<script>
  import DatePicker from '$components/global/form/DatePicker.svelte';
  import FormCheckbox from '$components/global/form/FormCheckbox.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import IconTrashCan from 'svelte-material-icons/TrashCan.svelte';
	import PopupBanner from '$components/PopupBanner.svelte';
	import { format } from 'date-fns';
	import { UserOrg } from '$structures/user/user';
  import { deepEqual, objectEquals } from '$lib/helpers';
	import { saveUserOrg, deleteUserOrgById, getUserOrg } from '$services/userService';
	import { createEventDispatcher, onMount } from 'svelte';

	/** @type {UserOrg} */
	let userOrg = new UserOrg();
  let originalUserOrg = new UserOrg();
  let userOrgLoaded = false;
  let title = '';
  let userOrgDates = {
    dateFrom: null,
    dateTo: null
  };
  let originalUserOrgDates = userOrgDates;

  const dispatch = createEventDispatcher();

  export let userId;
  export let modal = null;
  export let userOrgChanged = false;
	export let errors = [];

  onMount(async () => {
    await getInitialData();
    setTitle();
    userOrgLoaded = true;
  });

  async function getInitialData() {
    if (!modal || !modal.selectedId) {
      return;
    }

    const { success, userOrgData } = await getUserOrg(modal.selectedId);

    if (!success) {
      return console.error('Neizdevās atrast uzņēmumu!');
    }

    setPristine(userOrgData);
  }

  const popup = {
    title: '',
    message: '',
    type: '',
    visible: false
  };

  $: showDeleteButton = () => {
    return userOrg.userOrgId;
  };

  async function deleteUserOrg() {
    const { success, errorMessage } = await deleteUserOrgById(userOrg.userOrgId);

    if (!success) {
      popup.type = 'error';
      popup.title = 'Neizdevās izdzēst uzņēmumu!';
      popup.message = errorMessage;
      popup.visible = true;

      return;
    }

    hideDrawer();
  }

  const saveOrg = async () => {
    popup.visible = false;
    formatDates();
    validateOrg();

    userOrg.userId = userId;

    if (errors.length) {
      popup.type = 'error';
      popup.title = 'Neizdevās pievienot uzņēmumu';
      popup.message = 'Lūdzu aizpildiet visus obligātos laukus!';
      popup.visible = true;
      return;
    }

    const { success, userOrgData, errorMessage } = await saveUserOrg(userOrg);

    if (success) {
      popup.type = 'success';
      popup.title = 'Veiksmīgi saglabāts uzņēmums';
      popup.message = '';
    } else if (errorMessage) {
      popup.type = 'error';
      popup.title = 'Neizdevās pievienot uzņēmumu';
      popup.message = errorMessage;
    }
    popup.visible = true;

    setPristine(userOrgData);
    setTitle();
  };

  const validateOrg = () => {
    errors = UserOrg.getRequiredFields().filter((field) => !userOrg[field]);
  };

  const parseDates = () => {
    userOrgDates = {
      dateFrom: userOrg.dateFrom ? new Date(userOrg.dateFrom) : null,
      dateTo: userOrg.dateTo ? new Date(userOrg.dateTo) : null
    };
  }

  const formatDates = () => {
    if (userOrgDates.dateFrom) {
      userOrg.dateFrom = format(userOrgDates.dateFrom, 'yyyy-MM-dd');
    }
    if (userOrgDates.dateTo) {
      userOrg.dateTo = format(userOrgDates.dateTo, 'yyyy-MM-dd');
    }
  };

  const setPristine = (userOrgData) => {
    userOrg = userOrgData;
    parseDates();
    originalUserOrg = JSON.parse(JSON.stringify(userOrgData));
    originalUserOrgDates = { ...userOrgDates };
  }

  const setTitle = () => {
    title = 'Uzņēmuma rediģēšana';
    if (!userOrg || !userOrg.userOrgId) {
      title = 'Jauna uzņēmuma pievienošana';
    }
  }

  $: hasInputError = (field) => {
    return errors.includes(field);
  };

  $: userOrgChanged =
    !deepEqual(userOrg, originalUserOrg) || !objectEquals(userOrgDates, originalUserOrgDates);

  function hideDrawer() {
    dispatch('closeDrawer');
  }

  function confirmHideDrawer() {
    if (userOrgChanged) {
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

{#if userOrgLoaded}
  <!-- Header -->
  <div class="sticky top-0 py-3 px-5 bg-white border-b-2 border-gray-200 z-10">
    <div class="flex items-center">
      <h3 class="text-xl text-black font-bold mr-2">{title}</h3>

      <div class="ml-auto flex items-center">
        {#if !userOrg.isFromUr}
          <button class="btn btn-primary flex items-center mx-4" on:click={saveOrg}>
            <span class="mr-2"><IconCheckBold /></span>
            Saglabāt
          </button>
        {/if}

        {#if !userOrg.isFromUr && showDeleteButton()}
          <button class="btn btn-danger flex items-center mr-4" on:click={deleteUserOrg}>
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
        <FormInput
          label="Uzņēmuma nosaukums"
          name="title"
          bind:value={userOrg.title}
          isDisabled={userOrg.isFromUr}
          showError={hasInputError('title')}
        />
      </div>
      <div class="grid mt-3">
        <FormInput
          label="Reģistrācijas Nr."
          name="regNr"
          bind:value={userOrg.regNr}
          isDisabled={userOrg.isFromUr}
          showError={hasInputError('regNr')}
        />
      </div>
      <div class="grid mt-3">
        <h4 class="font-bold mb-1.5">Darbības periods</h4>
        <div class="flex">
          <div class="flex items-center mr-2">
            <span class="mr-2">No: </span>
            <DatePicker
              bind:max={userOrgDates.dateTo}
              bind:value={userOrgDates.dateFrom}
              isDisabled={userOrg.isFromUr}
              showError={hasInputError('dateFrom')}
            />
          </div>
          <div class="flex items-center">
            <span class="mr-2">Līdz: </span>
            <DatePicker
              bind:min={userOrgDates.dateFrom}
              bind:value={userOrgDates.dateTo}
              isDisabled={userOrg.isFromUr}
              showError={hasInputError('dateTo')}
            />
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="grid mt-5 items-center">
          <FormCheckbox
              label="Saņemts no UR"
              name="isFromUr"
              isDisabled={true}
              bind:value={userOrg.isFromUr}
            />
        </div>
      </div>
    </div>
  </div>
{/if}
