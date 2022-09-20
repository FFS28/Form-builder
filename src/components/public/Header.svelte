<script>
	import IconWeb from 'svelte-material-icons/Web.svelte';
	import IconWaterOpacity from 'svelte-material-icons/WaterOpacity.svelte';

	let menuItems = [
		{
			label: 'Programmas',
			url: '/programs'
		},
		{
			label: 'Konkursi',
			url: '/contests'
		},
		{
			label: 'Autorizēties',
			url: '/login'
		}
	];
</script>

<header class="fixed top-0 w-full left-0 bg-white z-10">
	<div class="flex container mx-auto items-center">
		<a class="site-logo" href="/">
			<img class="site-logo__img" src="/images/sif-logo.png" alt="" />
		</a>
		<div class="site-text">
			Mērķa finansējuma izlietojuma<br />pārvaldības platforma
		</div>
		<nav class="mx-auto">
			<ul class="flex">
				{#each menuItems as item}
					<li class="mx-1">
						<a class="px-2 py-1" href={item.url}>{item.label}</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="bordered flex gap-2">
			<a href="/" class="text-center flex flex-col items-center">
				<IconWeb size="22" />
				<span>Language</span></a
			>
			<a href="/" class="text-center flex flex-col items-center">
				<IconWaterOpacity size="22" />
				<span>Iestatījumi</span></a
			>
		</div>
	</div>
</header>

<style lang="scss">
	.site-logo {
		@apply py-3 px-3;

		border-left: 10px solid var(--red);

		&__img {
			@apply w-auto;

			height: 46px;
		}
	}

	.site-text {
		@apply pl-3 ml-3;
		border-left: 1px solid lightgray;
	}

	.bordered a {
		@apply px-2;
		&:first-child {
			border-right: 1px solid lightgray;
		}
	}
</style>
