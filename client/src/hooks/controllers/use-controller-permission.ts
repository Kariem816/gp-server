import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import { getMyPermissions } from "~/services/controllers";

// TODO: don't navigate while rendering. (god help me)
export function useControllerPermission(
	redirectTo: string | null,
	permission: string
) {
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	if (user.role === "admin") {
		return;
	}

	const myPermissions = (queryClient.getQueryData([
		"my-permissions",
	]) as Awaited<ReturnType<typeof getMyPermissions>>) ?? { data: [] };
	redirectTo ??= "/";

	if (!myPermissions.data.includes(permission)) {
		return navigate({
			to: "/",
		});
	}
}
