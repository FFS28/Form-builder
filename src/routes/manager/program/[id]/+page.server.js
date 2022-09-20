import { getProgram } from '$services/programService';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const programData = await getProgram(event.params.id, event);

	return { programData: programData.data };
}
