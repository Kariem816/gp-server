import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuTrigger,
	DropdownMenuRadioItem,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { useTranslation } from "~/contexts/translation";

import type { LoggedUser } from "~/types/users";

export function UsersList({ users }: { users: LoggedUser[] }) {
	const { t } = useTranslation();

	return (
		<>
			<div className="divide-y-2">
				{users.map((user) => (
					<UserCard key={user.id} user={user} />
				))}
			</div>
			{users.length === 0 && (
				<div className="flex items-center justify-center h-64">
					<h4 className="text-grey-500 text-lg italic">
						{t("no_users")}
					</h4>
				</div>
			)}
		</>
	);
}

function UserCard({ user }: { user: LoggedUser }) {
	const { t } = useTranslation();

	return (
		<div className="py-4 px-2 xs:px-4 flex items-center justify-between gap-4">
			<div className="flex items-center gap-2 xs:gap-4">
				<Avatar>
					<AvatarImage src={user.img} />
					<AvatarFallback>
						{user.name
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
				<Link
					to="/profile/$id"
					params={{ id: user.id }}
					className="font-semibold hover:underline"
				>
					{user.name}
				</Link>
			</div>
			<div>
				<span className="text-sm text-gray-500 hover:underline">
					{t(user.role)}
				</span>
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
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						{t("role")}
						<ChevronDownIcon className="ms-2" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuRadioGroup
						value={filters.role}
						onValueChange={(v) => {
							onChange("role", v);
						}}
						className="divide-y-2"
					>
						<DropdownMenuRadioItem value="">
							{t("all")}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="admin">
							{t("admin")}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="teacher">
							{t("teacher")}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="student">
							{t("student")}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="security">
							{t("security")}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="controller">
							{t("controller")}
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
