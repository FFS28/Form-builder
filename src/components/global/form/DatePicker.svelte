<script>
	import { DateInput, localeFromDateFnsLocale } from 'date-picker-svelte';
	import { lv } from 'date-fns/locale/index';
	import { format, isDate } from 'date-fns';
	import IconCalendar from 'svelte-material-icons/Calendar.svelte';

	export let value;
	export let min = null;
	export let max = null;
	export let inputFormat = 'dd.MM.yyyy';
	export let placeholder = 'DD.MM.YYYY';
	export let showError = false;
	export let timePicker = false;
	export let selectFunction = null;

	if (timePicker) {
		inputFormat = 'dd.MM.yyyy HH:mm:ss';
		placeholder = 'DD.MM.YYYY HH:MM:SS';
	}
	const MAX_YEARS = 20;
	const MIN_YEARS = 2;

	const maxYear = new Date().getFullYear() + MAX_YEARS;
	const minYear = new Date().getFullYear() - MIN_YEARS;

	const getYearFromNow = (year) => new Date().setFullYear(year);

	$: value ? formatValue(value) : null;
	$: minValue = min ? new Date(min) : new Date(getYearFromNow(minYear));
	$: maxValue = max ? new Date(max) : new Date(getYearFromNow(maxYear));

	const locale = localeFromDateFnsLocale(lv);

	const selectAction = () => {
		if (selectFunction) {
			selectFunction(value);
		}
	};

	const formatValue = (dateValue) => {
		if (isDate(dateValue)) {
			return dateValue;
		} else {
			return timePicker
				? format(dateValue, 'yyyy-MM-dd HH:mm:ss')
				: format(dateValue, 'yyyy-MM-dd');
		}
	};
</script>

<div
	class="relative {timePicker ? 'date-time-picker' : 'date-picker'} {showError
		? 'date-picker-error'
		: ''}"
>
	<DateInput
		bind:value
		{locale}
		format={inputFormat}
		{placeholder}
		min={minValue}
		max={maxValue}
		on:select={() => selectAction()}
	/>
	<span class="absolute right-2 top-2"><IconCalendar /></span>
</div>

<style lang="scss">
	.date-picker-error {
		:global(input) {
			@apply border-rose-600;
		}
	}
</style>
