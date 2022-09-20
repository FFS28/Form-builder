import { Codifier } from '$structures/codifier';
import {deleteRequest, getRequest, postRequest, putRequest} from "$lib/api.js";

export const getCodifiers = async (filters, event) => {
	const codifiers = await getRequest(`/data/kodifikators_list${filters}`, event);
	const codifiersCount = await getRequest(`/count/kodifikators_list${filters}`, event);

	return {
		codifiers: codifiers.data,
		totalCount: codifiersCount.data
	};
};

export const getCodifierByCode = async (tpe) => {
	let filters = `?kods=${tpe}`;

	const codifiers = await getRequest(`/data/kodifikatora_ieraksts_choice${filters}`);
	const codifiersCount = await getRequest(`/count/kodifikatora_ieraksts_choice${filters}`);

	return {
		codifierData: codifiers.data,
		totalCount: codifiersCount.data
	};
};

export const getCodifier = async (codifierId, event) => {
	return await getRequest(`/data/kodifikators/${codifierId}`, event);
};

export const getCodifierEntry = async (codifierId) => {
	const response = await fetch(`/api/codifier/entry/${codifierId}`, {
		method: 'GET'
	});

	const { data } = await response.json();

	return { data };
};

export const saveCodifierEntry = async (codifier) => {
	const saveFn = codifier.id ? putRequest : postRequest
	return await saveFn(`/data/kodifikatora_ieraksts${codifier.id ? `/${codifier.id}` : ''}`, codifier)
}

export const addCodifierEntry = async (codifier) => {
	delete codifier.id;

	const response = await fetch('/api/codifier/entry/add', {
		method: 'POST',
		body: JSON.stringify(codifier)
	});

	const { success, data, errorMessage } = await response.json();

	return {
		success,
		errorMessage,
		data
	};
};

export const editCodifierEntry = async (codifier) => {
	const response = await fetch('/api/codifier/entry/edit', {
		method: 'POST',
		body: JSON.stringify(codifier)
	});

	const { success, data, errorMessage } = await response.json();

	return {
		success,
		errorMessage,
		data
	};
};

export const deleteCodifierEntry = async (codifier) => {
	return await deleteRequest(`/data/kodifikatora_ieraksts/${codifier}`);
};
