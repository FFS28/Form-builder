import {getRequest, postRequest} from "$lib/api.js";

export const loginUser = async (loginData) => {
	return await postRequest('/api/login-pwd', loginData)
}

export async function checkAuthStatus(event) {
	try {
		return await getRequest('/api/auth', event);
	} catch (e) {
		console.log(`Error while checking auth status: ${e}`);
		return {};
	}
}
