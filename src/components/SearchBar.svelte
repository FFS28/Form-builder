<script>
	import { createEventDispatcher } from 'svelte';
	import IconMagnify from 'svelte-material-icons/Magnify.svelte';

	const dispatch = createEventDispatcher();

	const INPUT_TYPE_DELETE = 'deleteContentBackward';
	const MIN_LENGTH = 3;
	const DISPATCH_TIMEOUT = 800;

	export let width = 0;

	let value = '';
	let isThrottled = false;
	let currentInputType = '';

	const onInput = ({ inputType }) => {
		currentInputType = inputType;

		if (!shouldDispatch() || isThrottled) {
			return;
		}

		dispatchWithTimeout();
	};

	const dispatchWithTimeout = () => {
		isThrottled = true;

		setTimeout(dispatchValue, DISPATCH_TIMEOUT);
	};

	const dispatchValue = () => {
		isThrottled = false;

		if (!shouldDispatch()) {
			return;
		}

		dispatch('search', value);
	};

	const shouldDispatch = () => {
		return value.length >= MIN_LENGTH || (!value.length && currentInputType === INPUT_TYPE_DELETE);
	};
</script>

<div class="flex items-center search-bar" style="min-width: {width ? `${width}px` : '100%'}">
	<input
		type="text"
		class="border-l border-t border-b block rounded-l p-2 w-full"
		placeholder="Meklēt..."
		bind:value
		on:input={onInput}
	/>

	<div class="bg-white p-2 border-t border-b border-r rounded-r bg-gray-100">
		<IconMagnify size="21" />
	</div>
</div>

<style lang="scss">
	.search-bar {
	  	input {
		  	&:focus {
				outline: none;
			}
		}
	}
</style>
