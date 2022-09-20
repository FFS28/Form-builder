import {deleteRequest, postRequest, putRequest} from "$lib/api.js";

/**
 * @param {ProgramFile} programFile
 */
export const saveProgramFile = async (programFile) => {
	const saveFn = programFile.fileId ? putRequest : postRequest;
	const { success, data } = await saveFn('/data/programmas_pielikums_editable', programFile.toArray())
	return { success, id: data.id }
};

/**
 * @param {number} programFileId
 */
export const deleteProgramFileById = async (programFileId) => {
	return await deleteRequest(`/data/programmas_pielikums_editable/${programFileId}`);
};
