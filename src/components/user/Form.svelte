<script>
  import Drawer from '$components/Drawer.svelte';
	import FormInput from '$components/global/form/FormInput.svelte';
	import FormPassword from '$components/global/form/FormPassword.svelte';
	import FormCheckbox from '$components/global/form/FormCheckbox.svelte';
	import FormDropdown from '$components/global/form/FormDropdown.svelte';
	import RoleForm from '$components/user/RoleForm.svelte';
	import RoleList from '$components/user/RoleList.svelte';
	import OrgForm from '$components/user/OrgForm.svelte';
	import OrgList from '$components/user/OrgList.svelte';
	import { createEventDispatcher } from 'svelte';

	/** @type {User} */
	export let user;
	export let errors;
	const dispatch = createEventDispatcher();
	const TAB_ROLES = 'userRoles';
	const TAB_ORG = 'userOrgs';

  const initialTabs = [
    { name: TAB_ROLES, title: 'Lomas' },
    { name: TAB_ORG, title: 'Saistītie uzņēmumi' },
  ];

  const modals = {
    role: { selectedId: null, selectedIdx: null, isVisible: false, confirmText: 'Vai tiešām vēlaties aizvērt lomu bez saglabāšanas?' },
    org: { selectedId: null, selectedIdx: null, isVisible: false, confirmText: 'Vai tiešām vēlaties aizvērt uzņēmumu bez saglabāšanas?' }
  }

  let activeTab = TAB_ROLES;
  let activeTabClasses = 'bg-white border-t border-r border-l -mb-px';
  let userRoleChanged = false;
  let userOrgChanged = false;

  export let statusItems = [
    { value: 'Aktīvs', name: 'Aktīvs'},
    { value: 'Neaktīvs', name: 'Neaktīvs'},
    { value: 'Bloķēts', name: 'Bloķēts'},
  ]

  const showModalForm = (formName, formId, idx) => {
    modals[formName].selectedId = formId;
    modals[formName].selectedIdx = idx;
    modals[formName].isVisible = true;
  };

  const onModalUpdated = () => dispatch('shouldUpdate');

  const closeModalForm = (formName, requireConfirmation) => {
    if (requireConfirmation) {
      if (confirm(modals[formName].confirmText)) {
        modals[formName].isVisible = false;
        modals[formName].selectedId = null;
        modals[formName].selectedIdx = null;

        dispatch('shouldUpdate');
      }
    } else {
      modals[formName].isVisible = false;
      modals[formName].selectedId = null;
      modals[formName].selectedIdx = null;
      dispatch('shouldUpdate');
    }
  };

  $: filteredTabs = initialTabs.filter(tab => tab.name != TAB_ORG || user.isExpert)

	$: hasInputError = (field) => {
		return errors.includes(field);
	};

</script>

<div class="m-4">
	<div class="bg-white p-3 mb-3" id="user-form">
		<div class="grid grid-cols-3 gap-4">
				<FormInput
					label="Vārds"
					name="name"
					bind:value={user.name}
					showError={hasInputError('name')}
				/>
        <FormInput
            label="Uzvārds"
            name="surname"
            bind:value={user.surname}
            showError={hasInputError('surname')}
          />
        <div class="grid grid-cols-2 gap-4">
          <FormInput
              label="Personas kods / eIDAS"
              name="personalCode"
              bind:value={user.personalCode}
              showError={hasInputError('personalCode')}
            />
          <div class="grid mt-5 items-center">
            <FormCheckbox
                label="Bez personas identifikatora"
                name="isWithoutPersonId"
                bind:value={user.isWithoutPersonId}
              />
          </div>
        </div>
		</div>
		<div class="grid grid-cols-3 gap-4 mt-3">
        <FormInput
            label="Piezīmes"
            name="notes"
            bind:value={user.notes}
            showError={hasInputError('notes')}
          />
    </div>
    <div class="grid grid-cols-3 gap-4 mt-3">
        <FormInput
            label="E-pasta adrese"
            name="email"
            bind:value={user.email}
            showError={hasInputError('email')}
          />
        <div class="grid grid-cols-2 gap-4">
          <FormInput
              label="Tālruņa numurs"
              name="phoneNr"
              bind:value={user.phoneNr}
              showError={hasInputError('phoneNr')}
            />
        </div>
    </div>
    <hr class="my-3" />
    <div class="grid grid-cols-3 gap-4">
      <div>
        <FormPassword
            label="Parole"
            name="pwd"
            bind:value={user.pwd}
            showError={hasInputError('pwd')}
          />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid mt-5 items-center">
          <FormCheckbox
              label="Nosūtīt e-pastā"
              name="sendPwdEmail"
              bind:value={user.sendPwdEmail}
            />
        </div>
        <FormDropdown
            label="Statuss"
            name="status"
            items={statusItems}
            bind:value={user.status}
            placeholder="Izvēlies"
            showError={hasInputError('status')}
          />
      </div>
    </div>
	</div>
	<ul id="tabs" class="inline-flex w-full border-b">
    {#each filteredTabs as tab}
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
    {#if activeTab === TAB_ROLES}
      <RoleList
          roles={user.userRoles}
          on:rolesUpdated={onModalUpdated}
          on:showModalForm={({ detail }) => showModalForm('role', detail.roleId, detail.idx)}
        />
    {:else if activeTab === TAB_ORG}
      <OrgList
          orgs={user.userOrgs}
          on:orgsUpdated={onModalUpdated}
          on:showModalForm={({ detail }) => showModalForm('org', detail)}
        />
    {/if}
  </div>

	<Drawer navWidth={25} bind:show={modals.role.isVisible} on:close={() => closeModalForm('role', userRoleChanged)}>
		<RoleForm {user} on:closeDrawer={() => closeModalForm('role', false)} modal={modals.role} bind:userRoleChanged />
	</Drawer>

	<Drawer navWidth={25} bind:show={modals.org.isVisible} on:close={() => closeModalForm('org', userOrgChanged)}>
    <OrgForm {user} userId={user.userId} on:closeDrawer={() => closeModalForm('org', false)} modal={modals.org} bind:userOrgChanged />
  </Drawer>
</div>
