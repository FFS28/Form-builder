import { getPublicProgram } from '$services/programService';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const programData = await getPublicProgram(params.id);

	return { programData: programData.data };
}
