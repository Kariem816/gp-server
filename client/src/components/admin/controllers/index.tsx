import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { useTranslation } from "~/contexts/translation";
import { NewController } from "./new";
import { EditController } from "./edit";
import { DeleteController } from "./delete";

import type { LoggedUser } from "~/types/users";

export function ControllerList({ controllers }: { controllers: LoggedUser[] }) {
	const { t } = useTranslation();

	return (
		<>
			<div className="divide-y-2">
				{controllers.map((controller) => (
					<ControllerCard
						key={controller.id}
						controller={controller}
					/>
				))}
			</div>
			{controllers.length === 0 && (
				<div className="flex items-center justify-center h-64">
					<h4 className="text-grey-500 text-lg italic">
						{t("no_controllers")}
					</h4>
				</div>
			)}
		</>
	);
}

function ControllerCard({ controller }: { controller: LoggedUser }) {
	return (
		<div className="py-4 px-2 xs:px-4 flex items-center justify-between gap-4">
			<div className="flex items-center gap-2 xs:gap-4">
				<Avatar>
					<AvatarImage src={controller.img} />
					<AvatarFallback>
						{controller.name
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
				<Link
					to="/profile/$id"
					params={{ id: controller.id }}
					className="font-semibold hover:underline"
				>
					{controller.name}
				</Link>
			</div>
			<div className="flex justify-end flex-wrap gap-x-4 gap-y-2">
				<EditController controller={controller} />
				<DeleteController controller={controller} />
			</div>
		</div>
	);
}

export function Filters({
	onChange,
	filters,
}: {
	onChange: (filter: string, value: any) => void;
	filters: { name: string; role: string };
}) {
	const { t } = useTranslation();

	return (
		<div className="flex justify-center items-center gap-4 flex-wrap xs:flex-nowrap">
			<Input
				type="text"
				value={filters.name}
				onChange={(e) => onChange("name", e.target.value)}
				placeholder={t("search")}
				className="input"
			/>
			{/* Not a filter but here goes */}
			<NewController />
		</div>
	);
}
