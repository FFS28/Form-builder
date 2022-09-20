<script>
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	import Menu from 'svelte-material-icons/Menu.svelte';
	import UserMenu from './UserMenu.svelte';
	import MenuRight from './MenuRight.svelte';

	const dispatch = createEventDispatcher();

	function toggleMenu() {
		dispatch('toggleSideMenu');
	}

	let homeUrl = '/';
	if ($page.data.user.isLoggedIn) {
		homeUrl = '/manager';
	}
</script>

<header class="header text-white sticky z-20 top-0 w-full flex items-center">
	<div class="basis-2/12 text-center">
		<a href={homeUrl} class="site-logo block text-lg py-3 px-2">
			<span>MAP</span>
		</a>
	</div>
	<div class="basis-auto">
		<button class="toggle-side-menu menu-item" on:click={toggleMenu}>
			<Menu />
		</button>
	</div>
	<div class="basis-auto grow">
		<nav class="flex items-center justify-end sm:justify-between header-nav pl-4">
			<h1 class="text-lg m-0 hidden sm:block">
				Mērķa finansējuma izlietojuma pārvaldības platforma
			</h1>
			<div class="header-nav__right">
				{#if $page.data.user.isLoggedIn}
					<UserMenu />
				{:else}
					<MenuRight />
				{/if}
			</div>
		</nav>
	</div>
</header>

<style lang="scss">
	.header {
		background-color: var(--green);
	}

	.site-logo {
		&:hover {
			text-decoration: underline;
			background-color: rgba(black, 0.1);
		}
	}
</style>
