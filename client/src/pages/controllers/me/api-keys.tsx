import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { APIKey } from "~/components/controllers/api-keys/api-key";
import { CreateApiKeyDialog } from "~/components/controllers/api-keys/dialog";
import { Spinner } from "~/components/loaders";
import { useTranslation } from "~/contexts/translation";
import { getMyApiKeys } from "~/services/controllers";

export const Route = createFileRoute("/controllers/me/api-keys")({
	component: APIKeys,
});

function APIKeys() {
	const { t } = useTranslation();
	const {
		data: keys,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["my-api-keys"],
		queryFn: getMyApiKeys,
		select: (data) => data.data,
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isLoading || !keys) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="p-4">
			<div className="flex justify-between items-center">
				<h3 className="text-2xl">{t("api_keys")}</h3>
				<CreateApiKeyDialog />
			</div>
			{keys.length > 0 ? (
				<div className="space-y-4">
					{keys.map((key) => (
						<APIKey key={key.id} apikey={key} />
					))}
				</div>
			) : (
				<p className="text-center opacity-75 italic">{t("no_keys")}</p>
			)}
		</div>
	);
}
