<script>
	import { createEventDispatcher } from 'svelte';
	import { sortingParams } from '$lib/stores';

	const dispatch = createEventDispatcher();

	export let tableParams;
	export let data;
	export let rowClickAction;
	export let rowActions = [];
	export let cellColoring = null;

	let hoveringOverId = 0;

	const dataColumns = Object.keys(tableParams);

	const handleClick = (row, i) => {
		if (rowClickAction) {
			rowClickAction(row, i);
		}
	};

	const dispatchSortColumn = (sortColumn) => {
		updateSortingParams(sortColumn);

		dispatch('sortColumn', $sortingParams);
	};

	const updateSortingParams = (sortColumn) => {
		if ($sortingParams.sortColumn !== sortColumn) {
			return ($sortingParams.sortColumn = sortColumn);
		}

		if (!$sortingParams.isAscending) {
			return resetSortingParams();
		}

		$sortingParams.isAscending = false;
	};

	const resetSortingParams = () => {
		$sortingParams.sortColumn = '';
		$sortingParams.isAscending = true;
	};

	$: shouldHideArrow = (sortColumn, isAscending) => {
		if ($sortingParams.sortColumn !== sortColumn) {
			return false;
		}

		return $sortingParams.isAscending === isAscending;
	};

	const getCellClasses = (row) => {
		let classes = '';
		if (cellColoring) {
			cellColoring.forEach((x) => {
				if (row[x.cell] === x.value) {
					classes = x.classes;
				}
			});
		}
		return classes;
	};
</script>

<table class="w-full">
	<thead>
		<tr>
			{#each dataColumns as col}
				<td class="cursor-pointer" on:click={() => dispatchSortColumn(col)}>
					<div class="flex items-center">
						<span class="mr-1">{tableParams[col]}</span>
						<div>
							<div
								class="arrow-up mb-0.5"
								style="visibility: {shouldHideArrow(col, true) ? 'hidden' : 'visible'}"
							/>
							<div
								class="arrow-down"
								style="visibility: {shouldHideArrow(col, false) ? 'hidden' : 'visible'}"
							/>
						</div>
					</div>
				</td>
			{/each}

			{#each rowActions as action}
				<td />
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data as row, i}
			<tr class:cursor-pointer={rowClickAction}>
				{#each dataColumns as col}
					<td
						class:bg-gray-200={hoveringOverId === i + 1}
						class={getCellClasses(row)}
						on:mouseover={() => (hoveringOverId = i + 1)}
						on:focus={() => (hoveringOverId = i + 1)}
						on:mouseleave={() => (hoveringOverId = 0)}
						on:blur={() => (hoveringOverId = 0)}
						on:click={handleClick(row, i)}
					>
						<div class="truncate" title={row[col]}>{@html row[col] || ''}</div>
					</td>
				{/each}

				{#each rowActions as action}
					<td
						class="hover:bg-gray-200"
						on:click={action.actionMethod(
							row[action.actionParam],
							row[action.secondActionParam],
							i
						)}
					>
						<svelte:component this={action.icon} size="20" color={action.iconColor} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	table {
		border-collapse: collapse;
		background-color: white;

		thead {
			td {
				font-weight: 600;
			}
		}

		td {
			padding: 8px;
			border-top: 1px solid var(--border-dark-color);
		}
	}

	.arrow-up {
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;

		border-bottom: 4px solid black;
	}

	.arrow-down {
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;

		border-top: 4px solid black;
	}

	.truncate {
		max-width: 500px;
	}
</style>
