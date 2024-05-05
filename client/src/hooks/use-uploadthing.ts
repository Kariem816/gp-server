import { generateReactHelpers } from "@uploadthing/react";
import { getAPIToken, serverURL } from "~/services/api";

const { useUploadThing: useUploadThingInternal } = generateReactHelpers({
	url: serverURL + "/api/uploads",
});

export function useUploadThing(
	...args: Parameters<typeof useUploadThingInternal>
) {
	const [endpoint, opts] = args;
	return useUploadThingInternal(endpoint, {
		headers: {
			Authorization: getAPIToken(),
		},
		...opts,
	});
}
