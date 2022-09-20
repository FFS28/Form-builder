import {deleteRequest, putRequest, postRequest, getRequest} from "$lib/api.js";

export const getRoleList = async (filters, event) => {
	const { data: roles } = await getRequest(`/data/lomas_list${filters}`, event);
	const { data: totalCount } = await getRequest(`/count/lomas_list${filters}`, event);

	return {
		roles,
		totalCount
	};
};

export const getPermissionsList = async (filters) => {
	return await getRequest(`/data/tiesibas_list${filters}`);
};

/**
 *
 * @param role
 */
export const saveRole = async (role) => {
	const saveFn = role.id ? putRequest : postRequest
	return await saveFn(`/data/loma_editable${role.id ? `/${role.id}` : ''}`, role)
}

export const deleteRole = async (roleId) => {
	return await deleteRequest(`/data/loma_editable/${roleId}`);
};
