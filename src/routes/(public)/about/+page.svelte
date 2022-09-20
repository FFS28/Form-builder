<script>
	import Breadcrumbs from '$components/public/Breadcrumbs.svelte';
	import Cards from '$components/public/Cards.svelte';

	let breadcrumbs = [
		{
			href: '/',
			label: 'Sākums'
		},
		{
			href: '/about',
			label: 'Par sistēmu'
		}
	];
	let title = 'Par sistēmu';
</script>

<Breadcrumbs {breadcrumbs} {title} />

<div class="bg-white py-10 mt-6 flex-1">
	<div class="flex container mx-auto flex-col">
		<p>
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt quasi neque, earum dolorum
			dignissimos amet eum consectetur asperiores est blanditiis iusto labore doloribus molestias
			sapiente. Molestias at incidunt sint illo. Lorem, ipsum dolor sit amet consectetur adipisicing
			elit. Sunt quasi neque, earum dolorum dignissimos amet eum consectetur asperiores est
			blanditiis iusto labore doloribus molestias sapiente. Molestias at incidunt sint illo.Lorem,
			ipsum dolor sit amet consectetur adipisicing elit. Sunt quasi neque, earum dolorum dignissimos
			amet eum consectetur asperiores est blanditiis iusto labore doloribus molestias sapiente.
			Molestias at incidunt sint illo.Lorem, ipsum dolor sit amet consectetur adipisicing elit.
		</p>

		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi quam voluptates nemo libero
			corrupti consequuntur dolores. Quae dolorum, unde, maiores eius totam id dolor maxime quisquam
			adipisci quibusdam blanditiis nemo?
		</p>

		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi quam voluptates nemo libero
			corrupti consequuntur dolores. Quae dolorum, unde, maiores eius totam id dolor maxime quisquam
			adipisci quibusdam blanditiis nemo?
		</p>
	</div>
</div>

<div class="pb-10">
	<Cards />
</div>

<style>
	p {
		@apply py-2;
	}
</style>
