import { Program } from '$structures/program/program';
import {deleteRequest, getRequest, postRequest, putRequest} from "$lib/api.js";

export const getProgram = async (programId, event) => {
	return await getRequest(`/data/programma_editable/${programId}`, event);
};

export const getPrograms = async (filters, event) => {
	const programs = await getRequest(`/data/programma_list${filters}`, event);
	const programsCount = await getRequest(`/count/programma_list${filters}`, event);

	return {
		programs: programs.data,
		totalCount: programsCount.data
	};
};

export const getPublicPrograms = async (filters, event) => {
	return await getRequest(`/data/programma_public_list${filters}`, event);
};

export const getPublicProgram = async (programId, event) => {
	return await getRequest(`/data/programma_public_view/${programId}`, event);
};


/**
 * @param {Program} program
 */
export const saveProgram = async (program) => {
	const saveFn = program.programId > 0 ? putRequest : postRequest
	const { success, data, errorMessage } = await saveFn(
		`/data/programma_editable${program.programId ? `/${program.programId}` : ''}`,
		program.toArray()
	);

	return { success, errorMessage, programId: data.id }
}

/**
 * @param {number} programId
 */
export const deleteProgramById = async (programId) => {
	return await deleteRequest(`/data/programma_editable/${programId}`);
};

/**
 * @param {number} programId
 */
export const publishProgram = async (programId) => {
	return await postRequest('/data/programma_publicet', { id: programId });
};
