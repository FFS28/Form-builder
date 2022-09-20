<script>
	import Modal from '$components/Modal.svelte';
	import UserLogin from '$components/user/login.svelte';

	let showLoginModal = false;

	let menuItems = [
		{
			url: '/about',
			name: 'Par sistēmu'
		}
	];
</script>

<ul class="menu-right flex items-center">
	{#each menuItems as item}
		<li>
			<a class="menu-item" href={item.url}>{item.name}</a>
		</li>
	{/each}

	<li>
		<button class="menu-item" on:click={() => (showLoginModal = true)}>Pieslēgties</button>
	</li>
</ul>

{#if showLoginModal}
	<Modal on:close={() => (showLoginModal = false)}>
		<UserLogin />
	</Modal>
{/if}
