import { Contest } from '$structures/contest/contest';
import {deleteRequest, getRequest, postRequest, putRequest} from "$lib/api.js";

export const getContests = async (filters, event) => {
	const contestsResponse = await getRequest(`/data/konkurss_list${filters}`, event);
	const contestCountResponse = await getRequest(`/count/konkurss_list${filters}`, event);

	return {
		contests: contestsResponse.data,
		totalCount: contestCountResponse.data
	};
};

export const getContest = async (contestId, event) => {
	return await getRequest(`/data/konkurss_editable/${contestId}`, event);
};

/**
 * @param {Contest} contest
 */
export const saveContest = async (contest) => {
	const saveFn = contest.contestId ? putRequest : postRequest
	return await saveFn(`/data/konkurss_editable${contest.contestId ? `/${contest.contestId}` : ''}`, contest.toArray())
}

export const deleteContest = async (contestId) => {
	return await deleteRequest(`/data/konkurss_editable/${contestId}`);
};

export const publishContest = async (contestId) => {
	return await postRequest('/data/konkurss_izsludinat', { id: contestId });
};

export const getPublicContests = async (filters, event) => {
	return await getRequest(`/data/konkurss_public_list${filters}`, event);
};

export const getPublicContest = async (contestId, event) => {
	return await getRequest(`/data/konkurss_public_view/${contestId}`, event);
};

/**
 * @param {ContestFile} contestFile
 */
export const saveContestFile = async (contestFile) => {
	const saveFn = contestFile.id ? putRequest : postRequest;
	const { success, data } = await saveFn('/data/konkursa_pielikums_editable', contestFile.toArray())
	return { success, id: data.id }
}

/**
 * @param {number} contestFileId
 */
export const deleteContestFileById = async (contestFileId) => {
	return await deleteRequest(`/data/konkursa_pielikums_editable/${contestFileId}`);
};
