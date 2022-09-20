import { User, UserRole, UserOrg } from '$structures/user/user';
import {deleteRequest, getRequest, postRequest, putRequest} from "$lib/api.js";

export const getUsers = async (filters, event) => {
	const userData = await getRequest(`/data/lietotajs_list${filters}`, event);
	const userCount = await getRequest(`/count/lietotajs_list${filters}`, event);

	return {
		users: userData.data,
		totalCount: userCount.data
	};
};

export const getUser = async (userId, event) => {
	return await getRequest(`/data/lietotajs_editable/${userId}`, event);
}

/**
 * @param {User} user
 */
export const addUser = async (user) => {
	delete(user.userId);
	const { success, data, errorMessage } = await postRequest('/data/lietotajs_editable', user.toArray());
	return { success, errorMessage, userId: data.id };
};

/**
 * @param {User} user
 */
export const editUser = async (user) => {
	return await putRequest(`/data/lietotajs_editable/${user.userId}`, user.toArray());
};

/**
 * @param {number} userId
 */
export const deleteUserById = async (userId) => {
	return await deleteRequest(`/data/lietotajs_editable/${userId}`);
};


export const getRoles = async () => {
	const { success, data } = await getRequest(`/data/lomas_choice`);

	return { success, roles: data };
};


export const getUserRole = async (userRoleId) => {
	const { data, success } = await getRequest(`/data/lietotaja_loma_editable/${userRoleId}`);

	return { success, userRoleData: UserRole.fromArray(data) };
};

/**
 * @param {UserRole} userRole
 */
export const saveUserRole = async (userRole) => {
	const saveFn = userRole.userRoleId ? putRequest : postRequest

	const { success, data, errorMessage } = await saveFn(
		`/data/lietotaja_loma_editable${userRole.userRoleId ? `/${userRole.userRoleId}` : ''}`,
		userRole.toArray()
	);

	return { success, userRoleData: UserRole.fromArray(data), errorMessage };
};

/**
 * @param {number} userRoleId
 */
export const deleteUserRoleById = async (userRoleId) => {
	return await deleteRequest(`/data/lietotaja_loma_editable/${userRoleId}`);;
};

export const getUserOrg = async (userOrgId) => {
	const { data, success } = await getRequest(`/data/lietotaja_uznemums_editable/${userOrgId}`);

	return { success, userOrgData: UserOrg.fromArray(data) };
};

/**
 * @param {UserOrg} userOrg
 */
export const saveUserOrg = async (userOrg) => {
	const saveFn = userOrg.userOrgId ? putRequest : postRequest

	const { success, data, errorMessage } = await saveFn(
		`/data/lietotaja_uznemums_editable${userOrg.userOrgId ? `/${userOrg.userOrgId }` : ''}`,
		userOrg.toArray()
	);

	return { success, userOrgData: UserOrg.fromArray(data), errorMessage };
};

/**
 * @param {number} userOrgId
 */
export const deleteUserOrgById = async (userOrgId) => {
	return await deleteRequest(`/data/lietotaja_uznemums_editable/${userOrgId}`);
};
