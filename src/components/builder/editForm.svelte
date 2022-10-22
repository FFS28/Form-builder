<script>

	import { createEventDispatcher } from 'svelte';
	export let id = 0;
	export let field_name = "Lauka-nosaukums";
    export let name = "";
    export let type = "text";
    export let required = false;
    export let validation = "";
    export let options = {
		numRows: false,
		numLength: false,
		itemType: false,  // ["text", "number", "email"]
		isVertical: false,
		addItems: false,
		addTableRowsCols: false
	};
	
	let maxlength = 60;
    let isDisabled = true;
	let hovering = false;
	let notitle = false;
	let showError = false;
	
	const dispatch = createEventDispatcher();

	const removeItem = () => {dispatch('removeItem')}

	const validationCheck = (_validation, _value) => {
		return false;
	}
	
	$: showError = validationCheck(validation, name)
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="my-4" id="editform-{id}"
	on:mouseover="{() => hovering = true}" 
	on:mouseleave="{() => hovering = false}" >
	<label for={name} class="font-bold block mb-1.5 text-left">
		{field_name}
		{#if hovering}
			<span class:hovering class="text-red-500" on:click="{removeItem}">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
				</svg>				  
			</span>
			<span class:hovering class="text-green-500" on:click="{() => isDisabled = !isDisabled}">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
			  	</svg>
			</span>
		{/if}
	</label>

	<input
		type={type}
		name = {field_name}
		{maxlength}
		class="border block w-full rounded p-2 {showError ? 'border-rose-600' : ''}"
        {required}
	/>

	{#if !isDisabled}
		<div class="w-100 bg-white border rounded border-solid p-4 mt-2 relative">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="close" on:click="{() => isDisabled = !isDisabled}">X</label>
			<div class="flex gep-4">
				<div class="block w-3/4">
					<label for={name} class="font-bold block mb-1.5 text-left">
						{field_name}
					</label>
					<input
						type="text"
						{name}
						id={name}
						{maxlength}
						class="border block w-full rounded p-2 {showError ? 'border-rose-600' : ''}"
						{required}
						placeholder="Ievadi nosaukumu"
					/>
				</div>
				<div class="block w-1/4 pt-6">
					<label>
						<input type=checkbox checked={notitle}>
						Nerādīt nosaukumu
					</label>
				</div>
			</div>
			<div class="flex gap-4">
				{#if options.numRows }
					<div class="block py-4">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label class="font-bold block mb-1.5 text-left">
							Rindu skaits
						</label>
						<input
							type="text"
							class="border block rounded p-2 w-[85px]"
							bind:value={options.numRows}
						/>
					</div>
				{/if}
				{#if options.numLength }
				<div class="block py-4">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="font-bold block mb-1.5 text-left">
						Zīmju skaits
					</label>
					<input
						type="text"
						class="border block rounded p-2 w-[85px]"
						bind:value={options.numLength}
					/>
				</div>
				{/if}
				{#if options.itemType }
				<div class="block py-4">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="font-bold block mb-1.5 text-left">
						Veids
					</label>
					<select class="border block rounded p-2 w-[130px]" />
				</div>
				{/if}
				{#if options.isVertical }
				<div class="block py-4 my-auto">
					<label class="float-start"> 
						<input type="checkbox" >
						Izkārtot vertikāli (pēc noklusējuma ir horizontāli)
					</label>
				</div>
				{/if}
				<div class="block py-4 my-auto">
					<label class="float-start"> 
						<input type="checkbox" bind:checked={required}>
						Obligāts
					</label>
				</div>
			</div>
			{#if options.addItems}
			<div class="flex gap-4">
				<div class="block py-4 gap-2">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="font-bold block mb-1.5 text-left">
						Zīmju skaits
					</label>
					<input
						type="text"
						class="border block rounded p-2"
						placeholder="Ievadi nosaukumu"
					/>
					<input
						type="text"
						class="border block rounded p-2 mt-2"
						placeholder="Ievadi nosaukumu"
					/>
				</div>
				<div class="block py-4">
					<div>
						<button class="bg-gray-400 text-sky-300 border block rounded p-2 absolute bottom-8">
							Pievienot
						</button>
					</div>
					
				</div>
			</div>
			{/if}
			{#if options.addTableRowsCols }
			<div class="flex gap-4">
				<div class="block py-4 gap-2">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="font-bold block mb-1.5 text-left">
						Kolonnas
					</label>
					<input
						type="text"
						class="border block rounded p-2"
						placeholder="Ievadi nosaukumu"
					/>
					<input
						type="text"
						class="border block rounded p-2 mt-2"
						placeholder="Ievadi nosaukumu"
					/>
				</div>
				<div class="block py-4">
					<div>
						<button class="bg-gray-400 text-sky-300 border block rounded p-2 absolute bottom-8">
							Pievienot
						</button>
					</div>
				</div>
			</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.hovering {
		float: right;
		display: flex;
		margin-right: 16px;
	}

	.hovering > svg {
		margin: 0 4px 0 4px;
	}

	label {
		font-family: 'Arial';
		font-style: normal;
		font-weight: 700;
		font-size: 12px;
		line-height: 14px;
	}

	.close {
		position: absolute;
		right: 10px;
		top: 10px;
	}
</style>