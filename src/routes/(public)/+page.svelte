<script>
	import Cards from '$components/public/Cards.svelte';
</script>

<div>
	<div class="text-center mx-auto pt-32">
		<h1 class="text-xl uppercase">
			Mērķa finansējuma izlietojuma <br /> pārvaldības platforma
		</h1>

		<div class="mt-5 buttons">
			<a href="/login" class="btn px-10 h-10 btn-primary uppercase -mr-2">Autorizēties</a>
			<a href="/login" class="btn px-10 h-10 btn-secondary uppercase">Reģistrēties</a>
		</div>
	</div>

	<Cards />
</div>

<div class="bg-white">
	<div class="mt-[50px] py-[50px] mx-auto w-2/3">
		<h2 class="text-xl">Par sistēmu</h2>
		<p class="mt-2">
			Sistēmas apraksts Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore corrupti
			sequi sit odit deserunt accusantium quo. Ipsam nisi dicta sint sequi vitae voluptatum laborum,
			sit provident, alias, sunt reprehenderit distinctio.
		</p>

		<a href="/about" class="btn btn-secondary mt-5">Lasīt vairāk</a>
	</div>
</div>

<style>
	h1 {
		font-size: 2.7rem;
		line-height: 1.2;
	}
</style>
