import { format } from 'date-fns';
import { redirect } from '@sveltejs/kit';

export function protectedRoute(page) {
	if (!page.data.user.isLoggedIn) {
		throw redirect(303, '/login');
	}

	return {};
}

export const getSessionUser = (userData) => {
	const isLoggedIn = userData.is_logged_in ?? false;
	const userId = userData.id ?? 0;
	const firstName = userData.vards ?? '';
	const lastName = userData.uzvards ?? '';
	const roles = userData.roles ?? [];

	return {
		isLoggedIn,
		userId,
		firstName,
		lastName,
		roles
	};
};

export const deepEqual = (x, y) => {
	const ok = Object.keys,
		tx = typeof x,
		ty = typeof y;
	return x && y && tx === 'object' && tx === ty
		? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
		: x === y;
};

export const objectEquals = (x, y) => {
	if (x === null || x === undefined || y === null || y === undefined) {
		return x === y;
	}
	// after this just checking type of one would be enough
	if (x.constructor !== y.constructor) {
		return false;
	}
	// if they are functions, they should exactly refer to same one (because of closures)
	if (x instanceof Function) {
		return x === y;
	}
	// if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
	if (x instanceof RegExp) {
		return x === y;
	}
	if (x === y || x.valueOf() === y.valueOf()) {
		return true;
	}
	if (Array.isArray(x) && x.length !== y.length) {
		return false;
	}

	// if they are dates, they must had equal valueOf
	if (x instanceof Date) {
		return false;
	}

	// if they are strictly equal, they both need to be object at least
	if (!(x instanceof Object)) {
		return false;
	}
	if (!(y instanceof Object)) {
		return false;
	}

	// recursive object equality check
	var p = Object.keys(x);
	return (
		Object.keys(y).every(function (i) {
			return p.indexOf(i) !== -1;
		}) &&
		p.every(function (i) {
			return objectEquals(x[i], y[i]);
		})
	);
};

export const formatDate = (date, time = false) => {
	let formatDate = new Date(date);
	return time ? format(formatDate, 'dd.MM.yyyy HH:mm:ss') : format(formatDate, 'dd.MM.yyyy');
};

export const readableDate = (date, time = false) => {
	const formatDate = new Date(date);
	const readableDate = time
		? format(formatDate, 'dd.MM.yyyy HH:mm:ss')
		: format(formatDate, 'dd.MM.yyyy');
	return readableDate.replace(' ', '<br />');
};
