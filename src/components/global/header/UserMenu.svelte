<script>
	import { page } from '$app/stores';
	import Drawer from '$components/Drawer.svelte';
	import PasswordChange from '$components/user/PasswordChange.svelte';

	// Dropdown
	let open = false;
	let pwdChangeIsVisible = false;

	function handleVisibility() {
		open = !open;
	}

	function handlePwdChangeDrawer(isVisible) {
		pwdChangeIsVisible = isVisible;
		open = false;
	}

	const { user } = $page.data;

	// username
	const userFullName = user.firstName + ' ' + user.lastName;
	const userName = userFullName + ', darbinieks';

	// User menu items
	let menuItems = [
		{
			route: '/',
			name: 'Organizācijas darbinieks'
		},
		{
			route: '/',
			name: 'Test: UNISO, darbinieks'
		}
	];
</script>

<div class="user-menu">
	<button class="user-menu__toggle menu-item" on:click={handleVisibility}>{userName}</button>
	{#if open}
		<div class="user-menu__dropdown">
			<ul>
				<li>
					<p class="user-menu__list-item">{userFullName}</p>
				</li>
				{#each menuItems as item}
					<li>
						<p class="user-menu__list-item">{item.name}</p>
					</li>
				{/each}
				<li>
					<button
						class="user-menu__list-item user-menu__list-item--link"
						on:click={() => handlePwdChangeDrawer(true)}>Paroles maiņa</button
					>
				</li>
				<li>
					<a class="user-menu__list-item user-menu__list-item--link" href="/api/logout"
						>Beigt darbu</a
					>
				</li>
			</ul>
		</div>
	{/if}

	<Drawer
		navWidth={25}
		bind:show={pwdChangeIsVisible}
		on:close={() => handlePwdChangeDrawer(false)}
	>
		<PasswordChange on:closeDrawer={() => handlePwdChangeDrawer(false)} />
	</Drawer>
</div>

<style lang="scss">
	.user-menu {
		position: relative;

		&__dropdown {
			@apply absolute top-full right-0 bg-white border;

			width: 280px;

			color: var(--text-color);

			border-color: rgba(black, 0.15);
			box-shadow: 0 6px 12px rgba(black, 0.175);
		}

		&__list {
			&-item {
				@apply block px-3 py-2 border-b;
				border-color: var(--border-color);

				&--link {
					&:hover {
						background-color: var(--gray-2);
					}
				}
			}
		}
	}
</style>
