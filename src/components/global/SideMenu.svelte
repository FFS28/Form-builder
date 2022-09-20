<script lang="ts">
	import { page } from '$app/stores';
	import type { MenuItem } from '$lib/types';
	import AccountMultiple from 'svelte-material-icons/AccountMultiple.svelte';
	import FileDocument from 'svelte-material-icons/FileDocument.svelte';
	import File from 'svelte-material-icons/File.svelte';
	import Eye from 'svelte-material-icons/Eye.svelte';
	import ClipboardAccount from 'svelte-material-icons/ClipboardAccount.svelte';

	let menuItems: MenuItem[] = [];

	if ($page.data.user.isLoggedIn) {
		menuItems = [
			{
				url: '/manager/users/list',
				name: 'Lietotāji',
				icon: AccountMultiple,
				role: 'LIETOTAJS_SKATIT'
			},
			{
				url: '/manager/roles/list',
				name: 'Lietotāju lomas',
				icon: ClipboardAccount
			},
			{
				url: '/manager/codifier/list',
				name: 'Kodifikatori',
				icon: FileDocument,
				role: 'ORG'
			},
			{
				url: '/manager/program/list',
				name: 'Mērķa atbalsta programmas',
				icon: File,
				role: 'ORG'
			},
			{
				url: '/manager/contest/list',
				name: 'MAP konkursi',
				icon: File,
				role: 'ORG'
			},
			{
				url: '/manager/audit/list',
				name: 'Audits (Portals)',
				icon: Eye,
				role: 'ORG_ADMIN'
			}
		].filter((item) => {
			return $page.data.user.roles.find((r) => r.role === item.role || item.role === undefined) !== undefined
		});
	} else {
		menuItems = [
			{
				url: '/about',
				name: 'Par sistēmu'
			}
		];
	}
</script>

<aside class="side-menu offset-top sticky">
	<ul>
		{#each menuItems as item}
			<li>
				<a class="side-menu-item" class:active={item.url === $page.url.pathname} href={item.url}>
					<span class="pt-1">
						<svelte:component this={item.icon} />
					</span>
					<span class="pl-1">{item.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</aside>

<style lang="scss">
	.offset-top {
		top: 3.4rem;
	}

	.side-menu-item {
		@apply flex font-bold px-3 py-2 hover:bg-gray-200;

		&.active {
			@apply bg-gray-200;
		}
	}
</style>
