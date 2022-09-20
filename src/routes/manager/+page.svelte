<script>
	import DashItem from '$components/DashItem.svelte';

	let dashItems = [
		{
			title: 'Lietotāji',
			desc: 'Pilns sistēmas lietotāju saraksts',
			url: '/manager/users/list'
		},
		{
			title: 'Kodifikatori',
			desc: 'Sistēmas kodifikatori',
			url: '/manager/codifier/list'
		},
		{
			title: 'Programmas',
			desc: 'Saraksts ar mērķa atbalsta programmām',
			url: '/manager/program/list'
		},
		{
			title: 'Audits (Portāls)',
			desc: 'Portāla auditācijas ieraksti',
			url: '/manager/audit/list'
		}
	];
</script>

<div class="m-4">
	<div class="grid grid-cols-2 gap-4">
		{#each dashItems as item}
			<DashItem {...item} />
		{/each}
	</div>
</div>
