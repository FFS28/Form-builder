import { checkAuthStatus} from "$services/authService.js";
import { redirect } from "@sveltejs/kit";

export async function load(event) {
  const user = await checkAuthStatus(event);
  if (user.is_logged_in) {
    throw redirect(303, '/manager');
  }
}
