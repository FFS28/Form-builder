import { browser, dev } from '$app/environment';
import { PUBLIC_API_ROOT } from '$env/static/public';

let apiRoot = '';

if (!browser) {
	apiRoot = PUBLIC_API_ROOT + apiRoot;
}

/**
 * Get request wrapper
 */
export async function getRequest(path, event) {
	try {
		const response = await fetch(`${apiRoot}${path}`, {
			headers: {
				...getCopiedHeaders(event)
			}
		});

		return getFormattedResponse(response);
	} catch (e) {
		console.log(`Error in API GET request: ${e}`);

		return [];
	}
}

export async function postRequest(path, body, request, isContentless) {
	try {
		const response = await fetch(`${apiRoot}${path}`, {
			headers: {
				...getCopiedHeaders(event),
				'Content-Type': 'application/json;charset=utf-8'
			},
			method: 'POST',
			body: JSON.stringify(body)
		});

		return await getFormattedResponse(response, isContentless);
	} catch (e) {
		console.log(`Error in API POST request: ${e}`);

		return [];
	}
}

export async function putRequest(path, body, event) {
	try {
		const response = await fetch(`${apiRoot}${path}`, {
			headers: {
				...getCopiedHeaders(event),
				'Content-Type': 'application/json;charset=utf-8'
			},
			method: 'PUT',
			body: JSON.stringify(body)
		});

		return await getFormattedResponse(response);
	} catch (e) {
		console.log(`Error in API PUT request: ${e}`);

		return [];
	}
}

export async function deleteRequest(path, event) {
	try {
		const response = await fetch(`${apiRoot}${path}`, {
			headers: {
				...getCopiedHeaders(event)
			},
			method: 'DELETE'
		});

		return await getFormattedResponse(response);
	} catch (e) {
		console.log(`Error in API DELETE request: ${e}`);

		return [];
	}
}

function getCopiedHeaders(event) {
	if (browser) {
		return {};
	}

	const { headers } = event.request;
	const clientIp = event.getClientAddress();

	let newHeaders = {
		Cookie: headers.get('cookie'),
		'user-agent': headers.get('user-agent')
	};

	if (!dev) {
		newHeaders['X-Forwarded-For'] = headers.get('x-forwarded-for') || clientIp;
	}

	return newHeaders;
}

function isSuccessfulResponse(response) {
	return response.status === 200;
}

function isNoContentResponse(response) {
	return response.status === 204;
}

async function getFormattedResponse(response, isContentless) {
	if (isNoContentResponse(response) || (isSuccessfulResponse(response) && isContentless)) {
		return { success: true, data: {}, errorMessage: '' };
	}

	if (!isSuccessfulResponse(response)) {
		return { success: false, data: {}, errorMessage: await response.text() };
	}

	return { success: true, data: await response.json(), errorMessage: '' };
}
