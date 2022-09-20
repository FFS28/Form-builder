import { getCodifiers } from '$services/codifierService';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const response = await getCodifiers('', event)
	return {
		...response
	};
}
