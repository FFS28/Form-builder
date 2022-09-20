<script>
  import { invalidate } from '$app/navigation';

  import PageHeader from '$components/PageHeader.svelte';
  import UserForm from '$components/user/Form.svelte';
  import { User } from '$structures/user/user';
  import IconCheckBold from 'svelte-material-icons/CheckBold.svelte';
  import { addUser } from '$services/userService';
  import { goto } from '$app/navigation';
  import PopupBanner from '$components/PopupBanner.svelte';

  let user = new User();

  const pageHeader = {
    title: 'Jauna lietotāja pievienošana'
  };

  let popup = {
    visible: false,
    type: '',
    title: '',
    message: ''
  };

  let errors = [];

  const addNewUser = async () => {
    popup.visible = false;
    validateUser();

    if (errors.length) {
      popup.type = 'warning';
      popup.title = 'Lūdzu aizpildiet visus obligātos laukus!';

      return setTimeout(() => (popup.visible = true), 500);
    }

    const { success, userId, errorMessage } = await addUser(user);

    if (!success) {
      popup.title = errorMessage || 'Neizdevās pievienot jaunu lietotāju!';
      popup.type = 'error';
      return setTimeout(() => (popup.visible = true), 500);
    } else {
      popup.type = 'success';
      popup.title = 'Veiksmīgi saglabāts lietotājs';
      if (userId > 0) {
        await goto(`/manager/users/${userId}`);
      }
    };
  };

  const updatePage = async () => {
    await invalidate(`/manager/users/${user.userId}`);

    user = user;
  };

  const validateUser = () => {
    errors = User.getRequiredFields().filter((field) => !user[field]);
  };
</script>

<PageHeader {...pageHeader}>
  <a href="/manager/users/list" class="btn">Aizvērt</a>
  <button class="btn btn-primary flex items-center mx-4" on:click={addNewUser}>
    <span class="mr-2"><IconCheckBold /></span>
    Saglabāt
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
