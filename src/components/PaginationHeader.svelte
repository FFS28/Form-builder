<script>
  import { createEventDispatcher } from 'svelte';

	/** @type {Object} */
	export let paginationParams;

	const dispatch = createEventDispatcher();

	function changePageSize(size) {
    dispatch('changePageSize', size);
  }
</script>


<div class="flex items-center mr-3">
  Rādīt
  <select
    id="per-page-limit"
    name="perPageLimit"
    on:change={({ target: { value } }) => changePageSize(value) }
    bind:value={paginationParams.perPage}
    class="mx-3 border rounded block w-full p-2"
  >
  {#each paginationParams.pageSizes as pageSize}
    <option value={pageSize}>{pageSize}</option>
  {/each}
  </select>
  ierakstus
</div>
