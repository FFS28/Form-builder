import { getPublicContest } from '$services/contestService';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const contestData = await getPublicContest(params.id);

	return { contestData: contestData.data };
}
