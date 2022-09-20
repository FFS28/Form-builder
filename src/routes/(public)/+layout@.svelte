<script>
	import Footer from '$components/public/Footer.svelte';
	import PublicHeader from '$components/public/Header.svelte';
	import PageTitle from '$components/PageTitle.svelte';
</script>

<PageTitle title="Mērķa finansējuma izlietojuma pārvaldības platforma" />

<div class="flex flex-col min-h-screen">
	<PublicHeader />

	<main class="main public flex-1 flex flex-col">
		<slot />
	</main>

	<div class="mt-auto">
		<Footer />
	</div>
</div>
