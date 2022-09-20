<script>
	export let title;
	export let desc;
	export let url;
</script>

<a href={url} class="border text-white">
	<h2 class="card__title">{title}</h2>
	<div class="card__body">
		<p>{desc}</p>
	</div>
</a>

<style lang="scss">
	.card {
		&__title {
			@apply py-5 px-3 text-lg;
			background-color: var(--green);
		}

		&__body {
			@apply py-1 px-3;
			background-color: var(--green-darker);
		}
	}
</style>
