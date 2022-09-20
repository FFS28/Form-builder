import { getContest } from '$services/contestService';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const contestData = await getContest(params.id, null);

	return { contestData: contestData.data };
}
