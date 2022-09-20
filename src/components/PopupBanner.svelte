<script>
	import IconAlert from 'svelte-material-icons/AlertCircleOutline.svelte';
	import IconInformation from 'svelte-material-icons/InformationOutline.svelte';
	import IconBell from 'svelte-material-icons/BellOutline.svelte';
	import IconCheck from 'svelte-material-icons/Check.svelte';
	import IconClose from 'svelte-material-icons/Close.svelte';

	export let popupType;
	export let title;
	export let message;
	export let showPopup;
	export let background;

	const POPUP_TYPE_ERROR = 'error';
	const POPUP_TYPE_WARNING = 'warning';
	const POPUP_TYPE_SUCCESS = 'success';
	const POPUP_TYPE_INFO = 'info';

	const POPUP_TEXT_COLORS = {
		[POPUP_TYPE_ERROR]: 'text-red-800',
		[POPUP_TYPE_WARNING]: 'text-orange-400',
		[POPUP_TYPE_SUCCESS]: 'text-green-800',
		[POPUP_TYPE_INFO]: 'text-sky-600'
	};

	const POPUP_BG_COLORS = {
		[POPUP_TYPE_ERROR]: 'bg-red-100',
		[POPUP_TYPE_WARNING]: 'bg-orange-100',
		[POPUP_TYPE_SUCCESS]: 'bg-green-100',
		[POPUP_TYPE_INFO]: 'bg-sky-100'
	};

	$: textColor = POPUP_TEXT_COLORS[popupType];

	// TODO Fix this
	$: bgColor = 'bg-white';

	if (background) {
		bgColor = POPUP_BG_COLORS[popupType];
	}
</script>

<div class="p-3 flex mb-3 {textColor} {bgColor}" class:hidden={!showPopup}>
	<div class="mr-2">
		{#if popupType === POPUP_TYPE_ERROR}
			<IconAlert size="24" />
		{:else if popupType === POPUP_TYPE_WARNING}
			<IconBell size="24" />
		{:else if popupType === POPUP_TYPE_SUCCESS}
			<IconCheck size="24" />
		{:else if popupType === POPUP_TYPE_INFO}
			<IconInformation size="24" />
		{/if}
	</div>
	<div class="grow">
		{#if title}
			<p class="font-bold mb-1">{title}</p>
		{/if}
		{#if message}
			<p>{@html message.replaceAll('\n', '<br />')}</p>
		{/if}
	</div>
	<div class="flex cursor-pointer" on:click={() => (showPopup = false)}>
		<span class="mr-1 text-xs">Aizvērt</span>
		<IconClose size="18" />
	</div>
</div>
