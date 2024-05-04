import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PermissionLink } from "~/components/controllers/permissions/permission-link";
import { Spinner } from "~/components/loaders";
import { useTranslation } from "~/contexts/translation";
import { getMyPermissions } from "~/services/controllers";

export const Route = createFileRoute("/controllers/me/")({
	component: MyControllerGeneral,
});

function MyControllerGeneral() {
	const { t } = useTranslation();

	const {
		data: permissions,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["my-permissions"],
		queryFn: getMyPermissions,
		select: (data) => data.data,
		staleTime: 1000 * 60 * 5,
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="p-4">
			<h3 className="text-2xl">{t("permissions")}</h3>
			<div className="flex overflow-x-auto gap-4">
				{permissions?.map((permission) => (
					<PermissionLink key={permission} permission={permission} />
				))}
			</div>
		</div>
	);
}
