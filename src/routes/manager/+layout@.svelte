<script>
	import { protectedRoute } from '$lib/helpers';
	import Header from '$components/global/header/index.svelte';
	import SideMenu from '$components/global/SideMenu.svelte';
	import PageTitle from '$components/PageTitle.svelte';
	import { page } from '$app/stores';

	export async function load() {
		return protectedRoute($page);
	}

	let sideMenuVisible = true;

	function handleSideMenuState() {
		sideMenuVisible = !sideMenuVisible;
	}
</script>

<PageTitle title="Mērķa finansējuma izlietojuma pārvaldības platforma" />

<div>
	<Header on:toggleSideMenu={handleSideMenuState} />
	<div class="min-h-screen grid grid-cols-12">
		<div
			class="border-right side-menu-wrap {sideMenuVisible
				? 'col-span-12 xs:col-span-4 sm:col-span-2'
				: 'hidden'}"
		>
			<SideMenu />
		</div>

		<main class={sideMenuVisible ? 'hidden xs:block xs:col-span-8 sm:col-span-10' : 'col-span-12'}>
			<slot />
		</main>
	</div>
</div>

<style lang="scss" global>
	@import '../../assets/main';

	body {
		background-color: var(--gray-3);
	}

	.side-menu-wrap {
		background-color: var(--gray-1);
	}

	.border-right {
		border-right: 1px solid var(--gray-5);
	}
</style>
