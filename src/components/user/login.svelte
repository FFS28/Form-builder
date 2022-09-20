<script>
	import LoginForm from './loginForm.svelte';
</script>

<div class="login-dialog py-2">
	<div class="flex">
		<div class="flex-auto w-40 p-2">
			<img src="/images/map-logo.png" width="256" height="256" alt="MAP logo" />
		</div>
		<div class="flex-auto w-60 p-2">
			<LoginForm />
			<div class="mt-4">
				<button class="btn btn-login">
					<img
						class="login-dialog__img"
						src="/images/latvija-lv-logo-20131.png"
						alt="latvija login"
					/>
				</button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.login-dialog {
		&__img {
			width: auto;
			height: 70px;
			margin: 0 auto;
		}
	}

	.btn-login {
		@apply block w-full px-4 rounded-md border bg-white;

		border-color: var(--gray-5);
		box-shadow: 0 2px 5px rgba(black, 0.2);

		&:hover {
			background-color: var(--gray-4);
		}
	}
</style>
