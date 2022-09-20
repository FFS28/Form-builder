import {getRequest} from "$lib/api.js";

export const getFinancingSources = async (event) => {
	const response = await getRequest('/data/kodifikators/3466825', event);

	return { ...response };
};
