import { PwdChange } from '$structures/pwdChange';
import {postRequest} from "$lib/api.js";

export const changePwd = async (pwdChange) => {
	return await postRequest('/data/paroles_nomaina', pwdChange, true);
};
