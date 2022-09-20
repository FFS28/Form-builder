import { getUser } from '$services/userService.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const userData = await getUser(params.id);

	return { userData: userData.data };
}
