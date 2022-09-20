import { Audit } from '$structures/audit';
import {getRequest} from "$lib/api.js";
import {error} from "@sveltejs/kit";

export const getAudits = async (filters, event) => {
	const auditData = await getRequest(`/data/audit_list${filters}`, event);
	const auditCount = await getRequest(`/count/audit_list${filters}`, event);

	return {
		audits: auditData.data,
		totalCount: auditCount.data
	};
};
