<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	import { getEmployees } from '$services/employeeService';
	import IconArrowDown from 'svelte-material-icons/ChevronDown.svelte';
	import IconArrowUp from 'svelte-material-icons/ChevronUp.svelte';
	import SearchBar from '$components/SearchBar.svelte';

	export let label;
	export let employeeName;
	export let showError = false;

	const dispatch = createEventDispatcher();

	const ID_EMPLOYEE_DROPDOWN_CONTAINER = 'employee-dropdown-container';

	const LIMIT_SEARCH = 20;
	const SEARCH_TIMEOUT = 300;

	let employees = [];
	let isOpen = false;
	let selectedEmployeeName = '';
	let isThrottled = false;
	let currentSearchTerm = '';

	onMount(async () => {
		await getFilteredEmployees();

		if (!employeeName) {
			return;
		}

		selectedEmployeeName = employeeName;
	});

	const addClickEventListener = () => document.addEventListener('click', closeDropdown);
	const removeEventListener = () => document.removeEventListener('click', closeDropdown);

	const getFilteredEmployees = async () => {
		const { data } = await getEmployees(getSearchParams(currentSearchTerm));

		employees = data;

		isThrottled = false;
	};

	const onSearch = (searchTerm) => {
		currentSearchTerm = searchTerm;

		if (isThrottled) {
			return;
		}

		isThrottled = true;

		setTimeout(() => getFilteredEmployees(), SEARCH_TIMEOUT);
	};

	const onSelected = (employee) => {
		dispatch('selected', { employeeId: employee.id, employeeName: getEmployeeFullName(employee) });

		selectedEmployeeName = getEmployeeFullName(employee);
		isOpen = false;

		removeEventListener();
	};

	const closeDropdown = (event) => {
		if (isClickInsideDropdown(event.target)) {
			return;
		}

		isOpen = false;

		removeEventListener();
	};

	const isClickInsideDropdown = (target) => {
		return document.getElementById(ID_EMPLOYEE_DROPDOWN_CONTAINER).contains(target);
	};

	const getSearchParams = (searchTerm = '') => {
		if (!searchTerm) {
			return `?limit=${LIMIT_SEARCH}`;
		}

		return `?q=${searchTerm}&limit=${LIMIT_SEARCH}`;
	};

	const getEmployeeFullName = (employee) => {
		return `${employee.vards} ${employee.uzvards}`;
	};

	const triggerDropdown = () => {
		if (!isOpen) {
			isOpen = true;

			return addClickEventListener();
		}

		isOpen = false;

		removeEventListener();
	};
</script>

<div class="relative" id={ID_EMPLOYEE_DROPDOWN_CONTAINER}>
	<span class="font-bold block mb-1.5">
		{label}
	</span>

	<div
		class="flex justify-between items-center border rounded p-2 cursor-pointer"
		class:border-rose-600={showError}
		on:click={triggerDropdown}
	>
		{#if selectedEmployeeName}
			<span>{selectedEmployeeName}</span>
		{:else}
			<span class="text-slate-500">Izvēlies darbinieku...</span>
		{/if}

		{#if isOpen}
			<IconArrowUp size="18" />
		{:else}
			<IconArrowDown size="18" />
		{/if}
	</div>

	<div class="absolute bg-white flex flex-col w-full p-2 border" class:invisible={!isOpen}>
		<SearchBar on:search={({ detail }) => onSearch(detail)} />

		<div class="flex flex-col employee-dropdown mt-1">
			{#if !employees.length}
				<span class="p-2">Nekas netika atrasts!</span>
			{:else}
				{#each employees as employee, i}
					<span class="p-2 hover:bg-gray-200 cursor-pointer" on:click={() => onSelected(employee)}>
						{getEmployeeFullName(employee)}
					</span>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.employee-dropdown {
		max-height: 220px;
		overflow-y: scroll;
	}
</style>
