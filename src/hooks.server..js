// /** @type {import('@sveltejs/kit').Handle} */
// export async function handle({ event, resolve }) {
// 	if (event.url.pathname === '/api/auth/logout') {
// 		return resolve(event);
// 	}
//
// 	const { cookie, authData } = await getAuthData(event);
//
// 	if (!cookie || !authData || !authData.is_logged_in) {
// 		return await resolve(event);
// 	}
//
// 	event.locals.user = authData;
//
// 	const response = await resolve(event);
//
// 	response.headers.set('Set-Cookie', cookie);
//
// 	return response;
// }
import 'dotenv/config';

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch }) {
	console.log('handleFetch called');
	// URL here?
	console.log(process.env.PUBLIC_API_ROOT);

	if (request.url.startsWith('https://wtf/')) {
		// clone the original request, but change the URL
		request = new Request(
			`http://localhost:8090${request.url}`,
			request
		);
	}

	return fetch(request);
}
