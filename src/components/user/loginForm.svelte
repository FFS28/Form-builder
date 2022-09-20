<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loginUser } from '$services/authService';

	const form = {
		username: 'einars@uniso.lv',
		password: 'zaq12345',
		instance: 'SIF'
	};

	/**
	 * Handle form submit
	 */
	const handleFormSubmit = async () => {
		let errors = [];

		Object.keys(form).forEach((key) => {
			if (!form[key]) {
				errors.push(key);
			}
		});

		if (errors.length) {
			return;
		}

		const userData = await loginUser(form);

		if (!userData.is_logged_in) {
			// TODO Show error
			return;
		}

		return goto('/manager');
	};
</script>

<form class="w-80" on:submit|preventDefault={handleFormSubmit}>
	<div class="block ">
		<label for="l-username">Lietotājvārds</label>
		<input
			id="l-username"
			class="appearance-none border rounded w-full py-2 px-2"
			class:error={!form.username}
			type="email"
			name="username"
			bind:value={form.username}
		/>
	</div>

	<div class="form-group">
		<label for="l-password">Parole</label>
		<input
			id="l-password"
			class="appearance-none border rounded w-full py-2 px-2"
			class:error={!form.password}
			type="password"
			bind:value={form.password}
		/>
	</div>

	<div class="mt-5">
		<button type="button" class="text-sm rounded-md border border-slate-500 px-3 py-2"
			>Aizmirsta parole</button
		>
		<button
			type="submit"
			class="bg-blue-500 border border-blue-500 text-white text-sm rounded-md px-3 py-2 "
			>Ielogoties</button
		>
	</div>
</form>
