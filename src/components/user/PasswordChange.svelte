<script>
  import { goto } from '$app/navigation';

	import FormPassword from '$components/global/form/FormPassword.svelte';
	import PopupBanner from '$components/PopupBanner.svelte';
	import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
	import { PwdChange } from '$structures/pwdChange';
	import { changePwd } from '$services/pwdService';
	import { createEventDispatcher, onMount } from 'svelte';

	/** @type {PwdChange} */
	let pwdChange = new PwdChange();
  let pwdChangeLoaded = false;
  let errors = [];

  const dispatch = createEventDispatcher();

  onMount(async () => {
    pwdChangeLoaded = true;
  });

  const popup = {
    title: '',
    message: '',
    type: '',
    visible: false
  };

  const doChangePwd = async () => {
    popup.visible = false;
    validatePwdChange();

    if (errors.length) {
      popup.type = 'error';
      popup.title = 'Neizdevās nomainīt paroli';
      popup.message = 'Lūdzu aizpildiet visus obligātos laukus!';
      popup.visible = true;
      return;
    }

    const { success, errorMessage } = await changePwd(pwdChange);

    if (errorMessage) {
      popup.type = 'error';
      popup.title = 'Neizdevās nomainīt paroli';
      popup.message = errorMessage;
      popup.visible = true;
      return;
    }

    hideDrawer();
    goto('/api/logout');
  }

  const validatePwdChange = () => {
    errors = PwdChange.getRequiredFields().filter((field) => !pwdChange[field]);
  };

  $: hasInputError = (field) => {
    return errors.includes(field);
  };

  function hideDrawer() {
    dispatch('closeDrawer');
  }

</script>

{#if pwdChangeLoaded}
  <!-- Header -->
  <div class="sticky top-0 py-3 px-5 bg-white border-b-2 border-gray-200 z-10">
    <div class="flex items-center">
      <h3 class="text-xl text-black font-bold mr-2">Paroles nomaiņa</h3>

      <div class="ml-auto flex items-center">
        <button class="btn btn-primary flex items-center mx-4" on:click={doChangePwd}>
          <span class="mr-2"><IconCheckBold /></span>
          Saglabāt
        </button>

        <button class="btn" on:click={hideDrawer} style="color: rgb(68, 68, 68)">Aizvērt</button>
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
  <div class="grid m-4" style="color: rgb(68, 68, 68)">
    <div class="bg-white p-3 mb-3" id="pwd-form">
      <div class="grid mt-3">
        <FormPassword
          label="Šībrīža parole"
          name="pwdOld"
          bind:value={pwdChange.pwdOld}
          showError={hasInputError('pwdOld')}
        />
      </div>
      <div class="grid mt-3 ">
        <FormPassword
          label="Jaunā parole (vismaz 9 simboli)"
          name="pwdNew"
          bind:value={pwdChange.pwdNew}
          showError={hasInputError('pwdNew')}
        />
      </div>
      <div class="grid mt-3">
        <FormPassword
          label="Jaunā parole atkārtoti"
          name="pwdRepeat"
          bind:value={pwdChange.pwdRepeat}
          showError={hasInputError('pwdRepeat')}
        />
      </div>
    </div>
  </div>
{/if}
