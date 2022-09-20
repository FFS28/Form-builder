<script>
	import { goto } from '$app/navigation';
	import Breadcrumbs from '$components/public/Breadcrumbs.svelte';
	import { loginUser } from '$services/authService';

	const form = {
		username: '',
		password: ''
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

		const { data: userData } = await loginUser(form);

		if (!userData.is_logged_in) {
			// TODO Show error
			return;
		}

		return goto('/manager');
	};

	let breadcrumbs = [
		{
			href: '/',
			label: 'Sākums'
		},
		{
			href: '/login',
			label: 'Autorizācija'
		}
	];
</script>

<Breadcrumbs {breadcrumbs} title="Autorizācija" />

<div class="bg-white py-5 mt-5 flex-1">
	<div class="flex container mx-auto">
		<form class="w-full" on:submit|preventDefault={handleFormSubmit}>
			<div class="flex">
				<div class="row mr-4">
					<div class="mt-2">
						<label for="l-username">Lietotāja vārds</label>
						<input
							id="l-username"
							class="appearance-none border rounded w-full py-2 px-2"
							class:error={!form.username}
							type="email"
							name="username"
							bind:value={form.username}
						/>
					</div>

					<div class="mt-2">
						<label for="l-password">Parole</label>
						<input
							id="l-password"
							class="appearance-none border rounded w-full py-2 px-2"
							class:error={!form.password}
							type="password"
							bind:value={form.password}
						/>
					</div>
				</div>

				<div class="row">
					<div class="mt-2">
						<p>Autorizēties ar:</p>
						<a href="/api/login_start">
							<img
								class="login-dialog__img"
								width="100"
								src="/images/latvija-lv-logo-20131.png"
								alt="latvija login"
							/>
						</a>
					</div>
				</div>
			</div>

			<div class="mt-4">
				<button class="btn btn-secondary px-3 py-2 rounded-md" type="submit">Autorizēties</button>
			</div>
			<div class="mt-3">
				<a href="/forgot" class="text-red-800 underline">Aizmirsi paroli?</a>
			</div>
		</form>
	</div>
</div>
