import {getRequest} from "$lib/api.js";

export const getEmployees = async (filters) => {
	return await getRequest(`/data/lietotajs_list${filters}`);
};
