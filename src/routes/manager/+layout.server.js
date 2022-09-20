import { checkAuthStatus} from "$services/authService";
import { getSessionUser } from "$lib/helpers.js";
import {redirect} from "@sveltejs/kit";

export async function load(event) {
  const { data: user } = await checkAuthStatus(event);

  if (!user || !user.is_logged_in) {
    throw redirect(303, '/login')
  }
  return {
    user: getSessionUser(user)
  };
}
