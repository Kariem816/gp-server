import { DeleteCameraDialog, EditCameraDialog } from "./dialogs";

import type { Camera as TCamera } from "~/services/camera";

export function Camera({ camera }: { camera: TCamera }) {
	return (
		<div className="rounded-lg bg-accent p-4 space-y-4 shadow-lg relative">
			<div className="space-y-2">
				<p className="text-center capitalize font-semibold">
					{camera.location}
				</p>
				<p className="text-center blur-md hover:blur-none active:blur-none focus:blur-none focus-within:blur-none focus-visible:blur-none transition-all">
					{camera.ip}
				</p>
			</div>

			<div className="flex justify-end gap-2">
				<EditCameraDialog camera={camera} />
				<DeleteCameraDialog camera={camera} />
			</div>
		</div>
	);
}
